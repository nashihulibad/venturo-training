<?php

namespace App\Http\Requests\Promo;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use ProtoneMedia\LaravelMixins\Request\ConvertsBase64ToFiles;

class CreateRequest extends FormRequest
{
    use ConvertsBase64ToFiles;
    public $validator = null;

    public function authorize()
    {
        return true;
    }

    protected function base64FileKeys(): array
    {
        return [
            'foto' => 'fotoPromo.jpg',
        ];
    }

    public function rules()
    {
        return [
            'nama' => 'required|max:100',
            'type' => 'required',
            'kadaluarsa' => 'required|numeric',
            'foto' => 'nullable|file|image',
            'diskon' => 'nullable',
            'nominal' => 'nullable',
            'syarat_ketentuan' => 'required'
        ];
    }

    public function failedValidation(Validator $validator)
    {
       $this->validator = $validator;
    }
}
