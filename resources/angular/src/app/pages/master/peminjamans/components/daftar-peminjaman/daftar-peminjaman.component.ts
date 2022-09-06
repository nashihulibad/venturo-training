import { Component, OnInit, SimpleChange } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LandaService } from "src/app/core/services/landa.service";
import Swal from "sweetalert2";
import { PeminjamanService } from "../../services/peminjaman.service";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/pages/auth/services/auth.service";

@Component({
    selector: "app-daftar-peminjaman",
    templateUrl: "./daftar-peminjaman.component.html",
    styleUrls: ["./daftar-peminjaman.component.scss"],
})
export class DaftarPeminjamanComponent implements OnInit {
    listPeminjaman: [];
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
    namaSearch: any;

    //for pengembalian
    peminjamanId: any;
    tanggalPengembalian: any;
    denda: any;

    isAdmin = false;

    constructor(
        private peminjamanService: PeminjamanService,
        private landaService: LandaService,
        private modalService: NgbModal,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.currentPage = 1;
        this.judulSearch = "";
        this.namaSearch = "";
        this.authService.getProfile().subscribe((res: any) => {
            let responseAuthUser = res;
            if (responseAuthUser.akses == "Admin") {
                this.isAdmin = true;
                this.getPeminjaman();
            } else {
                console.log("tes");
                this.getPeminjamanByUser();
            }
        });
    }

    trackByIndex(index: number): any {
        return index;
    }

    getPeminjaman() {
        this.peminjamanService
            .getPeminjamans({ judul: this.judulSearch, nama: this.namaSearch })
            .subscribe(
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

    getPeminjamanByUser() {
        this.peminjamanService
            .getPeminjamanByUser({ judul: this.judulSearch })
            .subscribe(
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
                        this.listPeminjaman = res.data.list;

                        this.currentPage = page;
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        }
    }

    getDendaPeminjaman() {
        let dataReq = {
            tanggalPengembalian: this.tanggalPengembalian,
            peminjamanId: this.peminjamanId,
        };

        this.peminjamanService.getDendaPeminjaman(dataReq).subscribe(
            (res: any) => {
                Swal.fire({
                    title: "Jumlah Denda",
                    text: "Rp" + res.data.denda,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#34c38f",
                    cancelButtonColor: "#f46a6a",
                    confirmButtonText: "Kembalikan Peminjaman !",
                }).then((result) => {
                    if (result.value) {
                        this.kembalikan(dataReq);
                        this.getPeminjaman();
                    }
                });
            },
            (err) => {
                this.landaService.alertError("Mohon Maaf", err.error.errors);
            }
        );
    }

    kembalikan(dataReq) {
        this.peminjamanService.setKembaliPeminjaman(dataReq).subscribe(
            (res: any) => {
                this.landaService.alertSuccess(
                    "Berhasil dikembalikan",
                    res.message
                );
            },
            (err) => {
                this.landaService.alertError("Mohon Maaf", err.error.errors);
            }
        );
    }

    showModalKembalikan(modal, peminjamanModel) {

        if(peminjamanModel.is_kembali == 1){
            this.landaService.alertError("Gagal", "buku telah dikembalikan");
            return;
        }

        this.peminjamanId = peminjamanModel.id;
        this.titleModal =
            "Pengembalian Peminjaman Buku : " + peminjamanModel.judul;
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    showModalSearchPeminjaman(modal) {
        this.titleModal = "Pencarian Peminjaman";
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    showForm(show) {
        this.isOpenForm = show;
    }

    createPeminjaman(modal) {
        this.titleModal = "Tambah Peminjaman";
        this.modelId = 0;
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    updatePeminjaman(modal, peminjamanModel) {
        if(peminjamanModel.is_kembali == 1){
            this.landaService.alertError("Gagal", "buku telah dikembalikan");
            return;
        }
        this.titleModal = "Edit Buku: " + peminjamanModel.nama;
        this.modelId = peminjamanModel.id;
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    deletePeminjaman(bukuId) {
        Swal.fire({
            title: "Apakah kamu yakin ?",
            text: "Peminjaman akan dihapus",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Ya, Hapus data ini !",
        }).then((result) => {
            if (result.value) {
                this.peminjamanService.deletePeminjaman(bukuId).subscribe(
                    (res: any) => {
                        this.landaService.alertSuccess("Berhasil", res.message);
                        this.ngOnInit();
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            }
        });
    }
}
