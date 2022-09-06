<?php

namespace App\Models\Master;

use App\Http\Traits\RecordSignature;
use App\Repository\ModelInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasRelationships;

use function PHPSTORM_META\map;

class PeminjamanModel extends Model implements ModelInterface
{
    use SoftDeletes, RecordSignature, HasRelationships, HasFactory;

    protected $table = 't_peminjaman';

    public $timestamps = true;


    protected $fillable = [
        'admin_id',
        'peminjam_id',
        'm_buku_id',
        'unit',
        'tanggal_peminjaman',
        'batas_pengembalian',
        'is_kembali',
        'tanggal_pengembalian',
        'denda'
    ];


    public function getAll(array $filter, int $itemPerPage = 0, string $sort = ''): object
    {
        $dataPeminjaman = self::selectRaw("m_buku.judul as judul, t_peminjaman.id as id,t_peminjaman.admin_id,
            t_peminjaman.peminjam_id, t_peminjaman.m_buku_id, t_peminjaman.unit,
            t_peminjaman.tanggal_peminjaman ,t_peminjaman.batas_pengembalian,
            t_peminjaman.is_kembali, t_peminjaman.tanggal_pengembalian ,user_auth.nama as nama")
            ->leftJoin('m_buku', 't_peminjaman.m_buku_id', '=', 'm_buku.id')
            ->leftJoin('user_auth', 't_peminjaman.peminjam_id','=','user_auth.id');

        if (!empty($filter['judul'])) {
            $dataPeminjaman->where('m_buku.judul', 'LIKE', "%".$filter['judul']."%");
        }

        if(!empty($filter['nama'])){
            $dataPeminjaman->where('user_auth.nama', 'LIKE', "%".$filter['nama']."%");
        }
        

        $sort = $sort ?: 'id DESC';
        $dataPeminjaman->orderByRaw($sort);
        $itemPerPage = $itemPerPage > 0 ? $itemPerPage : false;

        return $dataPeminjaman->paginate($itemPerPage)->appends('sort', $sort)
        ->appends('judul', $filter['judul'])->appends('nama', $filter['nama']);
    }

    public function getByUser($userId, array $filter, int $itemPerPage = 0, string $sort = '')
    {
       $dataPeminjaman = self::selectRaw("m_buku.judul as judul, t_peminjaman.id as id,t_peminjaman.admin_id,
            t_peminjaman.peminjam_id, t_peminjaman.m_buku_id, t_peminjaman.unit,
            t_peminjaman.tanggal_peminjaman ,t_peminjaman.batas_pengembalian,
            t_peminjaman.is_kembali, t_peminjaman.tanggal_pengembalian ,user_auth.nama as nama")
            ->leftJoin('m_buku', 't_peminjaman.m_buku_id', '=', 'm_buku.id')
            ->leftJoin('user_auth', 't_peminjaman.peminjam_id','=','user_auth.id');

        if (!empty($filter['judul'])) {
            $dataPeminjaman->where('judul', 'LIKE', "%".$filter['judul']."%");
        }

        $dataPeminjaman->where('peminjam_id',$userId);

        $sort = $sort ?: 'id DESC';
        $dataPeminjaman->orderByRaw($sort);
        $itemPerPage = $itemPerPage > 0 ? $itemPerPage : false;

        return $dataPeminjaman->paginate($itemPerPage)->appends('sort', $sort)
        ->appends('judul', $filter['judul']);
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
