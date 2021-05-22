import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() clave: string;
  // @Input() middleInitial: string;

  constructor(private modalController:ModalController) { }

  ngOnInit() {
  }
  confirmar(){
     // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'clave': this.clave
    });
  }
}
