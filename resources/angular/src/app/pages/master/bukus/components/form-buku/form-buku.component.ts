import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChange,
} from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";
import { BukuService } from "../../services/buku.service";

@Component({
    selector: "app-form-buku",
    templateUrl: "./form-buku.component.html",
    styleUrls: ["./form-buku.component.scss"],
})
export class FormBukuComponent implements OnInit {
    @Input() bukuId: number;
    @Output() afterSave = new EventEmitter<boolean>();
    mode: string;
    formModel: {
        id: number;
        judul: string;
        stok: number;
        author: string;
        denda: number;
    };

    constructor(
        private bukuService: BukuService,
        private landaService: LandaService
    ) {}

    ngOnInit(): void {}

    ngOnChanges(changes: SimpleChange) {
        this.emptyForm();
    }

    emptyForm() {
        this.mode = "add";
        this.formModel = {
            id: 0,
            judul: "",
            author: "",
            stok: 0,
            denda:0
        };

        if (this.bukuId > 0) {
            this.mode = "edit";
            this.getCustomer(this.bukuId);
        }
    }

    save() {
        if (this.mode == "add") {
            this.bukuService.createBuku(this.formModel).subscribe(
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
            this.bukuService.updateBuku(this.formModel).subscribe(
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

    getCustomer(bukuId) {
        this.bukuService.getBukuById(bukuId).subscribe(
            (res: any) => {
                this.formModel = res.data;
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
