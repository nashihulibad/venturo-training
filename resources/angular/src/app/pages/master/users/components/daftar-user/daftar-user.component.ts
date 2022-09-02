import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LandaService } from 'src/app/core/services/landa.service';
import Swal from 'sweetalert2';
import { environment } from "src/environments/environment";
import { UserService } from '../../services/user-service.service';
import { max } from 'rxjs/operators';

@Component({
    selector: "user-daftar",
    templateUrl: "./daftar-user.component.html",
    styleUrls: ["./daftar-user.component.scss"],
})
export class DaftarUserComponent implements OnInit {
    listUser: [];
    titleModal: string;
    modelId: number;
    searchName = '';

    //datatable
    dtOptions: DataTables.Settings = {};

    //pagination
    currentPage: any;
    maxData: any;
    maxPage: any;
    paging = [];
    page = [];

    constructor(
        private userService: UserService,
        private landaService: LandaService,
        private modalService: NgbModal
    ) {}

    ngOnInit(): void {
        this.currentPage = 1;
        this.getUser();
    }

    trackByIndex(index: number): any {
        return index;
    }

    getUser() {
        this.userService.getUsers({nama : ''}).subscribe(
            (res: any) => {
                this.listUser = res.data.list;
                this.maxData = res.data.meta.total;
                this.paging = res.data.meta.links;
                this.initPage(this.paging.length);
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    initPage(page = 1) {
        this.page = new Array(page);
        for (let i = 1; i <= page; i++) {
            this.page[i - 1] = i;
        }
    }

    pagin(page: any) {
       
        if (page >= 1 && page <= this.paging.length) {
            this.landaService
                .DataGet(this.paging[page - 1].replace(environment.apiURL, ""))
                .subscribe(
                    (res: any) => {
                        this.listUser = res.data.list;
                        this.currentPage = page;
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        }
    }

    showModalSearchUser(modal) {
        this.titleModal = "Pencarian User";
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    cariUser() {
        this.userService.getUsers({ nama: this.searchName }).subscribe(
            (res: any) => {
                this.listUser = res.data.list;
                this.maxData = res.data.meta.total;
                this.paging = res.data.meta.links;
                this.initPage(this.paging.length);
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    createUser(modal) {
        this.titleModal = "Tambah User";
        this.modelId = 0;
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    updateUser(modal, userModel) {
        this.titleModal = "Edit User: " + userModel.nama;
        this.modelId = userModel.id;
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    deleteUser(userId) {
        Swal.fire({
            title: "Apakah kamu yakin ?",
            text: "User ini tidak dapat login setelah kamu menghapus datanya",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Ya, Hapus data ini !",
        }).then((result) => {
            if (result.value) {
                this.userService.deleteUser(userId).subscribe(
                    (res: any) => {
                        this.landaService.alertSuccess("Berhasil", res.message);
                        this.getUser();
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            }
        });
    }
}
