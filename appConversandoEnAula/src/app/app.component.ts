import { Component, ElementRef, ViewChild } from '@angular/core';
import { SplashScreen} from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild('splash',{static:false})splash:ElementRef;
  routerHidden: boolean=true;

  constructor(private platform:Platform,
              private splashScreen:SplashScreen,
              public statusBar:StatusBar
              ) {
                this.initialize();
              }
              initialize(){
                this.platform.ready().then(()=>{
                  this.statusBar.styleDefault();
                  this.splashScreen.hide();
                });
                setTimeout(() => {
                  this.routerHidden = false;
                  this.splash.nativeElement.style.display ="none";
                },3000);
              }
}
