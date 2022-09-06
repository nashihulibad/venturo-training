import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";
import { BukuService } from "../../services/buku.service";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/pages/auth/services/auth.service";

@Component({
    selector: "app-daftar-buku",
    templateUrl: "./daftar-buku.component.html",
    styleUrls: ["./daftar-buku.component.scss"],
})
export class DaftarBukuComponent implements OnInit {
    listBuku: [];
    titleModal: string;
    modelId: number;
    isOpenForm: boolean = false;

    //datatable
    dtOptions: DataTables.Settings = {};

    //pagination
    currentPage: any;
    maxData: any;
    maxPage: any;
    paging = [];
    page = [];

    //for search
    judulSearch: any;

    isAdmin = false;

    constructor(
        private bukuService: BukuService,
        private landaService: LandaService,
        private modalService: NgbModal,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.currentPage = 1;
        this.judulSearch = "";
        this.getBuku();

        this.authService.getProfile().subscribe((res: any) => {
            let responseAuthUser = res;
            if(responseAuthUser.akses == "Admin"){
                this.isAdmin = true;
            }
        });
    }

    trackByIndex(index: number): any {
        return index;
    }

    getBuku() {
        this.bukuService.getBukus({ judul: this.judulSearch }).subscribe(
            (res: any) => {
                this.maxData = res.data.meta.total;
                this.paging = res.data.meta.links;
                this.initPage(this.paging.length);
                this.pagin(this.currentPage);
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
                        this.listBuku = res.data.list;
                        this.currentPage = page;
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        }
    }

    showModalSearchBuku(modal) {
        this.titleModal = "Pencarian Buku";
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    showForm(show) {
        this.isOpenForm = show;
    }

    createBuku(modal) {
        this.titleModal = "Tambah Buku";
        this.modelId = 0;
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    updateBuku(modal, bukuModel) {
        this.titleModal = "Edit Buku: " + bukuModel.nama;
        this.modelId = bukuModel.id;
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    deleteBuku(bukuId) {
        Swal.fire({
            title: "Apakah kamu yakin ?",
            text: "Buku tidak bisa dipinjam jika sudah dihapus",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Ya, Hapus data ini !",
        }).then((result) => {
            if (result.value) {
                this.bukuService.deleteBuku(bukuId).subscribe(
                    (res: any) => {
                        this.landaService.alertSuccess("Berhasil", res.message);
                        this.getBuku();
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            }
        });
    }
}
