import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { finalize, switchMap } from 'rxjs/operators';
import { FirebaseService } from '../servicios/firebase.service';
import { File } from '@ionic-native/file/ngx';
import { Image } from '../clases/image';
import { ModalController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {
  
   options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  listaFotos:any[]=[];
  base64Image:any;
  tematica:string;
  usuario:string;
  public progress: boolean = false;

  constructor(private camera: Camera,
    private storage: AngularFireStorage,
    private activRoute: ActivatedRoute,
    private router:Router,
    // public service: AuthService, 
    private modalController: ModalController,
    private file: File, 
    private fservice: FirebaseService) {


      var observ = this.activRoute.paramMap.pipe(
        switchMap((params: ParamMap) => {
          this.tematica = params.get('tematica');
          // console.log("db_pps_" + this.division .toLowerCase());

          fservice.GetAll("relev_visual_cosas_" + this.tematica.toLowerCase()).subscribe(fotos=>{
           this.listaFotos=fotos;
          })
          return this.tematica;
        })
      );
      observ.subscribe();
      this.usuario = localStorage.getItem("usuario");
     }

  ngOnInit() {
  }
  detalleFoto(foto){
    this.router.navigate(["/detalle-foto",{idFoto:foto.id, tematica:this.tematica}]);
  }

  async takePicture() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    try {
   

      let cameraInfo = await this.camera.getPicture(options);
      
      const modal = await this.modalController.create({
        component: ModalPage,
        cssClass: 'my-custom-class'
      });
      
      await modal.present();
      const { data } = await modal.onWillDismiss();

      let blobInfo = await this.makeFileIntoBlob(cameraInfo);
      let uploadInfo: any = await this.uploadToFirebase(blobInfo,data.nombre);
      // let user = this.service.getCurrentUserId();
      let new_image = new Image(this.tematica, this.usuario, blobInfo['fileName'], 0);
      // this.fservice.InsertUsuarioFoto({usuario:this.usuario ,url:uploadInfo, fecha_creacion: new Date(),likes:0, dislikes:0 },this.tematica);

    } catch (e) {
      console.log(e);
      alert(e);
    }
  }

  // FILE STUFF
  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
          fileName = name;

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => {
          alert(e.message);
          reject(e)
        });
    });
  }

  /**
   *
   * @param _imageBlobInfo
   */
  uploadToFirebase(_imageBlobInfo,nombre) {
    this.progress = true;
    const context = this;
    const newDate = new Date();
    _imageBlobInfo.fileName = nombre + "_" + newDate.getDate()+"-"+newDate.getMonth()+"-"+newDate.getFullYear();
    return new Promise((resolve, reject) => {
      let fileRef = this.storage.ref("relevamiento_visual/" + _imageBlobInfo.fileName);
      let uploadTask = fileRef.put(_imageBlobInfo.imgBlob);

      uploadTask.task.on(
        "state_changed",
        (_snapshot: any) => {
          this.progress = true;
        },
        _error => {
          // this.alertSerive.create(_error.message);
          alert(_error.message);
          reject(_error);
        },
        () => {
          resolve(uploadTask.snapshotChanges);
        }
      );
      uploadTask.snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              this.listaFotos.push(url);
              this.fservice.InsertUsuarioFoto({usuario:this.usuario ,url:url, fecha_creacion: new Date(),likes:0, dislikes:0, name: _imageBlobInfo.fileName },this.tematica)
              .then((docRef)=> {
                context.fservice.UpdateIdFoto(docRef.id,this.tematica);
                this.progress = false
              });
            });
          })
        ).subscribe();
    });
  }
}
