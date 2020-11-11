import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReservacionService } from './reservacion.service';
import { Reservacion } from './reservacion.model';
import { IonItemSliding,LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.page.html',
  styleUrls: ['./reservaciones.page.scss'],
})
export class ReservacionesPage implements OnInit, OnDestroy {

  reservacionesCargadas: Reservacion[];
  private reservacionSub: Subscription;

  constructor(private reservacionService: ReservacionService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.reservacionSub=this.reservacionService.reservaciones.subscribe(rsvs=>{
      this.reservacionesCargadas=rsvs;
    })
  }

  ngOnDestroy(){
    if(this.reservacionSub){
      this.reservacionSub.unsubscribe();
    }
  }

  onRemoveReservacion(id: number, slidignEl:IonItemSliding){
  slidignEl.close();
  this.loadingCtrl.create({message:'cancelando reservación...'}).then(loadingEl=>{
    loadingEl.present();
    this.reservacionService.cancelarReservacion(id).subscribe((){
      loadingEl.dismiss();
    });
  })

}
