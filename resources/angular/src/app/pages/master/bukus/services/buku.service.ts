import { Injectable } from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";

@Injectable({
    providedIn: "root",
})
export class BukuService {
    constructor(private landaService: LandaService) {}

    getBukus(arrParameter) {
        return this.landaService.DataGet("/v1/bukus", arrParameter);
    }

    getAllBuku() {
        return this.landaService.DataGet("/v1/bukus/all");
    }

    getBukuById(itemId) {
        return this.landaService.DataGet("/v1/bukus/" + itemId);
    }

    createBuku(payload) {
        return this.landaService.DataPost("/v1/bukus", payload);
    }

    updateBuku(payload) {
        return this.landaService.DataPut("/v1/bukus", payload);
    }

    deleteBuku(itemId) {
        return this.landaService.DataDelete("/v1/bukus/" + itemId);
    }
}
