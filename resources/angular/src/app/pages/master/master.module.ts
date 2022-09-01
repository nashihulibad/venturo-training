import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import {
    NgbModule,
    NgbTooltipModule,
    NgbModalModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { DataTablesModule } from "angular-datatables";

import { MasterRoutingModule } from "./master-routing.module";
import { DaftarUserComponent } from "./users/components/daftar-user/daftar-user.component";
import { FormUserComponent } from "./users/components/form-user/form-user.component";
import { DaftarRolesComponent } from "./roles/components/daftar-roles/daftar-roles.component";
import { FormRolesComponent } from "./roles/components/form-roles/form-roles.component";
import { DaftarCustomerComponent } from "./customers/components/daftar-customer/daftar-customer.component";
import { FormCustomerComponent } from "./customers/components/form-customer/form-customer.component";
import { FormItemComponent } from "./items/components/form-item/form-item.component";
import { DaftarItemComponent } from "./items/components/daftar-item/daftar-item.component";

@NgModule({
    declarations: [
        DaftarUserComponent,
        FormUserComponent,
        DaftarRolesComponent,
        FormRolesComponent,
        DaftarCustomerComponent,
        FormCustomerComponent,
        FormItemComponent,
        DaftarItemComponent,
    ],
    imports: [
        CommonModule,
        MasterRoutingModule,
        NgbModule,
        NgbTooltipModule,
        NgbModalModule,
        NgSelectModule,
        FormsModule,
        DataTablesModule,
    ],
})
export class MasterModule {}
