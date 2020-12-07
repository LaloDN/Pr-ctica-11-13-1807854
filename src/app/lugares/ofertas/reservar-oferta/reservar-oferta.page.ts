import { NavController } from '@ionic/angular';
import { LugaresService } from './../../lugares.service';
import {Lugar} from './../../lugar.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-reservar-oferta',
  templateUrl: './reservar-oferta.page.html',
  styleUrls: ['./reservar-oferta.page.scss'],
})
export class ReservarOfertaPage implements OnInit, OnDestroy {

  lugar: Lugar;
  lugarSub: Subscription;
  isLoading=false;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private LugaresService: LugaresService){}

  ngOnInit() {
    this.route.paramMap.subscribe(paraMap => {
      if(!paraMap.has('lugarId')){
        this.navCtrl.navigateBack('/lugares/tabs/ofertas');
        return;
      }
      this.isLoading=true;
      this.lugarSub=this.LugaresService.getLugar(paraMap.get('lugarId')).subscribe(lugar=>{
        this.lugar=lugar;
        this.isLoading=false;
      });
    });
  }

  ngOnDestroy(){
    if(this.lugarSub){
      this.lugarSub.unsubscribe();
    }
  }

}
