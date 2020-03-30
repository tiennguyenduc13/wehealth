import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  OnDestroy
} from '@angular/core';

import { environment } from '../../../environments/environment';
import { Plugins, Capacitor, GeolocationPosition } from '@capacitor/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page1.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;
  // WhiteHouse lat/lng
  center = { lat: 38.897957, lng: -77.03656 };
  googleMaps: any;
  mainMap: any;

  isLoading = false;
  loginName: string;

  constructor(private renderer: Renderer2, private authService: AuthService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.loginName = this.authService.loginName;
    this.locateUser()
      .then(geoPosition => {
        this.center = {
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude
        };
        this.isLoading = false;

        this.showMap();
      })
      .catch(err => {
        this.isLoading = false;
      });
  }
  createMarker() {
    return new this.googleMaps.Marker({
      position: this.center,
      map: this.mainMap,
      title: 'Me',
      icon: {
        url: 'assets/icon/itsme.png'
      }
    });
  }
  addMarkers() {
    // set marker
    const marker = this.createMarker();
    marker.setMap(this.mainMap);
    console.log('ttt111');
  }

  showMap() {
    this.getGoogleMaps()
      .then(googleMaps => {
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;
        this.mainMap = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16
        });

        this.addMarkers();

        this.googleMaps.event.addListenerOnce(this.mainMap, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  locateUser(): Promise<GeolocationPosition> {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      return;
    }
    this.isLoading = true;
    return Plugins.Geolocation.getCurrentPosition();
  }

  onCancel() {}

  ngOnDestroy() {}

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsAPIKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }
}
