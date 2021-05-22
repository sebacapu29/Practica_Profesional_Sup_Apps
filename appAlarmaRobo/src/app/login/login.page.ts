import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Usuario } from '../clases/usuario';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../servicios/firebase.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials:firebase.default.auth.AuthCredential;
  usuario:Usuario = new Usuario();
  ingresando:boolean=false;
  miFormulario:FormGroup;
  listaUsuarioModel:Usuario[]=[];

  constructor(private authServ:AngularFireAuth,
              private router:Router,
              public toastController: ToastController,
              private formBuilder:FormBuilder,
              private firebase:FirebaseService){
                this.miFormulario = formBuilder.group({
                  email: new FormControl("", Validators.compose([
                    Validators.required,
                    Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)
                  ])),
                  clave: [
                    "",
                    Validators.compose([
                      Validators.minLength(8),
                      Validators.pattern("[0-9a-z-A-Z@.#*$!?&+-/]*"),
                      Validators.required
                    ])
                  ]
                })

  }
  ngOnInit(): void {
    this.TraerUsuarios();
  }

  TraerUsuarios(){
    this.firebase.GetAll("usuarios").subscribe((lu)=>{
      if(lu){
        this.listaUsuarioModel= <Usuario[]>lu;
      }
    })
  }
  Autenticar(formulario){
    const correo = this.miFormulario.get('email').value;
    const clave = this.miFormulario.get('clave').value;

    this.ingresando = true;
    this.authServ.signInWithEmailAndPassword(correo,clave)
    .then(()=>{
      this.presentToast("Bienvenido!");
      this.router.navigate(["home"]);
    })
    .catch(()=>{
      this.presentToast("Usuario o Clave Incorrecto");
    }).finally(
      ()=>{
        this.ingresando=false;
      }
    )
  }
  SeleccionUsuario(usuario){
    this.miFormulario.setValue({email : usuario.correo, clave : usuario.clave });
  }
  async presentToast(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
}
