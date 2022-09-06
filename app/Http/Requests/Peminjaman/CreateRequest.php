<?php

namespace App\Http\Requests\Peminjaman;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use ProtoneMedia\LaravelMixins\Request\ConvertsBase64ToFiles;

class CreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    use ConvertsBase64ToFiles;
    public $validator = null;

    public function authorize()
    {
        return true;
    }

   

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'admin_id' => 'required|numeric',
            'peminjam_id' => 'required|numeric',
            'm_buku_id' => 'required|numeric',
            'batas_pengembalian' => 'required',
            'is_kembali' => 'required',
            'denda' => 'required|numeric'
        ];
    }

    public function failedValidation(Validator $validator)
    {
       $this->validator = $validator;
    }
}
