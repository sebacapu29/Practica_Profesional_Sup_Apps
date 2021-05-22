import { AfterContentChecked, Component, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/servicios/data.service';
import { Router, NavigationEnd } from '@angular/router';
import { UsuarioCredito } from '../clases/usuario-credito';
import { FirebaseService } from '../servicios/firebase.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  saldo:number=0;
  usuario:UsuarioCredito = new UsuarioCredito();
  test: Promise<void | Usuario>;
  qrScan: any;
  dataQR: any;
  codigos : string[] = [];
  
  private CODIGOS_VALOR =[{codigo:"8c95def646b6127282ed50454b73240300dccabc",valor:10},
                          {codigo:"ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172",valor:50},
                          {codigo:"2786f4877b9091dcad7f35751bfcf5d5ea712b2f",valor:100}];

  constructor(private qrScanner: QRScanner,
              public platform: Platform, private router:Router,
              // private dataService: DataService,
              public actionSheetController: ActionSheetController,
              public loadingController: LoadingController,
              private toastController: ToastController,
              private detector: ChangeDetectorRef,
              private alertController: AlertController,
              private fbService:FirebaseService) {

    this.usuario.correo = localStorage.getItem("usuario");
    this.fbService.GetAll("usuariosCredito")
    .subscribe((listaUsuariosCreditos)=>{
      if(listaUsuariosCreditos){
        this.saldo=0;
        (<UsuarioCredito[]>listaUsuariosCreditos).forEach(uc=>{
          // console.log(uc);
          if(uc.correo == this.usuario.correo){
            this.usuario = uc;
            this.usuario.codigos.forEach((codigo)=>{
              var tieneCodigo = this.CODIGOS_VALOR.find((codvalor)=> codvalor.codigo== codigo);
              if(tieneCodigo){
                this.saldo+=tieneCodigo.valor;
                this.usuario.credito += tieneCodigo.valor;
                return;
              }
            }
            )
            return;
          }
        })
      }
    })
  }
  ngOnInit(){
    // this.usuario = new UsuarioCredito();
  }
  escanear(){
    
// Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      translucent: true,
      header: 'Carga',
      cssClass: 'my-custom-class',

      backdropDismiss: true,
      buttons: [
        {
          
          text: 'Cargar',
          icon: 'qr-code-outline',
          handler: () => {
            console.log('Cargar por QR');
            this.leerQR();
          }
        },
        {
          text: 'Configurar',
          icon: 'construct-outline',
          handler: () => {
            this.configurar();
          }
        }, 
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }
  leerQR() 
  {
    console.log("Leer QR");
    this.codigos = this.usuario.codigos;
    
    this.qrScanner.prepare().then((status:QRScannerStatus) => 
    {
      if(status.authorized)
      {
        this.qrScanner.show();
        document.getElementsByTagName("body")[0].style.opacity = "0";

        this.qrScan = this.qrScanner.scan().subscribe((scan) =>
        {
          console.log(scan);
          this.qrScanner.show();
          document.getElementsByTagName("body")[0].style.opacity = "1";
          
          if(!this.tieneElCodigoCargado(this.usuario,scan))
          {
            this.usuario.codigos.push(scan.trim());
            this.fbService.insertarCredito(this.usuario).then(()=>{
              this.presentToast("Codigo escaneado");
              // this.usuario.codigos=[];
              
            });
          }
          else{
            this.presentToast("Codigo ya escaneado");
          }
          this.qrScanner.hide();
          this.qrScan.unsubscribe();
        },
        (error) => console.log(error));
      }
    })
  }
  async presentLoading(message) {
    const loading = await this.loadingController.create({
      message,
      duration: 3000,
    });

    loading.present();

    console.log('Loading dismissed!');
  }
  
  cargarDatos()
  {
    this.fbService.insertarCredito(this.usuario)
        .then(data => {
          console.log(data);
          // this.usuario = Object.assign(new UsuarioCredito,data);
        });
  }


  tieneElCodigoCargado(usuario: UsuarioCredito, codigo: string)
  {
    console.log("scan",codigo);
    console.log("param1",usuario.codigos);
    console.log("filter",usuario.codigos.filter( aux => aux == codigo.trim()));
    // console.log("")
    if(usuario.codigos.filter( aux => aux == codigo.trim()).length == 1 &&
        usuario.perfil != 'admin')
    {
      return true;
    }
    else if(usuario.codigos.filter(aux => aux == codigo.trim()).length == 2 &&
            usuario.perfil == 'admin')
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  configurar()
  {
    this.qrScanner.openSettings();
  }

  borrarCreditos()
  {
    this.saldo=0;
    this.usuario.credito = 0;
    this.usuario.codigos = ['0'];
    this.fbService.insertarCredito(this.usuario)
                    .then(()=> this.presentToast("Crédito reseteado"));
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Atención',
      message,
    });
  
    await alert.present();
  }
}


