<?php
/**
 * Created by IntelliJ IDEA.
 * User: trungnguyen
 * Date: 14/07/2020
 * Time: 09:59
 */

include_once __DIR__ . '/vendor/autoload.php';
include_once __DIR__ . '/app/api/Services/Index.php';
define('API_DIR', __DIR__ . '/app/api/');

$is_ajax = 'xmlhttprequest' === strtolower( $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '' );
try {
    $api_index = new  \App\Api\Services\Index();
    $action = $_REQUEST['action'];
    $request = $_REQUEST;
    switch ($action) {
        case 'get_data':
            $api_index->getDataTable($request);
            break;
        case 'validate_sheet_url':
            $api_index->ValidateSheetUrl();
            break;
        case 'check_authorized':
            $api_index->checkAuthorized();
            break;
        case 'auth_redirect':
            $api_index->processRedirect($request);
            break;
        case 'add_single_record':
            $api_index->addSingleRecord($request);
            break;
        case 'add_all_record':
            $api_index->addAllRecord($request);
            break;
        case 'de_dup':
            $api_index->deDup();
            break;
        default:
            header('Content-type: text/html');
            $html = file_get_contents('index.html');
            echo $html;
            break;
    }
} catch (Exception $e) {
    if ($is_ajax) {
        $error_data = json_decode($e->getMessage(), true);
        $api_index->setApiHeader();
        echo $api_index->apiJson([
            'code' => $e->getCode(),
            'message' => $error_data['error']['message']
        ]);
    } else {
        echo $e;
    }
}