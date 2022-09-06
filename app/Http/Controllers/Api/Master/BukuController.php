<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Master\BukuHelper;
use App\Http\Resources\Buku\BukuResource;
use App\Http\Resources\Buku\BukuCollection;
use App\Http\Requests\Buku\CreateRequest;
use App\Http\Requests\Buku\UpdateRequest;
use App\Http\Resources\Buku\DetailResource;

class BukuController extends Controller
{
    protected $buku;

    public function __construct()
    {
        $this->buku = new BukuHelper;
    }

    public function index(Request $request)
    {
        $filter = ['judul' => $request->judul ?? ''];

        $bukus = $this->buku->getAll($filter, 5, $request->sort ?? '');

        return response()->success(new BukuCollection($bukus));
    }

    public function getAllBuku(Request $request)
    {
        $filter = ['judul' => $request->judul ?? ''];
        $bukus = $this->buku->getAll($filter, 0, $request->sort ?? '');
        return response()->success(new BukuCollection($bukus));
    }

    public function store(CreateRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->failed($request->validator->errors(), 422);
        }

        $dataInput = $request->only(['judul', 'author', 'foto', 'stok','denda']);
        $dataBuku = $this->buku->create($dataInput);

        if (!$dataBuku['status']) {
            return response()->failed($dataBuku['error'], 422);
        }

        return response()->success([], 'Data buku berhasil disimpan');
    }

    public function show($id)
    {
        $dataBuku = $this->buku->getById($id);

        if (empty($dataBuku)) {
            return response()->failed(['Data buku tidak ditemukan']);
        }

        return response()->success(new DetailResource($dataBuku));
    }

    public function update(UpdateRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->failed($request->validator->errors());
        }

       $dataInput = $request->only(['judul', 'author', 'foto', 'stok','id','denda']);
        $dataBuku = $this->buku->update($dataInput, $dataInput['id']);

        if (!$dataBuku['status']) {
            return response()->failed($dataBuku['error']);
        }

        return response()->success(new BukuResource($dataBuku['data']), 'Data buku berhasil disimpan');
    }

    public function destroy($id)
    {
        $dataBuku = $this->buku->delete($id);

        if (!$dataBuku) {
            return response()->failed(['Mohon maaf data buku tidak ditemukan']);
        }

        return response()->success($dataBuku);
    }
}
