<?php

use App\Http\Controllers\Api\User\AuthController;
use App\Http\Controllers\Api\User\RoleController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\Master\CustomerController;
use App\Http\Controllers\Api\Master\ItemController;
use App\Http\Controllers\Api\Master\PromoController;
use App\Http\Controllers\Api\Master\BukuController;
use App\Http\Controllers\Api\Master\PeminjamanContoller;
use App\Http\Controllers\Api\Master\ReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(function () {
    /**
     * CRUD user
     */
    Route::get('/users', [UserController::class, 'index'])->middleware(['web', 'auth.api:user_view']);
    Route::get('/users/all', [UserController::class, 'getAllUser'])->middleware(['web', 'auth.api:user_view']);
    Route::get('/users/{id}', [UserController::class, 'show'])->middleware(['web', 'auth.api:user_view']);
    Route::post('/users', [UserController::class, 'store'])->middleware(['web', 'auth.api:user_create']);
    Route::put('/users', [UserController::class, 'update'])->middleware(['web', 'auth.api:user_update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware(['web', 'auth.api:user_delete']);

    /**
     * CRUD role / hak akses
     */
    Route::get('/roles', [RoleController::class, 'index'])->middleware(['web', 'auth.api:roles_view']);
    Route::get('/roles/{id}', [RoleController::class, 'show'])->middleware(['web', 'auth.api:roles_view']);
    Route::post('/roles', [RoleController::class, 'store'])->middleware(['web', 'auth.api:roles_create']);
    Route::put('/roles', [RoleController::class, 'update'])->middleware(['web', 'auth.api:roles_update']);
    Route::delete('/roles/{id}', [RoleController::class, 'destroy'])->middleware(['web', 'auth.api:roles_delete']);

     /**
     * CRUD customer
     */
    Route::get('/customers', [CustomerController::class, 'index'])->middleware(['web', 'auth.api:customer_view']);
    Route::get('/customers/{id}', [CustomerController::class, 'show'])->middleware(['web', 'auth.api:customer_view']);
    Route::post('/customers', [CustomerController::class, 'store'])->middleware(['web', 'auth.api:customer_create']);
    Route::put('/customers', [CustomerController::class, 'update'])->middleware(['web', 'auth.api:customer_update']);
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])->middleware(['web', 'auth.api:customer_delete']);

     /**
     * CRUD items / produk
     */
    Route::get('/items', [ItemController::class, 'index'])->middleware(['web', 'auth.api:item_view']);
    Route::get('/items/{id}', [ItemController::class, 'show'])->middleware(['web', 'auth.api:item_view']);
    Route::post('/items', [ItemController::class, 'store'])->middleware(['web', 'auth.api:item_create']);
    Route::put('/items', [ItemController::class, 'update'])->middleware(['web', 'auth.api:item_update']);
    Route::delete('/items/{id}', [ItemController::class, 'destroy'])->middleware(['web', 'auth.api:item_delete']);

     /**
     * CRUD promos
     */
    Route::get('/promos', [PromoController::class, 'index'])->middleware(['web', 'auth.api:promo_view']);
    Route::get('/promos/{id}', [PromoController::class, 'show'])->middleware(['web', 'auth.api:promo_view']);
    Route::post('/promos', [PromoController::class, 'store'])->middleware(['web', 'auth.api:promo_create']);
    Route::put('/promos', [PromoController::class, 'update'])->middleware(['web', 'auth.api:promo_update']);
    Route::delete('/promos/{id}', [PromoController::class, 'destroy'])->middleware(['web', 'auth.api:promo_delete']);


     /**
     * CRUD bukus
     */
    Route::get('/bukus', [BukuController::class, 'index'])->middleware(['web', 'auth.api:buku_view']);
    Route::get('/bukus/all', [BukuController::class, 'getAllBuku'])->middleware(['web', 'auth.api:buku_view']);
    Route::get('/bukus/{id}', [BukuController::class, 'show'])->middleware(['web', 'auth.api:buku_view']);
    Route::post('/bukus', [BukuController::class, 'store'])->middleware(['web', 'auth.api:buku_create']);
    Route::put('/bukus', [BukuController::class, 'update'])->middleware(['web', 'auth.api:buku_update']);
    Route::delete('/bukus/{id}', [BukuController::class, 'destroy'])->middleware(['web', 'auth.api:buku_delete']);

    /**
     * CRUD peminjamans
     */
    Route::get('/peminjamans', [PeminjamanContoller::class, 'index'])->middleware(['web', 'auth.api:peminjaman_view']);
    Route::get('/peminjamans/users', [PeminjamanContoller::class, 'getByUser'])->middleware(['web', 'auth.api:peminjaman_user']);
    Route::get('/peminjamans/{id}', [PeminjamanContoller::class, 'show'])->middleware(['web', 'auth.api:peminjaman_view']);
    Route::post('/peminjamans', [PeminjamanContoller::class, 'store'])->middleware(['web', 'auth.api:peminjaman_create']);
    Route::put('/peminjamans', [PeminjamanContoller::class, 'update'])->middleware(['web', 'auth.api:peminjaman_update']);
    Route::delete('/peminjamans/{id}', [PeminjamanContoller::class, 'destroy'])->middleware(['web', 'auth.api:peminjaman_delete']);
    Route::post('/peminjamans/kembali', [PeminjamanContoller::class, 'kembalikan'])->middleware(['web', 'auth.api:peminjaman_update']);
     Route::post('/peminjamans/denda', [PeminjamanContoller::class, 'cekDenda'])->middleware(['web', 'auth.api:peminjaman_update']);

    /**
     * Route khusus authentifikasi
     */
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile'])->middleware(['auth.api']);
        Route::get('/csrf', [AuthController::class, 'csrf'])->middleware(['web']);
    });
});

Route::get('/', function () {
    return response()->failed(['Endpoint yang anda minta tidak tersedia']);
});

/**
 * Jika Frontend meminta request endpoint API yang tidak terdaftar
 * maka akan menampilkan HTTP 404
 */
Route::fallback(function () {
    return response()->failed(['Endpoint yang anda minta tidak tersedia']);
});
