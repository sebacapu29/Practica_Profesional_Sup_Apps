import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Platform } from '@ionic/angular';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ModalController } from '@ionic/angular';
// import { ModalComponent } from "../componentes/modal/modal.component";
import { AlertController } from '@ionic/angular';

import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { Sensors, TYPE_SENSOR } from '@ionic-native/sensors/ngx';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { AudioService } from 'src/app/servicios/audio.service';
import { ModalPage } from '../modal/modal.page';

enum posiciones {
  INCLINADODERECHA,
  INCLINADOIZQUIERDA,
  VERTICAL,
  HORIZONTAL,
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  password: string;
  deshabilitarBoton: boolean = false;
  estado: Estado = Estado.DESACTIVADA;
  ejeX;
  ejeY;
  ejeZ;
  timeStamp;
  options: GyroscopeOptions = {
    frequency: 1000
  } 
  deviceRef;
  posicion;
  posicionAnterior = "";
  alarmaActivada:boolean;

  constructor(private platform: Platform, private deviceMotion: DeviceMotion, 
              private flashlight: Flashlight, private vibration: Vibration,   
              // private dataService: DataService, 
              private audioService: AudioService,
              private alertController: AlertController,
              public modalController: ModalController) 
  {   
    this.platform.ready().then(() => {
      this.audioService.preload('derecha','assets/audio/derecha.mp3');
      this.audioService.preload('izquierda','assets/audio/izquierda.mp3');
      // this.audioService.preload('vertical','assets/audio/fire-alarm-sound.mp3');
      // this.audioService.preload('horizontal','assets/audio/fire-alarm-sound.mp3');
     
    });
  }

  ngOnInit() {
  }
  async presentModal() {
   
  }
  async ActicarODesactivarAlarma()
  {
    if(this.estado == Estado.DESACTIVADA){
      this.estado = Estado.ACTIVADA;
      this.deshabilitarBoton = true;
  
      console.log('Estado --------------------------------------------',this.estado);
  
      this.start();
      this.presentAlert("Alarma activada");
    }
    else{
      const modal = await this.modalController.create({
        component: ModalPage,
        cssClass: 'my-custom-class'
      });
       await modal.present();
       const { data } = await modal.onWillDismiss();
       console.log(data);
       if(data.clave=="111111"){
         this.desactivarAlarma();
         this.presentAlert("Alarma desactivada");
       }
       else{
         this.presentAlert("Clave incorrecta");
       }
    }
  }

  desactivarAlarma()
  {
    console.log("Alarma desactivada");
    this.estado = Estado.DESACTIVADA;
    this.deshabilitarBoton = false;
    this.stop();
  }

  start()
  {
    try
    {
      let option: DeviceMotionAccelerometerOptions = 
      {
        frequency: 500
      };

      this.deviceRef = this.deviceMotion.watchAcceleration(option)
      .subscribe((acc: DeviceMotionAccelerationData) => {
        this.ejeX = "" + acc.x;
        this.ejeY = "" + acc.y;
        this.ejeZ = "" + acc.z;
        this.timeStamp = "" + acc.timestamp;


        if(this.ejeX > 1 && this.ejeX <= 9)
        {
          console.log("IZQUIERDA");
          this.posicion = "izquierda";
        }

        if(this.ejeX < -1 && this.ejeX >= -9 )
        {
          console.log("DERECHA");
          this.posicion = "derecha";
        }

        if(this.ejeX > 8 && this.ejeX <= 11 || this.ejeX < -8 && this.ejeX >= -11)
        {   
          console.log("HORIZONTAL");
          this.posicion = "horizontal";
        }

        if(this.ejeX <= 2 && this.ejeX >= -2 || this.ejeX == 0 || this.ejeX == -0)
        {
          console.log("VERTICAL");
          this.posicion = "vertical";  
        } 

        if(this.posicion != this.posicionAnterior)
        {
          switch(this.posicion)
          {
            case "vertical" :

              // this.audioService.play('vertical');
              this.flashlight.switchOff();
              setTimeout(() => {
                this.flashlight.switchOn();
              }, 5000);
              this.flashlight.switchOff();
              this.posicionAnterior = this.posicion;

              break;
            case "horizontal" :

              this.vibration.vibrate(5000);
              // this.audioService.play('horizontal');
              this.posicionAnterior = this.posicion;

              break;
            case "derecha" :

              this.audioService.play('derecha');
              this.posicionAnterior = this.posicion;

              break;
            case "izquierda" :

              this.audioService.play('izquierda');
              this.posicionAnterior = this.posicion;

              break;
          }
        }
       

      });
    }
    catch(error)
    {
      console.error("ERROR: ",error);
    }
  }

  stop()
  {
    this.deviceRef.unsubscribe();
  }

  async presentAlert(message) 
  {
    const alert = await this.alertController.create({
      header: 'Atención',
      message,
      mode: "ios",
      translucent: true
    });
  
    await alert.present();
  }

}

enum Estado{
  ACTIVADA = 1,
  DESACTIVADA = 0
}

  // async presentToast(mensaje:string) {
  //   const toast = await this.toastController.create({
  //     message: mensaje,
  //     duration: 2000
  //   });
  //   toast.present();
  // }//autenticar contra firebase 