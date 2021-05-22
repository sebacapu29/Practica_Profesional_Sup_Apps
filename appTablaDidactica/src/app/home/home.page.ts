import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  imgSource:string[]=[];
  imgSourcesColors:string[]=[];
  constructor(private _router:Router) { 
    this.imgSource.push("assets/images/animales.png");
    this.imgSource.push("assets/images/colores.png");
    this.imgSource.push("assets/images/numeros.png");
  }

  ngOnInit() {
  }
  ActividadColores(){
     this._router.navigateByUrl("colores");
  }
  ActividadAnimales(){
    this._router.navigateByUrl("animales");
  }
  ActividadNumeros(){
    this._router.navigateByUrl("numeros");
  }
}
