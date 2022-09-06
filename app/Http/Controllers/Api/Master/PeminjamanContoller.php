<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\Master\PeminjamanHelper;
use App\Helpers\Master\BukuHelper;
use App\Http\Resources\Peminjaman\PeminjamanResource;
use App\Http\Resources\Peminjaman\PeminjamanCollection;
use App\Http\Resources\Peminjaman\DetailResource;
use App\Http\Requests\Peminjaman\CreateRequest;
use App\Http\Requests\Peminjaman\UpdateRequest;

class PeminjamanContoller extends Controller
{
    protected $peminjaman;

    public function __construct()
    {
        $this->peminjaman = new PeminjamanHelper;
        $this->buku = new BukuHelper;
    }

    public function index(Request $request)
    {
        $filter = ['judul' => $request->judul ?? '','nama' => $request->nama ?? '' ];

        $peminjamans = $this->peminjaman->getAll($filter, 5, $request->sort ?? '');

        return response()->success(new PeminjamanCollection($peminjamans));
    }

    public function getByUser(Request $request)
    {
        $filter = ['judul' => $request->judul ?? ''];

        $peminjamans = $this->peminjaman->getByUser(auth()->user()->id,$filter, 5, $request->sort ?? '');

        return response()->success(new PeminjamanCollection($peminjamans));
    }

    public function store(CreateRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->failed($request->validator->errors(), 422);
        }

        $dataInput = $request->only(['admin_id', 'peminjam_id', 'm_buku_id', 'unit','tanggal_peminjaman' ,'batas_pengembalian','is_kembali','denda']);

        $bukuTerpinjam = $this->buku->getById($dataInput['m_buku_id']);
        if($bukuTerpinjam && $bukuTerpinjam->stok >= $dataInput['unit']){
            $this->buku->update([
                'judul' => $bukuTerpinjam->judul,
                'stok' => $bukuTerpinjam->stok-$dataInput['unit'],
                'author' => $bukuTerpinjam->author,
                'foto' => $bukuTerpinjam->foto
            ], $bukuTerpinjam['id']);
        }
        else{
            return response()->failed("data buku tidak tersedia atau stok tidak cukup", 400);
        }

        $dataPeminjaman = $this->peminjaman->create($dataInput);

        if (!$dataPeminjaman['status']) {
            return response()->failed($dataPeminjaman['error'], 422);
        }

        return response()->success([], 'Data peminjaman berhasil disimpan');
    }

    public function kembalikan(Request $request)
    {
        if(!$request->peminjamanId){
            return response()->failed('id peminjaman tidak ada', 422);
        }

        if(!$request->tanggalPengembalian){
            return response()->failed('tanggal pengembalian tidak ada', 422);
        }

        $dataPeminjaman = $this->peminjaman->getById($request->peminjamanId);
        if(!$dataPeminjaman){
            return response()->failed('data peminjaman tidak ada', 403);
        }

        if($dataPeminjaman->is_kembali == 0){
            $bukuTerpinjam = $this->buku->getById($dataPeminjaman->m_buku_id);
            if($bukuTerpinjam){
                $this->buku->update([
                    'judul' => $bukuTerpinjam->judul,
                    'stok' =>  $bukuTerpinjam->stok + $dataPeminjaman['unit'],
                    'author' => $bukuTerpinjam->author,
                    'foto' => $bukuTerpinjam->foto
                ], $bukuTerpinjam['id']);
            }
        }

        $dataPeminjaman = $this->peminjaman->update([
                'admin_id' => $dataPeminjaman->admin_id,
                'peminjam_id' => $dataPeminjaman->peminjam_id,
                'm_buku_id' => $dataPeminjaman->m_buku_id,
                'unit' => $dataPeminjaman->unit,
                'tanggal_peminjaman' => $dataPeminjaman->tanggal_peminjaman,
                'batas_pengembalian' => $dataPeminjaman->batas_pengembalian,
                'is_kembali' => 1,
                'denda' => $dataPeminjaman->denda,
                'tanggal_pengembalian' => $request->tanggalPengembalian
            ], $dataPeminjaman->id);

        return response()->success(new PeminjamanResource($dataPeminjaman['data']), 'Data peminjaman berhasil disimpan');
    }

    public function show($id)
    {
        $dataPeminjaman = $this->peminjaman->getById($id);

        if (empty($dataPeminjaman)) {
            return response()->failed(['Data peminjaman tidak ditemukan'], 403);
        }

        return response()->success(new DetailResource($dataPeminjaman));
    }

    public function cekDenda(Request $request)
    {
        if(!$request->peminjamanId){
            return response()->failed(['Id peminjaman tidak ada'], 422);
        }

        if(!$request->tanggalPengembalian){
            return response()->failed(['Tanggal pengembalian tidak ada'], 422);
        }

        $dataPeminjaman = $this->peminjaman->getById($request->peminjamanId);
        if (empty($dataPeminjaman)) {
            return response()->failed(['Data peminjaman tidak ditemukan'], 403);
        }

        $bukuTerpinjam = $this->buku->getById($dataPeminjaman['m_buku_id']);

        $diff = strtotime($request->tanggalPengembalian) - strtotime($dataPeminjaman->batas_pengembalian);
        if($diff > 0){
            $dataPeminjaman['denda'] = abs(round($diff / 86400)) * $bukuTerpinjam->denda;
        }

        return response()->success(new DetailResource($dataPeminjaman));

    }

    public function update(UpdateRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->failed($request->validator->errors());
        }

        $dataInput = $request->only(['id','admin_id', 'peminjam_id', 'm_buku_id', 'unit','tanggal_peminjaman', 'batas_pengembalian','is_kembali','denda']);

        $oldDataInput = $this->peminjaman->getById($dataInput['id']);
        if(!$oldDataInput){
            return response()->failed("data peminjaman tidak tersedia", 403);
        }

        $bukuTerpinjam = $this->buku->getById($dataInput['m_buku_id']);
        if($bukuTerpinjam && $bukuTerpinjam->stok + $oldDataInput->unit - $dataInput['unit'] >= 0){
            $this->buku->update([
                'judul' => $bukuTerpinjam->judul,
                'stok' => $bukuTerpinjam->stok + $oldDataInput->unit - $dataInput['unit'],
                'author' => $bukuTerpinjam->author,
                'foto' => $bukuTerpinjam->foto
            ], $bukuTerpinjam['id']);
        }
        else{
            return response()->failed("data buku tidak tersedia atau stok tidak cukup");
        }

        $dataPeminjaman = $this->peminjaman->update($dataInput, $dataInput['id']);

        if (!$dataPeminjaman['status']) {
            return response()->failed($dataPeminjaman['error']);
        }

        return response()->success(new PeminjamanResource($dataPeminjaman['data']), 'Data peminjaman berhasil disimpan');
    }

    public function destroy($id)
    {
        $dataPeminjaman = $this->peminjaman->delete($id);

        if (!$dataPeminjaman) {
            return response()->failed(['Mohon maaf data peminjaman tidak ditemukan']);
        }

        return response()->success($dataPeminjaman);
    }
}
