<?php

namespace App\Http\Requests\Item;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use ProtoneMedia\LaravelMixins\Request\ConvertsBase64ToFiles;

class CreateRequest extends FormRequest
{
    use ConvertsBase64ToFiles;
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */

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
    protected function base64FileKeys(): array
    {
        return [
            'foto' => 'fotoItem.jpg',
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'nama' => 'required|max:100',
            'foto' => 'nullable|file|image',
            'harga' => 'required|numeric',
            'kategori' => 'required'
        ];
    }

    public function failedValidation(Validator $validator)
    {
       $this->validator = $validator;
    }
}
