<?php

namespace App\Http\Resources\Buku;

use Illuminate\Http\Resources\Json\JsonResource;

class BukuResource extends JsonResource
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
            'foto' => $this->foto,
            'fotoUrl' => $this->fotoUrl(),
            'judul' => $this->judul,
            'stok' => $this->stok,
            'author' => $this->author,
            'denda' => $this->denda
        ];
    }
}
