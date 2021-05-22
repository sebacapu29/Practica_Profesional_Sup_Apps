// import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
// import { MessageType, ChatMessage } from '../clases/chat-message';
// import { UtilService} from "../providers/util.service";

// @Component({
//   selector: 'app-chat',
//   templateUrl: './chat.page.html',
//   styleUrls: ['./chat.page.scss'],
// })
// export class ChatPage implements OnInit {
//   @ViewChild('ionTxtArea') ionTxtArea: any;
//   chatMessage:ChatMessage;
//   public messageType = MessageType;
//   constructor() {
//     this.chatMessage = new ChatMessage();
//     this.chatMessage.epoch= 1;
//     this.chatMessage.message="mensaje";
//    }

//   ngOnInit() {
//   }
//   formatEpoch(epoch){
//     return UtilService.getCalendarDay(epoch);
//   }

//   public txtArea: any;
//   public content: string;
//   public lineHeight: number;
//   public placeholder: string="Escriba aqui";
//   public maxHeight: number;
//   public maxExpand: number;

//   public ngAfterViewInit() {
//     // this.txtArea = this.ionTxtArea._elementRef.nativeElement.children[0];
//     // this.txtArea.style.height = this.lineHeight + "px";
//     // this.maxHeight = this.lineHeight * this.maxExpand;
//     // this.txtArea.style.resize = 'none';
//   }

//   public onChange(e) {
//     // this.txtArea.style.height = this.lineHeight + "px";
//     // if (this.txtArea.scrollHeight < this.maxHeight) {
//     //   this.txtArea.style.height = this.txtArea.scrollHeight + "px";
//     // } else {
//     //   this.txtArea.style.height = this.maxHeight + "px";
//     // }
//   }

//   // public clearInput() {
//   //   this.content = "";
//   //   this.txtArea.style.height = this.lineHeight + "px";
//   // }

//   // public setFocus() {
//   //   this.ionTxtArea.setFocus()
//   // }
// }

import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { FirebaseService } from '../servicios/firebase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('IonContent', { static: true }) content: IonContent
  paramData: any;
  msgList: any;
  userName: any;
  user_input: string = "";
  User: string = "Me";
  toUser: string = "Other";
  start_typing: any;
  loader: boolean;
  usuarioLogueado:string;
  division:string;
  esDivA:boolean;

  constructor(public activRoute: ActivatedRoute,
    private route:Router,
    private firebase:FirebaseService) {

       var a = this.activRoute.paramMap.pipe(
        switchMap((params: ParamMap) => {
          this.division = params.get('div');
          if(this.division.toLowerCase()=='a'){
            this.esDivA=true;
          }
          else{
            this.esDivA=false;
          }
          console.log("db_pps_" + this.division .toLowerCase());

          firebase.GetAll("db_pps_" +this.division .toLowerCase()).subscribe(mensajes=>{
            // console.log(mensajes);
            this.msgList =  (<any[]>mensajes).sort(function(a,b){
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return a.fecha - b.fecha;
            });;
            // debugger;
          })
          return this.division ;
        })
      );
      a.subscribe();
      // a.toPromise().then(e=>console.log(e));// subscribe(e=> console.log(e));
    //   this.activRoute.params.subscribe((params) => {
    //   // console.log(params)
    //   this.paramData = params
    //   this.userName = params.name
    //   console.log(params);
    // });
    this.usuarioLogueado = localStorage.getItem("usuario");
    // console.log()

  }

  ngOnInit() {
  }
  sendMsg() {
    var date = new Date();
    if (this.user_input !== '') {
      var msg = {
        usuario: this.usuarioLogueado,
        nombre: this.usuarioLogueado == "invitado@invitado.com" ? "Invitado" : "Admin",
        hora: date.getHours().toLocaleString() + ":" + date.getMinutes(),
        mensaje: this.user_input,
        fecha: new Date()
      };
      // this.msgList.push(msg);

      this.firebase.InsertMsg(msg,"db_pps_" + this.division.toLowerCase());

      this.user_input = "";
      this.scrollDown()
      setTimeout(() => {
        this.senderSends()
      }, 500);

    }
  }
  senderSends() {
    // this.loader = true;
    // setTimeout(() => {
    //   this.msgList.push({
    //     userId: this.User,
    //     userName: this.User,
    //     userAvatar: "../../assets/chat/chat5.jpg",
    //     time: "12:01",
    //     message: "Pagas, this themes support but ionic 3 ionic 4, etc.."
    //   });
    //   this.loader = false;
    //   this.scrollDown()
    // }, 2000)
    // this.scrollDown()
  }
  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(50)
    }, 50);
  }

  userTyping(event: any) {
    // console.log(event);
    this.start_typing = event.target.value;
    this.scrollDown()
  }
}
