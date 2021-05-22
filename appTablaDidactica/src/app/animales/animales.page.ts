import { Component, OnInit } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Storage } from '@ionic/storage-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

const LANDSCAPTE_ORIENTATION_NAME="landscape-primary";

@Component({
  selector: 'app-animales',
  templateUrl: './animales.page.html',
  styleUrls: ['./animales.page.scss'],
})
export class AnimalesPage implements OnInit {

  imgSource:string[]=[];
  landscape:boolean=false;
  constructor(private nativeAudio: NativeAudio,
    private storage: Storage,
    private screen:ScreenOrientation) { 
    this.imgSource.push("assets/images/animals/perro.png");
    this.imgSource.push("assets/images/animals/gato.png");
    this.imgSource.push("assets/images/animals/pajaro.png");
    this.imgSource.push("assets/images/animals/vaca.png");
    this.imgSource.push("assets/images/animals/oveja.png");
    this.imgSource.push("assets/images/animals/mono.png");

    this.nativeAudio.preloadSimple('perro-es', 'assets/audios/perro.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('perro-pt', 'assets/audios/perro-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('perro-en', 'assets/audios/perro-en.mp3').then(onSuccess=>{}, onError=>{});
    
    this.nativeAudio.preloadSimple('gato-es', 'assets/audios/gato.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('gato-pt', 'assets/audios/gato-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('gato-en', 'assets/audios/gato-en.mp3').then(onSuccess=>{}, onError=>{});

    this.nativeAudio.preloadSimple('pajaro-es', 'assets/audios/pajaro.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('pajaro-pt', 'assets/audios/pajaro-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('pajaro-en', 'assets/audios/pajaro-en.mp3').then(onSuccess=>{}, onError=>{});
    
    this.nativeAudio.preloadSimple('vaca-es', 'assets/audios/vaca.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('vaca-pt', 'assets/audios/vaca-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('vaca-en', 'assets/audios/vaca-en.mp3').then(onSuccess=>{}, onError=>{});
    
    this.nativeAudio.preloadSimple('oveja-es', 'assets/audios/oveja.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('oveja-pt', 'assets/audios/oveja-pt.mp3').then(onSuccess=>{}, onError=>{});
    this.nativeAudio.preloadSimple('oveja-en', 'assets/audios/oveja-en.mp3').then(onSuccess=>{}, onError=>{});

     this.nativeAudio.preloadSimple('mono-en', 'assets/audios/mono-en.mp3').then(onSuccess=>{}, onError=>{});
     this.nativeAudio.preloadSimple('mono-es', 'assets/audios/mono.mp3').then(onSuccess=>{}, onError=>{});
     this.nativeAudio.preloadSimple('mono-pt', 'assets/audios/mono-pt.mp3').then(onSuccess=>{}, onError=>{});

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
  PronunciarAnimal(animal:string){
    var animalSplited = animal.substring(
      animal.lastIndexOf("/") + 1, 
      animal.lastIndexOf(".")
     );
     this.storage.get("idioma").then(idiom=> {
       var audioKey = animalSplited + "-" + idiom;
       this.nativeAudio.play(audioKey).then(onSuccess=>{}, onError=>{});
     });
  }
}
