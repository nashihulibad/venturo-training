<?php

namespace App\Models\Master;

use App\Http\Traits\RecordSignature;
use App\Repository\ModelInterface;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasRelationships;


class PromoModel extends Model implements ModelInterface
{
    use SoftDeletes, RecordSignature, HasRelationships, HasFactory;

    protected $table = 'm_promo';


    protected $primaryKey = 'id_promo';


    public $timestamps = false;

    protected $attributes = [

    ];

    protected $fillable = [
        'nama',
        'type',
        'diskon',
        'nominal',
        'kadaluarsa',
        'syarat_ketentuan',
        'foto',
    ];


    public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        $dataPromo = $this->query();

        if (!empty($filter['nama'])) {
            $dataPromo->where('nama', 'LIKE', '%'.$filter['nama'].'%');
        }

        if(!empty($filter['type'])){
            $dataPromo->where('type', '=', $filter['type']);
        }

        $sort = $sort ?: 'id_promo DESC';
        $dataPromo->orderByRaw($sort);
        $itemPerPage = $itemPerPage > 0 ? $itemPerPage : false;

        return $dataPromo->paginate($itemPerPage)->appends('sort', $sort)
        ->appends('nama', $filter['nama'])->appends('type', $filter['type']);
    }

    public function fotoUrl() {
        if(empty($this->foto)) {
            return asset('assets/img/no-image.png');
        }

        return $this->foto;
    }

    public function getById(int $id): object
    {
        return $this->find($id);
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
