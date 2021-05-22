import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleFotoPage } from './detalle-foto.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleFotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleFotoPageRoutingModule {}
