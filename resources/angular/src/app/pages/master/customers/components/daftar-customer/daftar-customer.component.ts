import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LandaService } from 'src/app/core/services/landa.service';
import Swal from 'sweetalert2';
import { CustomerService } from '../../services/customer.service';
import { environment } from "src/environments/environment";
import { AuthService } from 'src/app/pages/auth/services/auth.service';

@Component({
    selector: "customer-daftar",
    templateUrl: "./daftar-customer.component.html",
    styleUrls: ["./daftar-customer.component.scss"],
})
export class DaftarCustomerComponent implements OnInit {
    listCustomer: [];
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
    keywordSearch: any;

    constructor(
        private customerService: CustomerService,
        private landaService: LandaService,
        private modalService: NgbModal,
        private authService:AuthService
    ) {}

    ngOnInit(): void {
        this.currentPage = 1;
        this.keywordSearch = "";
        this.getCustomer();

        this.authService.getProfile().subscribe((res:any)=>{
            console.log(res);
        })
    }

    trackByIndex(index: number): any {
        return index;
    }

    getCustomer() {
        this.customerService
            .getCustomers({ nama: this.keywordSearch })
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
                        this.listCustomer = res.data.list;
                        this.currentPage = page;
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        }
    }

    showModalSearchCustomer(modal) {
        this.titleModal = "Pencarian Customer";
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    showForm(show) {
        this.isOpenForm = show;
    }

    createCustomer(modal) {
        this.titleModal = "Tambah Customer";
        this.modelId = 0;
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    updateCustomer(modal, customerModel) {
        this.titleModal = "Edit Customer: " + customerModel.nama;
        this.modelId = customerModel.id;
        this.modalService.open(modal, { size: "lg", backdrop: "static" });
    }

    deleteCustomer(userId) {
        Swal.fire({
            title: "Apakah kamu yakin ?",
            text: "Customer tidak dapat melakukan pesanan setelah kamu menghapus datanya",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Ya, Hapus data ini !",
        }).then((result) => {
            if (result.value) {
                this.customerService.deleteCustomer(userId).subscribe(
                    (res: any) => {
                        this.landaService.alertSuccess("Berhasil", res.message);
                        this.getCustomer();
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            }
        });
    }
}
