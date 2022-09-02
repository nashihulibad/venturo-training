import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DaftarCustomerComponent } from './customers/components/daftar-customer/daftar-customer.component';
import { DaftarItemComponent } from './items/components/daftar-item/daftar-item.component';
import { DaftarRolesComponent } from './roles/components/daftar-roles/daftar-roles.component';
import { DaftarUserComponent } from './users/components/daftar-user/daftar-user.component';
import { ProfileComponent } from "./users/components/profile/profile.component";

const routes: Routes = [
    { path: "users", component: DaftarUserComponent },
    { path: "profile", component: ProfileComponent },
    { path: "roles", component: DaftarRolesComponent },
    { path: "customers", component: DaftarCustomerComponent },
    { path: "items", component: DaftarItemComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterRoutingModule { }
