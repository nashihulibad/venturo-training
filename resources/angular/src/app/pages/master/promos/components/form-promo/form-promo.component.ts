import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChange,
} from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";
import { PromoService } from "../../services/promo.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-form-promo",
    templateUrl: "./form-promo.component.html",
    styleUrls: ["./form-promo.component.scss"],
})
export class FormPromoComponent implements OnInit {
    @Input() promoId: number;
    @Output() afterSave = new EventEmitter<boolean>();
    mode: string;
    formModel: {
        id: number;
        nama: string;
        type: string;
        diskon: number;
        nominal: number;
        foto: any;
        kadaluarsa: number;
        syarat_ketentuan: string;
    };
    myForm: any;
    constructor(
        private promoService: PromoService,
        private landaService: LandaService
    ) {}

    ngOnInit(): void {
        this.myForm = new FormGroup({
            fileUpload: new FormControl("", [Validators.required]),
        });
    }

    onFileSelected(event: any) {
        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.formModel.foto = {
                    base64: reader.result as string,
                };

                this.myForm.patchValue({
                    fileUpload: reader.result,
                });
            };
        }
    }

    emptyForm() {
        this.mode = "add";
        this.formModel = {
            id: 0,
            nama: "",
            type: "",
            diskon: 0,
            nominal: 0,
            foto: "",
            kadaluarsa: 0,
            syarat_ketentuan: "",
        };

        if (this.promoId > 0) {
            this.mode = "edit";
            this.getPromo(this.promoId);
        }
    }

    ngOnChanges(changes: SimpleChange) {
        this.emptyForm();
    }

    getPromo(promoId) {
        this.promoService.getPromoById(promoId).subscribe(
            (res: any) => {
                this.formModel = res.data;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    save() {
        if (this.formModel.foto) {
            this.formModel.foto = this.formModel.foto.base64;
        }
        console.log(this.mode);
        if (this.mode == "add") {
            this.promoService.createPromo(this.formModel).subscribe(
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
            this.promoService.updatePromo(this.formModel).subscribe(
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
