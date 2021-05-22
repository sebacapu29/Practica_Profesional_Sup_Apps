import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'colores',
    loadChildren: () => import('./colores/colores.module').then( m => m.ColoresPageModule)
  },
 
  {
    path: 'animales',
    loadChildren: () => import('./animales/animales.module').then( m => m.AnimalesPageModule)
  },
  {
    path: 'numeros',
    loadChildren: () => import('./numeros/numeros.module').then( m => m.NumerosPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
