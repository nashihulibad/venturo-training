<?php

namespace App\Http\Resources\Promo;

use Illuminate\Http\Resources\Json\JsonResource;

class DetailResource extends JsonResource
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
            'id' => $this->id_promo,
            'foto' => $this->foto,
            'nama' => $this->nama,
            'syarat_ketentuan' => $this->syarat_ketentuan,
            'type' => $this->type,
            'diskon' => $this->diskon,
            'nominal' => $this->nominal,
            'kadaluarsa' => $this->kadaluarsa,
        ];
    }
}
