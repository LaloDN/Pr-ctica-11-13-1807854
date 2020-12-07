import { environment } from './../../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { Component, OnInit , AfterViewInit, ElementRef, Renderer2, ViewChild} from '@angular/core';
import { scrypt } from 'crypto';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapElement: ElementRef;
  constructor(private modalCtrl: ModalController, private render: Renderer2) { }

  ngOnInit() {}

  onCancel(){
    this.modalCtrl.dismiss();
  }

  ngAfterViewInit(){
    this.getGoogleMaps().then(googleMaps=>{
      const mapEl=this.mapElement.nativeElement;
      const map= new googleMaps.Map(mapEl,{
        center:{lat:25.7226326, lng:-100.3120671},
        zom:16
      });
      googleMaps.event.addListenerOnce(map,'idle',()=>{
        this.render.addClass(mapEl,'visible');
      });
      map.addListener('click',event=>{
        const coords={lat:event.latLng.lat(),lng:event.latLng.lng()};
        this.modalCtrl.dismiss(coords);
      });
    }).catch(err=>{
      console.error(err);
    })
  }
  private getGoogleMaps(){
    const win=window as any;
    const googleModule= win.google;
    if(googleModule && googleModule.maps){
      return Promise.resolve(googleModule.maps);
    }

    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src='API KEY';
      script.async=true;
      script.defer=true;
      document.body.appendChild(script);
      script.onload=()=>{
        const loadedGoogleModule=win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps){
          resolve(loadedGoogleModule.maps);
        }
        else{
          reject('Google Maps SDK no permitido :(');
        }
      }
    });

  }
}
