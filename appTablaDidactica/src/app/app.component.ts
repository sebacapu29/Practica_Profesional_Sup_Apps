import { Component, ElementRef, ViewChild } from '@angular/core';
import { SplashScreen} from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild('splash',{static:false})splash:ElementRef;
  routerHidden: boolean=true;
  idiomaSeteado:string;
  imgSource:string[]=[];
  imgSourcesColors:string[]=[];
  tematicaSeleccionada:string;
  myObservable:Observable<any> =new Observable();
  oculto:boolean=true;

  private _storage: Storage | null = null;
  isLogued: boolean;
  constructor(private platform:Platform,
              private splashScreen:SplashScreen,
              public statusBar:StatusBar,
              private _router:Router,
              private storage: Storage
              ) {
                this.initialize();
                setTimeout(() => {
                  this.oculto=false;
                }, 4500);

              }
              initialize(){
                this.imgSource.push("assets/images/leon.svg");
                this.imgSource.push("assets/images/color.svg");
                this.imgSource.push("assets/images/bloques-de-numeros.svg");
                this.initStorage();
                this.set("idioma","es");//idioma por defecto
                this.idiomaSeteado = "assets/images/banderas/espana.svg";
                this.tematicaSeleccionada = "assets/images/color.svg";

                this.platform.ready().then(()=>{
                  this.statusBar.styleDefault();
                  this.splashScreen.hide();
                });
                setTimeout(() => {
                  this.routerHidden = false;
                  this.splash.nativeElement.style.display ="none";
                },3000);
              }
              async initStorage() {
                // If using, define drivers here: await this.storage.defineDriver(/*...*/);
                const storage = await this.storage.create();
                this._storage = storage;
              }
              public set(key: string, value: any) {
                this._storage?.set(key, value);
              }
              async ngOnInit(){
                await this.storage.create();
              }
              setIdioma(idioma){
                this.set("idioma",idioma);
                if(idioma=='es'){
                  this.idiomaSeteado = "assets/images/banderas/espana.svg";
                }
                if(idioma=='pt'){
                  this.idiomaSeteado = "assets/images/banderas/brasil.svg";               
                }
                if(idioma=='en'){
                  this.idiomaSeteado = "assets/images/banderas/reino-unido.svg";                  
                }
              }

              ActividadColores(){
                this.tematicaSeleccionada = "assets/images/color.svg";
                 this._router.navigateByUrl("colores");
              }
              ActividadAnimales(){
                this.tematicaSeleccionada = "assets/images/leon.svg";
                this._router.navigateByUrl("animales");
              }
              ActividadNumeros(){
                this.tematicaSeleccionada = "assets/images/bloques-de-numeros.svg";
                this._router.navigateByUrl("numeros");
              }
}
