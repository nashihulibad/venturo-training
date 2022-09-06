import { Injectable } from '@angular/core';
import { LandaService } from "src/app/core/services/landa.service";

@Injectable({
    providedIn: "root",
})
export class PeminjamanService {
    constructor(private landaService: LandaService) {}

    getPeminjamans(arrParameter) {
        return this.landaService.DataGet("/v1/peminjamans", arrParameter);
    }

    getPeminjamanById(itemId) {
        return this.landaService.DataGet("/v1/peminjamans/" + itemId);
    }

    createPeminjaman(payload) {
        return this.landaService.DataPost("/v1/peminjamans", payload);
    }

    updatePeminjaman(payload) {
        return this.landaService.DataPut("/v1/peminjamans", payload);
    }

    deletePeminjaman(itemId) {
        return this.landaService.DataDelete("/v1/peminjamans/" + itemId);
    }

    getPeminjamanByUser(arrParameter){
        return this.landaService.DataGet("/v1/peminjamans/users");
    }

    setKembaliPeminjaman(arrParameter){
        return this.landaService.DataPost("/v1/peminjamans/kembali", arrParameter);
    }

    getDendaPeminjaman(arrParameter){
        return this.landaService.DataPost(
            "/v1/peminjamans/denda",
            arrParameter
        );
    }
}
