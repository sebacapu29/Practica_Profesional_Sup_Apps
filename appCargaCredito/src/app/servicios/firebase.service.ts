import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import { UsuarioCredito } from '../clases/usuario-credito';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  insertarCredito(usuario: UsuarioCredito) {
    return this.dataStore.collection("usuariosCredito").doc(usuario.id).update({...usuario});
  }

  constructor(private dataStore:AngularFirestore) {

   }

   GetAll(nombreEntidad:string){
    return this.dataStore.collection(nombreEntidad).snapshotChanges().pipe(
      map( actions=> 
        actions.map(a=>{
          const data = a.payload.doc.data();
          // const id = a.payload.doc.id;
          return data;
        }))
    );
   }
}
