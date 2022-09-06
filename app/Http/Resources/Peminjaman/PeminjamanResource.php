<?php

namespace App\Http\Resources\Peminjaman;

use Illuminate\Http\Resources\Json\JsonResource;

class PeminjamanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
         return [
            'id' => $this->id,
            'admin_id' => $this->admin_id,
            'peminjam_id' => $this->peminjam_id,
            'm_buku_id' => $this->m_buku_id,
            'unit' => $this->unit,
            'tanggal_peminjaman' => $this->tanggal_peminjaman,
            'batas_pengembalian' => $this->batas_pengembalian,
            'is_kembali' => $this->is_kembali,
            'tanggal_pengembalian' => $this->tanggal_pengembalian,
            'nama' => $this->nama,
            'judul' => $this->judul
        ];
    }
}
