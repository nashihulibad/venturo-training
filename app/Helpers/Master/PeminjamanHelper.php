<?php

namespace App\Helpers\Master;

use App\Models\Master\PeminjamanModel;
use App\Repository\CrudInterface;

class PeminjamanHelper implements CrudInterface{

    private $peminjamanModel;

    public function __construct()
    {
        $this->peminjamanModel = new PeminjamanModel();
    }

    public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        return $this->peminjamanModel->getAll($filter, $itemPerPage, $sort);
    }

    public function getByUser(int $userId,array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        return $this->peminjamanModel->getByUser($userId,$filter, $itemPerPage, $sort);
    }

    public function getById(int $id): object
    {
        return $this->peminjamanModel->getById($id);
    }

    public function create(array $payload): array
    {
        try {

            $buku = $this->peminjamanModel->store($payload);

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

            $this->peminjamanModel->edit($payload, $id);

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
            $this->peminjamanModel->drop($id);
            return true;
        } catch (\Throwable $th) {
            return false;
        }
    }
}
