<?php

namespace App\Helpers\Master;
use App\Models\Master\OrderModel;

class ReportHelper {
    protected $orderModel;

    public function __construct()
    {
        $this->order = new OrderModel();
    }

    public function getRekapMenu($itemId, $bulan='', $tahun='') : object
    {
        return $this->order->getOrder($itemId, $bulan, $tahun);
    }

}
