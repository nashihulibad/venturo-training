import { Injectable } from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";

@Injectable({
    providedIn: "root",
})
export class UserService {
    constructor(private landaService: LandaService) {}

    getProfile() {
        return this.landaService.DataGet("/v1/auth/profile");
    }

    getUsers(arrParameter) {
        return this.landaService.DataGet("/v1/users", arrParameter);
    }

    getAllUser() {
        return this.landaService.DataGet("/v1/users/all");
    }

    getUserById(userId) {
        return this.landaService.DataGet("/v1/users/" + userId);
    }

    createUser(payload) {
        return this.landaService.DataPost("/v1/users", payload);
    }

    updateUser(payload) {
        return this.landaService.DataPut("/v1/users", payload);
    }

    deleteUser(userId) {
        return this.landaService.DataDelete("/v1/users/" + userId);
    }
}
