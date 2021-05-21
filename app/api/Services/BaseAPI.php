<?php
/**
 * Created by IntelliJ IDEA.
 * User: trungnguyen
 * Date: 14/07/2020
 * Time: 10:11
 */

namespace App\Api\Services;

class BaseAPI
{
    public function apiSuccess($message)
    {
        $this->setApiHeader();
        return json_encode(['code' => 200, 'message' => $message]);
    }

    public function apiFail($message)
    {
        $this->setApiHeader();
        return json_encode(['code' => 500, 'message' => $message]);
    }

    public function apiJson($data)
    {
        $this->setApiHeader();
        return json_encode($data);
    }

    public function setApiHeader()
    {
        header('Content-type: application/json');
    }
}