<?php

namespace App\Models\Master;

use App\Http\Traits\RecordSignature;
use App\Repository\ModelInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasRelationships;

class BukuModel extends Model implements ModelInterface
{
    use SoftDeletes, RecordSignature, HasRelationships, HasFactory;

    protected $table = 'm_buku';

    public $timestamps = true;

    protected $attributes = [

    ];

    protected $fillable = [
        'judul',
        'author',
        'stok',
        'foto',
        'denda'
    ];

    public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        $dataBuku = $this->query();

        if (!empty($filter['judul'])) {
            $dataBuku->where('judul', 'LIKE', '%'.$filter['judul'].'%');
        }

        $sort = $sort ?: 'id DESC';
        $dataBuku->orderByRaw($sort);
        $itemPerPage = $itemPerPage > 0 ? $itemPerPage : false;

        return $dataBuku->paginate($itemPerPage)->appends('sort', $sort)->appends('judul', $filter['judul']);
    }

    public function fotoUrl() {
        if(empty($this->foto)) {
            return asset('assets/img/no-image.png');
        }

        return $this->foto;
    }

    public function getById(int $id): object
    {
        return $this->query()->find($id);
    }

    public function store(array $payload)
    {
        return $this->create($payload);
    }

    public function edit(array $payload, int $id)
    {
        return $this->find($id)->update($payload);
    }

    public function drop(int $id)
    {
        return $this->find($id)->delete();
    }

}
