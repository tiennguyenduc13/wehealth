import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PlacesService } from '../places.service';
import { IHealthChange } from '../place.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
  healthChanges: IHealthChange[];
  isLoading = false;
  private healthChangeSub: Subscription;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.healthChangeSub = this.placesService.healthChanges.subscribe(
      healthChanges => {
        this.healthChanges = healthChanges;
      }
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService
      .loadHealthChanges(this.authService.userId)
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
    console.log('Editing item', offerId);
  }

  ngOnDestroy() {
    if (this.healthChangeSub) {
      this.healthChangeSub.unsubscribe();
    }
  }
}
