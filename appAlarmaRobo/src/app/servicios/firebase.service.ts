import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private dataStore:AngularFirestore) {

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
