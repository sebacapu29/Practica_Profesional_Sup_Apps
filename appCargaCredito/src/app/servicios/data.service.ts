import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Usuario } from '../clases/usuario';
import database from 'firebase';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { UsuarioCredito } from '../clases/usuario-credito';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  obtenerUsuarioCredito(correo: string) {
    throw new Error('Method not implemented.');
  }

  private usuarios: Usuario[] = [];
  private static idUsuario = 0;
  public static usuarioActual: Usuario;

  constructor(private firebaseAuth: AngularFireAuth,
              private storage: Storage) 
  {
  }

  registrar(usuario: UsuarioCredito)
  {
    return new Promise<any>((resolve,reject) => {
      this.firebaseAuth.createUserWithEmailAndPassword(usuario.correo, usuario.clave)
                        .then(response => {
                          usuario.clave = null;
                          this.crear(usuario, response.user.uid);
                          resolve(response);
                        }, 
                        error => reject(error));
    });
  }

  gerUserDetail()
  {
    return this.firebaseAuth.currentUser;
  }

  public crear(usuario: UsuarioCredito, uid: string): Promise<any>
  {
    usuario.perfil = "usuario";
    usuario.codigos = ['0'];

    return database.database().ref('usuarios/' + uid)
              .set(usuario)
              .then(() => usuario.id = uid)
              .then(()=> this.actualizar(usuario))
              .catch(() => console.info("No se pudo realizar alta"));
  }

  public guardarLocal(id: string)
  {
    console.log(id);

    const promesa = new Promise<any>(resolve => {
                    database.database().ref('usuarios/' + id).on('value',(snapshot) =>{
                      console.log("Guardar Local Storage");
                      DataService.usuarioActual = snapshot.val();
                      this.storage.set('usuario', snapshot.val());
                      resolve(DataService.usuarioActual);
                    });
    })

    return promesa;           
  }

  public obtenerLocal() : Promise<void | Usuario>
  {
    console.log("Obtener Local Storage");
    return this.storage.get('usuario');
  }

  // public leer(): Usuario[]
  // {
  //   let usuarios = [];
  //   console.info("Fetch de todos los Usuarios");

  //   database().ref('usuarios').on('value',(snapshot) => {          
  //       usuarios = [];  
  //       snapshot.forEach((child) =>{
  //         var data = child.val();
  //         usuarios.push(new UsuarioCredito {child.key, data.nombre, data.dni,data.domicilio, 
  //                                           data.telefono, data.email, data.credito, data.codigos, data.rol});
  //       });
  //       console.info("Fetch Usuarios");
  //   })
  //   return usuarios;
  // }

  public actualizar(usuario: Usuario): Promise<any>
  {
    return database.database().ref('usuarios/' + usuario.id)
                  .update(usuario)
                  .then(() => this.guardarLocal(usuario.id))
                  .catch(() => console.info("No se pudo actualizar"));
  }

  public borrar(id: number): Promise<any>
  {
    return database.database().ref('usuarios/' + id)
                  .remove()
                  .then(() => console.info("Usuario eliminado"))
                  .catch(() => console.info("No se pudo realizar la baja."));
  }

  public fetchQR(codigoQR: string)
  {
    return database.database().ref(`codigos/${codigoQR}`).once('value');
  }

}