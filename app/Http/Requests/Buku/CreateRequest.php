<?php

namespace App\Http\Requests\Buku;

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

    protected function base64FileKeys(): array
    {
        return [
            'foto' => 'fotoBuku.jpg',
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
            'judul' => 'required|max:200',
            'stok' => 'required|numeric',
            'foto' => 'nullable|file|image',
            'author' => 'required|max:50'
        ];
    }

    public function failedValidation(Validator $validator)
    {
       $this->validator = $validator;
    }
}
