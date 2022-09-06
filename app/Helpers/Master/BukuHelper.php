<?php

namespace App\Helpers\Master;

use App\Models\Master\BukuModel;
use App\Repository\CrudInterface;

class BukuHelper implements CrudInterface{

    private $bukuModel;

    public function __construct()
    {
        $this->bukuModel = new BukuModel();
    }

    public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        return $this->bukuModel->getAll($filter, $itemPerPage, $sort);
    }

    public function getById(int $id): object
    {
        return $this->bukuModel->getById($id);
    }

    public function create(array $payload): array
    {
        try {

            if(!empty($payload['foto'])){
                $foto = $payload['foto']->store('public/upload/fotoBuku');
                $foto = str_replace('public/','', $foto);
                $payload['foto'] = "http://127.0.0.1:8000/storage/".$foto;
            }

            $buku = $this->bukuModel->store($payload);

            return [
                'status' => true,
                'data' => $buku
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

            $this->bukuModel->edit($payload, $id);

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
            $this->bukuModel->drop($id);
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }
}
