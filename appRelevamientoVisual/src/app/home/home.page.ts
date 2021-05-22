import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private _router:Router) {}
  IrACosas(cosas:string){
    this._router.navigate(['/galeria', { tematica: cosas }]);
  }
}
