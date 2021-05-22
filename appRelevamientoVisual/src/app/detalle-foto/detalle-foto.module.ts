import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleFotoPageRoutingModule } from './detalle-foto-routing.module';

import { DetalleFotoPage } from './detalle-foto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleFotoPageRoutingModule
  ],
  declarations: [DetalleFotoPage]
})
export class DetalleFotoPageModule {}
