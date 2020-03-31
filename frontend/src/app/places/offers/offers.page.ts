import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

import { PlacesService } from '../places.service';
import { IHealthChange } from '../place.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit {
  healthChanges: IHealthChange[];
  isLoading = false;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService
      .loadHealthChanges(this.authService.userId)
      .subscribe(healthChanges => {
        this.isLoading = false;
        this.healthChanges = healthChanges;
      });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
    console.log('Editing item', offerId);
  }
}
