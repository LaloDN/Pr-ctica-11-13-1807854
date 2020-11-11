import { NgForm } from '@angular/forms';
import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { Lugar } from './../../lugares/lugar.model';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-nueva-reservacion',
  templateUrl: './nueva-reservacion.component.html',
  styleUrls: ['./nueva-reservacion.component.scss'],
})
export class NuevaReservacionComponent implements OnInit {
  @Input() lugar: Lugar;
  @Input() mode: 'select' | 'random';
  desde: string;
  hasta: string;
  @ViewChild('formNew') myform: NgForm;

  constructor(private modaCtrl: ModalController) { }

  ngOnInit() {
    const disponibleDesde= new Date(this.lugar.disponibleDesde);
    const disponibleHasta= new Date(this.lugar.disponibleHasta);
    if(this.mode==='random'){
      this.desde= new Date(disponibleDesde.getTime()+Math.random()*(disponibleHasta.getTime()-(7*24*60*60*1000)-disponibleDesde.getTime())).toISOString();
      this.hasta= new Date(new Date(this.desde).getTime()+Math.random()*(new Date(this.desde).getTime()+(6*24*60*60*1000)-new Date(this.desde).getTime())).toISOString();
    }
  }

  onBookPlace(){
    if(!this.myform.valid || !this.fechasValidas()){
      return;
    }
    this.modaCtrl.dismiss({reservacion:{
      nombre: this.myform.value['nombre'],
      apellido: this.myform.value['apelldio'],
      numeroHuespedes: +this.myform.value['numero-huespedes'],
      desde: new Date(this.myform.value['fec-desde']),
      hasta: new Date(this.myform.value['fech-hasta']),
    }}, 'confirm');
  }

  onCancel(){
    this.modaCtrl.dismiss(null, 'cancel');
  }

  fechasValidas(){
    try{
      const inicio=new Date(this.myform.value['fec-desde']);
      const fin= new Date(this.myform.value['fec-hasta']);
      return fin>inicio;
    }
    catch(ex){
      return false;
    }
  }
}
