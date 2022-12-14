<?php

namespace App\Helpers\Master;

use App\Models\Master\PromoModel;
use App\Repository\CrudInterface;


class PromoHelper implements CrudInterface{
    private $promoModel;

    public function __construct()
    {
        $this->promoModel = new PromoModel();
    }

      public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        return $this->promoModel->getAll($filter, $itemPerPage, $sort);
    }

    public function getById(int $id): object
    {
        return $this->promoModel->getById($id);
    }

    public function create(array $payload): array
    {
        try {

            if(!empty($payload['foto'])){
                $foto = $payload['foto']->store('public/upload/fotoPromo');
                $foto = str_replace('public/','', $foto);
                $payload['foto'] = "http://127.0.0.1:8000/storage/".$foto;
            }

            $promo = $this->promoModel->store($payload);

            return [
                'status' => true,
                'data' => $promo
            ];
        } catch (\Throwable $th) {
            return [
                'status' => false,
                'error' => $th->getMessage()
            ];
        }
    }


    public function update(array $payload, int $id): array
    {
        try {
            
            if(!empty($payload['foto'])){
                $foto = $payload['foto']->store('public/upload/fotoPromo');
                $foto = str_replace('public/','', $foto);
                $payload['foto'] = "http://127.0.0.1:8000/storage/".$foto;
            }

            $this->promoModel->edit($payload, $id);

            return [
                'status' => true,
                'data' => $this->getById($id)
            ];
        } catch (\Throwable $th) {
            return [
                'status' => false,
                'error' => $th->getMessage()
            ];
        }
    }


    public function delete(int $id): bool
    {
        try {
            $this->promoModel->drop($id);
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }
}
