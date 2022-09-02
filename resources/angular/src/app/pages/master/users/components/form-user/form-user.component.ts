import {
    Component,
    Input,
    OnInit,
    Output,
    SimpleChange,
    EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { LandaService } from "src/app/core/services/landa.service";
import { RoleService } from "../../../roles/services/role-service.service";
import { UserService } from "../../services/user-service.service";

@Component({
    selector: "user-form",
    templateUrl: "./form-user.component.html",
    styleUrls: ["./form-user.component.scss"],
})
export class FormUserComponent implements OnInit {
    @Input() userId: number;
    @Output() afterSave = new EventEmitter<boolean>();
    mode: string;
    myForm: any;
    listAkses: [];
    formModel: {
        id: number;
        nama: string;
        akses: {
            id: number;
            nama: string;
        };
        foto: any;
        fotoUrl: string;
        email: string;
        password: string;
    };


    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private landaService: LandaService
    ) {}

    ngOnInit(): void {
        this.myForm = new FormGroup({
            fileUpload: new FormControl("", [Validators.required]),
        });
        this.getRole();
    }

    ngOnChanges(changes: SimpleChange) {
        this.emptyForm();
    }

    emptyForm() {
        this.mode = "add";
        this.formModel = {
            id: 0,
            nama: "",
            akses: {
                id: 1,
                nama: "",
            },
            foto: "",
            fotoUrl: "",
            email: "",
            password: "",
        };

        if (this.userId > 0) {
            this.mode = "edit";
            this.getUser(this.userId);
        }
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

    save() {
        if (this.mode == "add") {
            this.formModel.foto = this.formModel.foto.base64;
            this.userService.createUser(this.formModel).subscribe(
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
            this.formModel.foto = this.formModel.foto.base64;
            this.userService.updateUser(this.formModel).subscribe(
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

    getRole() {
        this.roleService.getRoles([]).subscribe(
            (res: any) => {
                this.listAkses = res.data.list;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getUser(userId) {
        this.userService.getUserById(userId).subscribe(
            (res: any) => {
                this.formModel = res.data;
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
