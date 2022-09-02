import {
    Component,
    Input,
    OnInit,
    Output,
    SimpleChange,
    EventEmitter,
} from "@angular/core";
import { LandaService } from "src/app/core/services/landa.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";

import { UserService } from "../../services/user-service.service";
import { RoleService } from "../../../roles/services/role-service.service";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
    @Input() userId: number;
    @Output() afterSave = new EventEmitter<boolean>();
    mode: string;
    myForm: any;
    listAkses: [];

    akses: {
        id: number;
        nama: string;
    };
    id : number;
    foto: any;
    fotoUrl: any;
    nama: string;
    email: string;
    password: string;


    constructor(
        private userService: UserService,
        private landaService: LandaService,

        private roleService: RoleService
    ) {}

    ngOnInit(): void {
        this.getProfile();
        this.myForm = new FormGroup({
            fileUpload: new FormControl("", [Validators.required]),
        });
        this.getRole();
    }

    onFileSelected(event: any) {
        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
            const [file] = event.target.files;
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.foto = {
                    base64: reader.result as string,
                };

                this.myForm.patchValue({
                    fileUpload: reader.result,
                });
            };
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

    getProfile() {
        this.userService.getProfile().subscribe(
            (res: any) => {
                this.id = res.data.id;
                this.nama = res.data.nama;
                this.email = res.data.email;
                this.foto = res.data.fotoUrl;
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    save() {

        let data = {
            id : this.id,
            nama: this.nama,
            email: this.email,
            password: this.password,
            foto: !this.foto ? "" : this.foto.base64,
            akses : this.akses
        };

        this.userService.updateUser(data).subscribe(
            (res: any) => {
                this.landaService.alertSuccess("Berhasil", res.message);
                this.afterSave.emit();
            },
            (err) => {
                this.landaService.alertError("Mohon Maaf", err.error.errors);
            }
        );
    }
}
