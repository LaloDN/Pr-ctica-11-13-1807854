import { Reservacion } from './../../../reservaciones/reservacion.model';
import { ReservacionService } from './../../../reservaciones/reservacion.service';
import { NuevaReservacionComponent } from './../../../reservaciones/nueva-reservacion/nueva-reservacion.component';
import { Lugar } from './../../lugar.model';
import { LugaresService } from './../../lugares.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ActionSheetController, NavController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-detalle-lugar',
  templateUrl: './detalle-lugar.page.html',
  styleUrls: ['./detalle-lugar.page.scss'],
})
export class DetalleLugarPage implements OnInit, OnDestroy {

  lugarActual: Lugar;
  lugarSub: Subscription;
  isLoading=false;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private lugarService: LugaresService,
    private actionSheetCtrl: ActionSheetController,
    private reservacionService: ReservacionService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ){}

  ngOnInit() {
    this.route.paramMap.subscribe(paraMap => {
      if(!paraMap.has('lugarId')){
        this.navCtrl.navigateBack('/lugares/tabs/busqueda');
        return;
      }
      this.lugarSub=this.lugarService.getLugar(paramMap.get('lugarID')).subscribe(lugar=>{
        this.lugarActual=lugar;
        this.isLoading=false;
      }, error=>{
        this.alertCtrl.create({
          header: 'Error',
          message:'Error al obtener el lugar !',
          buttons:[
            {text:'Ok',handler:()=>{
              this.router.navigate(['lugares/tabs/busqueda']);
            }}
          ]
        }).then(alertEl=>{
          alertEl.present();
        });
      }
      );
    });
  }

  ngOnDestroy(){
    if(this.lugarSub){
      this.lugarSub.unsubscribe();
    }
  }
  onReservarLugar(){
    //this.router.navigateByUrl('/lugares/tabs/busqueda');
    //this.navCtrl.pop();
    //this.navCtrl.navigateBack('/lugares/tabs/busqueda');

    this.actionSheetCtrl.create({
      header: 'Selecciona accion',
      buttons: [
        {text: 'Seleccionar fecha', handler:()=>{
          this.openReservarModal('random');
        }},
        {text: 'Cancelar',role:'cancel'}
      ]
    }).then(actionSheetEl =>{actionSheetEl.present();
    });
    this.modalCtrl.create({component: NuevaReservacionComponent, componentProps: {lugar: this.lugarActual, mode:mode}}).then(modalEl=>{modalEl.present(); return modalEl.onDidDismiss();}).then(resultData=>{console.log(resultData);
    if(resultData.role=='confirm'){
      this.loadingCtrl.create({message:'haciendo reservacion...'}).then(loadingEl=>{
        loadingEl.present();
        const data= resultData.data.Reservacion;
        this.reservacionService.addReservacion(
          this.lugarActual.id,
          this.lugarActual.titulo,
          this.lugarActual.imageUrl,
          data.nombre,
          data.apellido,
          data.numeroHuespedes,
          data.desde,
          data.hasta,
        ).susbcribe(()=>{loadingEl.dismiss();});
      });
    }});
  }

  openReservarModal(mode:'select'|'random'){
    console.log(mode);
  }

}
