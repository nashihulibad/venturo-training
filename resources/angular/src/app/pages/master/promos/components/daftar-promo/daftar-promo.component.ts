import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { environment } from "src/environments/environment";
import { LandaService } from "src/app/core/services/landa.service";
import { PromoService } from "../../services/promo.service";

@Component({
    selector: "app-daftar-promo",
    templateUrl: "./daftar-promo.component.html",
    styleUrls: ["./daftar-promo.component.scss"],
})
export class DaftarPromoComponent implements OnInit {
    listPromos: [];
    titleCard: string;
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

    titleModal: string;
    keywordSearch: any;
    typeSearch : any;
    constructor(
        private promoService: PromoService,
        private landaService: LandaService,
        private modalService: NgbModal
    ) {}

    ngOnInit(): void {
        this.currentPage = 1;
        this.keywordSearch = "";
        this.typeSearch = "";
        this.getPromo();
    }

    trackByIndex(index: number): any {
        return index;
    }

    getPromo() {
        this.promoService.getPromos({ nama: this.keywordSearch, type : this.typeSearch }).subscribe(
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
                        this.listPromos = res.data.list;
                        this.currentPage = page;
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        }
    }

    showModalSearchPromo(modal) {
        this.titleModal = "Pencarian Promo";
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    showForm(show) {
        this.isOpenForm = show;
    }

    createPromo() {
        this.titleCard = "Tambah Promo";
        this.modelId = 0;
        this.showForm(true);
    }

    updatePromo(promoModel) {
        this.titleCard = "Edit Promo: " + promoModel.nama;
        this.modelId = promoModel.id;
        this.showForm(true);
    }

    deletePromo(promoId) {
        Swal.fire({
            title: "Apakah kamu yakin ?",
            text: "Promo tidak dapat melakukan pesanan setelah kamu menghapus datanya",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Ya, Hapus data ini !",
        }).then((result) => {
            if (result.value) {
                this.promoService.deletePromo(promoId).subscribe(
                    (res: any) => {
                        this.landaService.alertSuccess("Berhasil", res.message);
                        this.getPromo();
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            }
        });
    }
}
