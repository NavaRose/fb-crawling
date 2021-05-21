<?php
/**
 * Created by IntelliJ IDEA.
 * User: trungnguyen
 * Date: 13/07/2020
 * Time: 17:53
 */

namespace App\Api\Services;

use Google_Client;
use Google_Service_Sheets;
use function GuzzleHttp\Psr7\copy_to_string;

class SheetApiServices
{
    protected $credentials_path = API_DIR . 'credentials.json';
    protected $token_path = API_DIR . 'token.json';
    protected $google_service_sheet;
    /** @var Google_Client $client */
    protected $client;

    public function __construct()
    {
        $this->getClient();
        $this->google_service_sheet = new Google_Service_Sheets($this->client);
    }

    public function isAuthorized(): array
    {
        if ($this->client->isAccessTokenExpired()) {
            // Refresh the token if possible, else fetch a new one.
            if (!$this->client->getRefreshToken()) {
                return [
                    'auth_url' => $this->client->createAuthUrl(),
                    'is_authorized' => false
                ];
            }
            $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
            // Save the token to a file.
            if (!file_exists(dirname($this->token_path))) {
                mkdir(dirname($this->token_path), 0700, true);
            }
            file_put_contents($this->token_path, json_encode($this->client->getAccessToken()));
        }
        return [
            'is_authorized' => true
        ];
    }

    public function getClient(): void
    {
        $http_host = $_REQUEST['location_url'] . '/index.php?action=auth_redirect&location_url=' . $_REQUEST['location_url'];
        $this->client = new Google_Client();
        $this->client->setApplicationName('Facebook Discovery');
        $this->client->setScopes(Google_Service_Sheets::DRIVE);
        $this->client->setAuthConfig($this->credentials_path);
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');
        $this->client->setRedirectUri($http_host);
        if (file_exists($this->token_path)) {
            $accessToken = json_decode(file_get_contents($this->token_path), true);
            $this->client->setAccessToken($accessToken);
        }
    }

    public function refreshAccessTokenByCode($code): void
    {
        $authCode = trim($code);

        // Exchange authorization code for an access token.
        $accessToken = $this->client->fetchAccessTokenWithAuthCode($authCode);
        $this->client->setAccessToken($accessToken);

        // Check to see if there was an error.
        if (array_key_exists('error', $accessToken)) {
            throw new \Exception(join(', ', $accessToken));
        }
        // Save the token to a file.
        if (!file_exists(dirname($this->token_path))) {
            if (!mkdir($concurrentDirectory = dirname($this->token_path), 0700, true) && !is_dir($concurrentDirectory)) {
                throw new \RuntimeException(sprintf('Directory "%s" was not created', $concurrentDirectory));
            }
        }
        file_put_contents($this->token_path, json_encode($this->client->getAccessToken()));
    }

    public function addSingleRecord($request): string
    {
        return $this->addAllRecord($request);
    }

    public function addAllRecord($item): string
    {
        // Process data
        foreach ($item as $index => $row) {
            [$likes, $phone_result] = $this->extractPhoneAndLikes($row[2], $row[3]);
            $phone = implode(', ', $phone_result);
            $item[$index][3] = $likes ?? '';
            $item[$index][4] = $phone ?? '';
        }
        // Get sheet id form sheet url
        $spreadsheetId = $this->getSheetId();
        $range = $this->getFirstDataSheet()->title . '!A2:E';

        $values = $item;
        $body = new \Google_Service_Sheets_ValueRange([
            'values' => $values
        ]);
        $params = [
            'valueInputOption' => 'RAW'
        ];
        $result = $this->google_service_sheet->spreadsheets_values->append($spreadsheetId, $range, $body, $params);
        return $result->getUpdates()->getUpdatedCells() . ' cells appended.';
    }

    public function deDup()
    {
        $spreadsheetId = $this->getSheetId();
        if (!$spreadsheetId) {
            return false;
        }
        $params = array(
            'ranges' => $this->getFirstDataSheet()->title . '!A2:E'
        );
        $result = $this->google_service_sheet->spreadsheets_values->batchGet($spreadsheetId, $params);
        $data = $result->getValueRanges()[0]->getValues();
        $de_duplicated_data = $this->deDuplicate($data, 1);
        $this->google_service_sheet->spreadsheets_values->clear($this->getSheetId(), $this->getFirstDataSheet()->title . '!A2:E', new \Google_Service_Sheets_ClearValuesRequest(), []);
        $this->updateRecord($this->processValuesBeforeUpdate($de_duplicated_data));
        return count($result->getValueRanges())  . " ranges retrieved.";
    }

    public function getSheetId()
    {
        return explode('/', $_COOKIE['sheet_url'])[5];
    }

    public function initSheet()
    {
        $spreadsheetId = $this->getSheetId();
        if (!$spreadsheetId) {
            return false;
        }
        $body = new \Google_Service_Sheets_ValueRange([
            'values' => [
                ['Title', 'Page URL', 'Snippet', 'Likes', 'Phone']
            ]
        ]);
        $params = [
            'valueInputOption' => 'RAW'
        ];
        $result = $this->google_service_sheet->spreadsheets_values->update($this->getSheetId(), $this->getFirstDataSheet()->title . '!A1:E', $body, $params);
        return 'Init sheet successful';
    }

    public function getFirstDataSheet()
    {
        $spreadsheet_data = $this->google_service_sheet->spreadsheets->get($this->getSheetId());
        if (count($spreadsheet_data->getSheets()) > 0) {
            $target_sheet = $spreadsheet_data->getSheets()[0];
            return $target_sheet->getProperties();
        }
        return null;
    }

    public function deDuplicate($array, $key): array
    {
        $temp_array = array();
        $i = 0;
        $key_array = array();

        foreach($array as $val) {
            if (!in_array($val[$key], $key_array)) {
                $key_array[$i] = $val[$key];
                $temp_array[$i] = $val;
            }
            $i++;
        }
        return $temp_array;
    }

    public function updateRecord($values): void
    {
        $body = new \Google_Service_Sheets_ValueRange([
            'values' => $values
        ]);
        $params = [
            'valueInputOption' => 'RAW'
        ];
        $result = $this->google_service_sheet->spreadsheets_values->update($this->getSheetId(), $this->getFirstDataSheet()->title . '!A2:E', $body, $params);
    }

    private function processValuesBeforeUpdate($data): array
    {
        $processed = [];
        foreach ($data as $row) {
            $processed_col = [];
            foreach ($row as $col) {
                $processed_col[] = $col;
            }
            $processed[] = $processed_col;
        }
        return $processed;
    }

    private function extractPhoneAndLikes($content, $like_included_content): array
    {
        $processed_content = str_replace(['-', '.', ' '], '', preg_replace('/[\r\n]/', '', $content));
        $phone = null;
        $likes = null;
        foreach ($this->getPhoneRegexCollection() as $regex) {
            preg_match_all($regex, $processed_content,$matched_phone);
            if (!empty($matched_phone[0])) {
                $phone[] = implode(', ', $matched_phone[0]);
            }
        }

        foreach ($this->getLikesRegexCollection() as $regex) {
            preg_match($regex, preg_replace('/[\r\n]/', '', $like_included_content),$matched_likes);
            if (!empty($matched_likes[0])) {
                $likes = $matched_likes[0];
                $likes_matched_arr = explode(' ', $likes);
                $likes = $likes_matched_arr[0] ?? '';
            }
        }
        $likes = str_replace(',', '.', $likes);
        return [$likes, $phone];
    }

    private function getPhoneRegexCollection(): array
    {
        return [
            '/\+?(0|84)\d{9}/',
            '/\+?(0|84)\d{10}/'
        ];
    }

    private function getLikesRegexCollection(): array
    {
        return [
            '/\d+ likes/',
            '/\d+(M|K) likes/',
            '/\d+(|\.|\,)\d+ likes/',
            '/\d+(|\.|\,)\d+(M|K) likes/',
            '/\d+(|\.|\,)\d+(|\.|\,)\d+ likes/'
        ];
    }
}