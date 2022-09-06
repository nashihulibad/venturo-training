<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TPeminjaman extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('t_peminjaman', function (Blueprint $table) {
            $table->id();
            $table->integer('admin_id');
            $table->string('peminjam_id');
            $table->string('m_buku_id')->references('id')->on('m_buku'); 
            $table->date('batas_pengembalian');
            $table->boolean('is_kembali')->default(false);
            $table->integer('denda');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
