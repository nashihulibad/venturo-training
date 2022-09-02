import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChange,
} from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";
import { ItemService } from "../../services/item.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
@Component({
    selector: "item-form",
    templateUrl: "./form-item.component.html",
    styleUrls: ["./form-item.component.scss"],
})
export class FormItemComponent implements OnInit {
    @Input() itemId: number;
    @Output() afterSave = new EventEmitter<boolean>();
    mode: string;
    formModel: {
        id: number;
        nama: string;
        kategori: string;
        harga: number;
        deskripsi: string;
        foto: any;
        fotoUrl: any;
        is_available: number;
        detail: [
            {
                id: number;
                m_item_id: number;
                keterangan: string;
                tipe: string;
                harga: number;
            }
        ];
    };
    listTipeDetail: any;
    myForm: any;
    constructor(
        private itemService: ItemService,
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

    ngOnChanges(changes: SimpleChange) {
        this.emptyForm();
    }

    emptyForm() {
        this.mode = "add";
        this.formModel = {
            id: 0,
            nama: "",
            kategori: "",
            harga: 0,
            deskripsi: "",
            foto: "",
            fotoUrl: "",
            is_available: 1,
            detail: [
                {
                    id: 0,
                    m_item_id: 0,
                    keterangan: "",
                    tipe: "topping",
                    harga: 0,
                },
            ],
        };
        this.listTipeDetail = [
            {
                id: "level",
                nama: "Level",
            },
            {
                id: "topping",
                nama: "Topping",
            },
        ];

        if (this.itemId > 0) {
            this.mode = "edit";
            this.getItem(this.itemId);
        }
    }

    save() {
        if (this.formModel.foto) {
            this.formModel.foto = this.formModel.foto.base64;
        }
        if (this.mode == "add") {
            this.itemService.createItem(this.formModel).subscribe(
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
            this.itemService.updateItem(this.formModel).subscribe(
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

    getItem(itemId) {
        this.itemService.getItemById(itemId).subscribe(
            (res: any) => {
                this.formModel = res.data;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    addDetail() {
        const newDet = {
            id: 0,
            m_item_id: this.formModel.id,
            keterangan: "",
            tipe: "topping",
            harga: 0,
        };
        this.formModel.detail.push(newDet);
    }

    removeDetail(detail, paramIndex) {
        detail.splice(paramIndex, 1);
    }

    trackByIndex(index: number): any {
        return index;
    }

    back() {
        this.afterSave.emit();
    }
}
