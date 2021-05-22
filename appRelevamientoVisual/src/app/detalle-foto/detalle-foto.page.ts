import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FirebaseService } from '../servicios/firebase.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-foto',
  templateUrl: './detalle-foto.page.html',
  styleUrls: ['./detalle-foto.page.scss'],
})
export class DetalleFotoPage implements OnInit {
  foto:any;
  usuario:string;
  url:string;
  likes:number;
  dislikes:number;
  fecha:string;
  puedeVotar:boolean=false;
  reaccionesUsuario:any;
  idFoto:string;
  tematica:string;
  usuarioReaccion:string;

  constructor(private activRoute: ActivatedRoute,
    private fbService:FirebaseService,
    private toast:ToastController) {
    // var usuario = 
     this.activRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const idFoto = this.idFoto = params.get('idFoto');
        const tematica = this.tematica = params.get('tematica');
        const usuario = this.usuarioReaccion= localStorage.getItem("usuario");
        const context = this;
        
        console.log(idFoto);

        this.fbService.ObtenerFotoPor("relev_visual_cosas_" + tematica,"==","id",idFoto)
        .subscribe(fotos=>{
          if(fotos[0]){
            this.usuario = fotos[0].usuario;
            this.url = fotos[0].url;
            this.likes = fotos[0].likes;
            this.dislikes = fotos[0].dislikes;      
            this.fecha = fotos[0].fecha_creacion.toDate().toLocaleDateString();
          }
        });
        this.fbService.ObtenerFotoPor("usuario_fotos_reaccion","==","usuario",usuario)
        .subscribe(reaccionesUsuario=>{
          if(reaccionesUsuario[0]){
            this.reaccionesUsuario = reaccionesUsuario[0];

            reaccionesUsuario[0].listado.forEach(foto => {
              if(foto.idFoto==idFoto){
                context.puedeVotar=true;
              }
            });
          }
        })
       
        return "sdsfdsf";
      })
    ).subscribe();
    // observ.subscribe();
   }

   async reaccionarAFoto(reaccion:number){
     const context = this;
     if(this.reaccionesUsuario==null){
       this.reaccionesUsuario = {};
       var nuevaReaccion = { usuario: this.usuarioReaccion, listado:[{idFoto:this.idFoto,fecha: new Date(),reaccion: reaccion}]};
       this.fbService.InsertarReaccionUsuarioAFoto(nuevaReaccion)
       .then((docRef)=> {
        var nuevaReaccion = { usuario: this.usuarioReaccion, id: docRef.id, listado:[{idFoto:this.idFoto,fecha: new Date(),reaccion:reaccion}]};
        context.fbService.UpdateReaccion(docRef.id, nuevaReaccion); 
      });
      const toast = await this.toast.create({
        message: "Votada!",
        duration: 2000
      });
    }
    else{
      this.reaccionesUsuario.listado.push({idFoto:this.idFoto,fecha: new Date(),reaccion:reaccion});
      this.fbService.UpdateReaccion(this.reaccionesUsuario.id, this.reaccionesUsuario);
    }
    if(reaccion==1){
      this.likes++;
    }
    if(reaccion==0){
      this.dislikes++;
    }
    this.fbService.UpdateFoto(this.idFoto,this.tematica,{likes:this.likes, dislikes:this.dislikes});
   }
  ngOnInit() {
   
  }
}
