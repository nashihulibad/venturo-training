<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Master\PromoHelper;
use App\Http\Resources\Promo\PromoResource;
use App\Http\Resources\Promo\PromoCollection;
use App\Http\Requests\Promo\CreateRequest;
use App\Http\Requests\Promo\UpdateRequest;
use App\Http\Resources\Promo\DetailResource;

class PromoController extends Controller
{
    protected $promo;

    public function __construct()
    {
        $this->promo = new PromoHelper;
    }

    public function index(Request $request)
    {
        $filter = ['nama' => $request->nama ?? ''];
        $promos = $this->promo->getAll($filter, 5, $request->sort ?? '');

        return response()->success(new PromoCollection($promos));
    }

    public function store(CreateRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->failed($request->validator->errors(), 422);
        }

        $dataInput = $request->only(['nama', 'type', 'diskon', 'nominal', 'kadaluarsa', 'syarat_ketentuan', 'foto']);
        $dataPromo = $this->promo->create($dataInput);

        if (!$dataPromo['status']) {
            return response()->failed($dataPromo['error'], 422);
        }

        return response()->success([], 'Data promo berhasil disimpan');
    }

    public function show($id)
    {
        $dataPromo = $this->promo->getById($id);

        if (empty($dataPromo)) {
            return response()->failed(['Data promo tidak ditemukan']);
        }

        return response()->success(new DetailResource($dataPromo));
    }

    public function update(UpdateRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->failed($request->validator->errors());
        }

        $dataInput = $request->only(['nama', 'id_promo','type', 'diskon', 'nominal', 'kadaluarsa', 'syarat_ketentuan', 'foto']);
        $dataPromo = $this->promo->update($dataInput, $dataInput['id_promo']);

        if (!$dataPromo['status']) {
            return response()->failed($dataPromo['error']);
        }

        return response()->success(new PromoResource($dataPromo['data']), 'Data promo berhasil disimpan');
    }

    public function destroy($id)
    {
        $dataPromo = $this->promo->delete($id);

        if (!$dataPromo) {
            return response()->failed(['Mohon maaf data promo tidak ditemukan']);
        }

        return response()->success($dataPromo);
    }
}

