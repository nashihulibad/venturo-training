<?php

namespace App\Http\Controllers\Api\Master;

use App\Helpers\Master\ItemHelper;
use App\Helpers\Master\ReportHelper;
use App\Http\Controllers\Controller;


use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->item = new ItemHelper();
        $this->report = new ReportHelper();

    }

    public function getRekapMenu(Request $request)
    {
        $filter = ['nama' => $request->nama ?? 'Ayam', 'kategori' => $request->kategori ?? ''];
        $items = $this->item->getAll($filter, 5, $request->sort ?? '');

        if(!$request->bulan || !$request->tahun){
            //err
        }

        $bulan = $request->bulan;
        $tahun = $request->tahun;

        $dataRekap = array();
        foreach($items as $item){

            $dataRekap[$item->nama] = array_fill(0, 30,0);
            $dataOrderByMenu = $this->report->getRekapMenu($item->id, $bulan,$tahun);

            foreach ($dataOrderByMenu as $d){
                $day = explode("-", $d->tanggal)[2];
                $dataRekap[$item->nama][intval($day)] += $d->total;
            }
        }

        return response()->success($dataRekap);
    }

}
