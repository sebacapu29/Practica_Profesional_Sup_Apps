import { Component, OnInit } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Storage } from '@ionic/storage-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

const LANDSCAPTE_ORIENTATION_NAME="landscape-primary";

@Component({
  selector: 'app-colores',
  templateUrl: './colores.page.html',
  styleUrls: ['./colores.page.scss'],
})

export class ColoresPage implements OnInit {
  imgSource:string[]=[];
  idioma:string;
  orientationClass:string;
  landscape:boolean=false;

  constructor(private nativeAudio: NativeAudio,
    private storage: Storage,
    private screen:ScreenOrientation) {
    this.imgSource.push("assets/images/colors/rojo.png");
    this.imgSource.push("assets/images/colors/amarillo.png");
    this.imgSource.push("assets/images/colors/verde.png");
    this.imgSource.push("assets/images/colors/azul.png");
    this.imgSource.push("assets/images/colors/violeta.png");
    this.imgSource.push("assets/images/colors/rosa.png");

    this.nativeAudio.preloadSimple('amarillo-es', 'assets/audios/amarillo.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('amarillo-en', 'assets/audios/amarillo-en.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('amarillo-pt', 'assets/audios/amarillo-pt.mp3').then(onSuccess=>{}, onError=>{});
    
    this.nativeAudio.preloadSimple('verde-es', 'assets/audios/verde.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('verde-pt', 'assets/audios/verde-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('verde-en', 'assets/audios/verde-en.mp3').then(onSuccess=>{}, onError=>{});
    
    this.nativeAudio.preloadSimple('rojo-es', 'assets/audios/rojo.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('rojo-pt', 'assets/audios/rojo-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('rojo-en', 'assets/audios/rojo-en.mp3').then(onSuccess=>{}, onError=>{});
    
    this.nativeAudio.preloadSimple('violeta-es', 'assets/audios/purpura.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('violeta-pt', 'assets/audios/violeta-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('violeta-en', 'assets/audios/violeta-en.mp3').then(onSuccess=>{}, onError=>{});
    
    this.nativeAudio.preloadSimple('azul-es', 'assets/audios/azul.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('azul-pt', 'assets/audios/azul-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('azul-en', 'assets/audios/azul-en.mp3').then(onSuccess=>{}, onError=>{});

    this.nativeAudio.preloadSimple('rosa-en', 'assets/audios/rosa-en.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('rosa-es', 'assets/audios/rosa.mp3').then(onSuccess=>{}, onError=>{});
     this.nativeAudio.preloadSimple('rosa-pt', 'assets/audios/rosa-pt.mp3').then(onSuccess=>{}, onError=>{});

      this.screen.onChange().subscribe(
        () => {
            console.log("Orientation Changed");
            console.log(this.screen.type);
            if(this.screen.type === LANDSCAPTE_ORIENTATION_NAME){
              this.orientationClass="landscape";
              this.landscape=true;
            }
            else{
              this.landscape=false;
            }
        });
  }

  ngOnInit() {
  }
 PronunciarColor(color:string){
   var colorSplited = color.substring(
    color.lastIndexOf("/") + 1, 
    color.lastIndexOf(".")
    );
    this.storage.get("idioma").then(idiom=> {
      var audioKey = colorSplited + "-" + idiom;
      this.nativeAudio.play(audioKey).then(onSuccess=>{}, onError=>{});
    });
 }
}
