import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import { environment } from "src/environments/environment";
import { LandaService } from "src/app/core/services/landa.service";
import { ItemService } from "../../services/item.service";

@Component({
    selector: "item-daftar",
    templateUrl: "./daftar-item.component.html",
    styleUrls: ["./daftar-item.component.scss"],
})
export class DaftarItemComponent implements OnInit {
    listItems: [];
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

    constructor(
        private itemService: ItemService,
        private landaService: LandaService,
        private modalService: NgbModal
    ) {}

    ngOnInit(): void {
        this.currentPage = 1;
        this.getItem();
    }

    trackByIndex(index: number): any {
        return index;
    }

    getItem() {
        this.itemService.getItems({ nama: "", kategori: "" }).subscribe(
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
                        this.listItems = res.data.list;
                        this.currentPage = page;
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        }
    }

    showModalSearchItem(modal) {
        this.titleModal = "Pencarian Item";
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    cariItem() {
        this.itemService
            .getItems({
                nama: this.keywordSearch,
            })
            .subscribe(
                (res: any) => {
                    this.listItems = res.data.list;
                    this.maxData = res.data.meta.total;
                    this.paging = res.data.meta.links;
                    this.initPage(this.paging.length);
                },
                (err: any) => {
                    console.log(err);
                }
            );
    }

    showForm(show) {
        this.isOpenForm = show;
    }

    createItem() {
        this.titleCard = "Tambah Item";
        this.modelId = 0;
        this.showForm(true);
    }

    updateItem(itemModel) {
        this.titleCard = "Edit Item: " + itemModel.nama;
        this.modelId = itemModel.id;
        this.showForm(true);
    }

    deleteItem(userId) {
        Swal.fire({
            title: "Apakah kamu yakin ?",
            text: "Item tidak dapat melakukan pesanan setelah kamu menghapus datanya",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Ya, Hapus data ini !",
        }).then((result) => {
            if (result.value) {
                this.itemService.deleteItem(userId).subscribe(
                    (res: any) => {
                        this.landaService.alertSuccess("Berhasil", res.message);
                        this.getItem();
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            }
        });
    }
}
