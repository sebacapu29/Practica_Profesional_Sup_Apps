import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  InsertarReaccionUsuarioAFoto(data:any) {
    return this.dataStore.collection("usuario_fotos_reaccion").add({...data});
  }
  
  UpdateIdFoto(docRef:string,tematica:string) {
    return this.dataStore.collection("relev_visual_cosas_" + tematica).doc(docRef).update({id:docRef}); 
  }
  UpdateFoto(docRef:string,tematica:string,foto:any) {
    return this.dataStore.collection("relev_visual_cosas_" + tematica).doc(docRef).update({...foto}); 
  }
  UpdateReaccion(docRef:string,entidad:any) {
    return this.dataStore.collection("usuario_fotos_reaccion").doc(docRef).update({...entidad}); 
  }
  constructor(private dataStore:AngularFirestore,
    private storage:AngularFireStorage) {
      
    }
    InsertUsuarioFoto(data:any,tematica:string) {
      return this.dataStore.collection("relev_visual_cosas_"+tematica).add(data);
        }
        ObtenerFotoPor(coleccion:string,operador,parametro:string,valor:string)
        {
          return this.dataStore.collection<any>(coleccion, ref => ref.where(parametro, operador, valor)).valueChanges();
        }
   GetAll(nombreEntidad:string){
    return this.dataStore.collection(nombreEntidad).snapshotChanges().pipe(
      map( actions=> 
        actions.map(a=>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return data;
        }))
    );
   }
}
