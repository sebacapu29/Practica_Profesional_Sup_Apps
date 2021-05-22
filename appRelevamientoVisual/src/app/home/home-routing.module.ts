import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import {GaleriaPage } from '../../app/galeria/galeria.page';
const routes: Routes = [
  {
    path: '',
    component: HomePage,
  }
];

// const routes: Routes = [
//   {
//     path: 'home',
//     component: HomePage,
//     children: [
//       {
//         path: 'galeria',
//         children: [
//           {
//             path: '',
//             loadChildren: '../galeria/galeria.module#GaleriaPageModule'
//           }
//         ]
//       },
//       {
//         path: '',
//         redirectTo: '/app/home/galeria',
//         pathMatch: 'full'
//       }
//     ]
//   }
// ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
