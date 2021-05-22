import { Component, OnInit } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Storage } from '@ionic/storage-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

const LANDSCAPTE_ORIENTATION_NAME="landscape-primary";

@Component({
  selector: 'app-numeros',
  templateUrl: './numeros.page.html',
  styleUrls: ['./numeros.page.scss'],
})
export class NumerosPage implements OnInit {
  imgSource:string[]=[];
  landscape: boolean;

  constructor(private nativeAudio: NativeAudio,
    private storage: Storage,
    private screen:ScreenOrientation) { 
    this.imgSource.push("assets/images/numbers/uno.png");
    this.imgSource.push("assets/images/numbers/dos.png");
    this.imgSource.push("assets/images/numbers/tres.png");
    this.imgSource.push("assets/images/numbers/cuatro.png");
    this.imgSource.push("assets/images/numbers/cinco.png");
    this.imgSource.push("assets/images/numbers/seis.png");

    this.nativeAudio.preloadSimple('uno-es', 'assets/audios/uno.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('dos-es', 'assets/audios/dos.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('tres-es', 'assets/audios/tres.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('cuatro-es', 'assets/audios/cuatro.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('cinco-es', 'assets/audios/cinco.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('uno-pt', 'assets/audios/uno-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('dos-pt', 'assets/audios/dos-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('tres-pt', 'assets/audios/tres-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('cuatro-pt', 'assets/audios/cuatro-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('cinco-pt', 'assets/audios/cinco-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('uno-en', 'assets/audios/uno-en.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('dos-en', 'assets/audios/dos-en.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('tres-en', 'assets/audios/tres-en.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('cuatro-en', 'assets/audios/cuatro-en.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('cinco-en', 'assets/audios/cinco-en.mp3').then(onSuccess=>{}, onError=>{});

     this.nativeAudio.preloadSimple('seis-en', 'assets/audios/seis-en.mp3').then(onSuccess=>{}, onError=>{});
      this.nativeAudio.preloadSimple('seis-es', 'assets/audios/seis.mp3').then(onSuccess=>{}, onError=>{});
      this.nativeAudio.preloadSimple('seis-pt', 'assets/audios/seis-pt.mp3').then(onSuccess=>{}, onError=>{});

      this.screen.onChange().subscribe(
        () => {
            console.log("Orientation Changed");
            console.log(this.screen.type);
            if(this.screen.type === LANDSCAPTE_ORIENTATION_NAME){
              this.landscape=true;
            }
            else{
              this.landscape=false;
            }
        });
  }

  ngOnInit() {
  }
  PronunciarNumero(numero:string){
    var numeroSplited = numero.substring(
     numero.lastIndexOf("/") + 1, 
     numero.lastIndexOf(".")
     );
     this.storage.get("idioma").then(idiom=> {
       var audioKey = numeroSplited + "-" + idiom;
       this.nativeAudio.play(audioKey).then(onSuccess=>{}, onError=>{});
     });
  }
}
