import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChange,
} from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";
import { PeminjamanService } from "../../services/peminjaman.service";
import { BukuService } from "src/app/pages/master/bukus/services/buku.service";
import { UserService } from "src/app/pages/master/users/services/user-service.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-form-peminjaman",
    templateUrl: "./form-peminjaman.component.html",
    styleUrls: ["./form-peminjaman.component.scss"],
})
export class FormPeminjamanComponent implements OnInit {
    @Input() peminjamanId: number;
    @Output() afterSave = new EventEmitter<boolean>();
    mode: string;
    formModel: {
        id: number;
        admin_id: number;
        peminjam_id: number;
        m_buku_id: number;
        unit : number;
        tanggal_peminjaman: any;
        batas_pengembalian: any;
        is_kembali: number;
        tanggal_pengembalian: any;
        denda: number;
    };

    listBuku = [];
    listUser = [];
    constructor(
        private peminjamanService: PeminjamanService,
        private landaService: LandaService,
        private userService: UserService,
        private bukuService : BukuService
    ) {}

    ngOnInit(): void {
        this.getDataUser();
        this.getDataBuku();
    }

    emptyForm() {
        this.mode = "add";
        this.formModel = {
            id: 0,
            admin_id: 0,
            peminjam_id: 1,
            m_buku_id: 0,
            unit : 1,
            tanggal_peminjaman: null,
            batas_pengembalian: null,
            is_kembali: 0,
            tanggal_pengembalian: null,
            denda: 0,
        };

        if (this.peminjamanId > 0) {
            this.mode = "edit";
            this.getPeminjaman(this.peminjamanId);
        }
    }

    ngOnChanges(changes: SimpleChange) {
        this.emptyForm();
    }

    getPeminjaman(peminjamanId) {
        this.peminjamanService.getPeminjamanById(peminjamanId).subscribe(
            (res: any) => {
                this.formModel = res.data;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getDataUser() {
        this.userService.getAllUser().subscribe(
            (res: any) => {
                this.listUser = res.data.list;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getDataBuku() {
        this.bukuService.getAllBuku().subscribe(
            (res: any) => {
                this.listBuku = res.data.list;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    save() {
        if (this.mode == "add") {
            this.peminjamanService.createPeminjaman(this.formModel).subscribe(
                (res: any) => {
                    this.landaService.alertSuccess("Berhasil", res.message);
                    this.afterSave.emit();
                },
                (err) => {
                    this.landaService.alertError(
                        "Mohon Maaf",
                        err.error.errors
                    );
                }
            );
        } else {
            this.peminjamanService.updatePeminjaman(this.formModel).subscribe(
                (res: any) => {
                    this.landaService.alertSuccess("Berhasil", res.message);
                    this.afterSave.emit();
                },
                (err) => {
                    this.landaService.alertError(
                        "Mohon Maaf",
                        err.error.errors
                    );
                }
            );
        }
    }

    trackByIndex(index: number): any {
        return index;
    }

    back() {
        this.afterSave.emit();
    }
}
