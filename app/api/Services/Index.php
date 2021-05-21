<?php
/**
 * Created by IntelliJ IDEA.
 * User: trungnguyen
 * Date: 13/07/2020
 * Time: 10:28
 */

namespace App\Api\Services;

class Index extends BaseAPI
{
    protected $google_sheet_api_service;
    const GET_DATA_API_URL = 'https://www.googleapis.com/customsearch/v1';

    public function __construct()
    {
        $this->google_sheet_api_service = new SheetApiServices();
    }

    /**
     *
     */
    public function checkAuthorized()
    {
        $result = $this->google_sheet_api_service->isAuthorized();
        if (!$result['is_authorized']) {
            echo $this->apiFail($result['auth_url']);
            return;
        }
        echo $this->apiSuccess('');
    }

    public function ValidateSheetUrl()
    {
        if (!$this->google_sheet_api_service->getSheetId()) {
            echo $this->apiFail('Invalid Sheet Url');
            return;
        }
        echo $this->apiSuccess($this->google_sheet_api_service->initSheet());
    }

    public function processRedirect($request)
    {
        $code = $request['code'];
        $this->google_sheet_api_service->refreshAccessTokenByCode($code);

        $http_host = $request['location_url'];
        header('Location: ' . $http_host, true, 303);
        die();
    }

    public function getDataTable($fields)
    {
        if (isset($fields['action']) && !empty($fields['action'])) {
            unset($fields['action']);
        }
        $fields_string = http_build_query($fields);
        // we are the parent
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, self::GET_DATA_API_URL . '?' . $fields_string);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($httpCode === 200) {
            $this->setApiHeader();
            echo $response;
        }
    }

    public function addSingleRecord($request)
    {
        echo $this->apiSuccess($this->google_sheet_api_service->addSingleRecord($request['item']));
    }

    public function addAllRecord($request)
    {
        echo $this->apiSuccess($this->google_sheet_api_service->addAllRecord($request['item']));
    }

    public function deDup()
    {
        $result = $this->google_sheet_api_service->deDup();
        if (!$result) {
            echo $this->apiFail('Please input the Google Sheet url first.');
            return;
        }
        echo $this->apiSuccess($result);
    }
}