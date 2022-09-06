<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasRelationships;

class OrderModel extends Model
{
    use HasRelationships, HasFactory;

    protected $table = 't_order';

    public function getOrder($itemId, $bulan, $tahun)
    {
        $date = $tahun."-".$bulan;
        return self::selectRaw("t_order.id_order, t_order.tanggal, t_detail_order.total, t_detail_order.id_item")
            ->leftJoin('t_detail_order', 't_order.id_order', '=', 't_detail_order.id_order')
            ->where("t_order.tanggal", "like","%".$date."%")
            ->where("t_detail_order.id_item", "=", $itemId)
            ->get();

    }
}
