import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { PlacesService } from '../../places.service';
import { IHealthChange } from '../../place.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss']
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(
    private placeService: PlacesService,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}
  ngOnInit() {
    this.form = new FormGroup({
      rdoPositive: new FormControl(null, {
        updateOn: 'blur'
      }),
      rdoSymptoms: new FormControl(null, {
        updateOn: 'blur'
      }),
      rdoExposed: new FormControl(null, {
        updateOn: 'blur'
      }),
      rdoNormal: new FormControl(null, {
        updateOn: 'blur'
      })
    });
  }
  saveMyHealthSignals(healthSignals: string[]) {
    this.placeService
      .updateHealthSignals(this.authService.userId, healthSignals)
      .subscribe(positionMap => {});
  }

  onCreateHealthChange() {
    // if (!this.form.valid) {
    //   return;
    // }
    this.loadingCtrl
      .create({
        message: 'Creating health change...'
      })
      .then(loadingEl => {
        loadingEl.present();
        const healthSignals: string[] = [];

        if (this.form.value.rdoPositive) {
          healthSignals.push('positive');
        }
        if (this.form.value.rdoSymptoms) {
          healthSignals.push('symptoms');
        }
        if (this.form.value.rdoExposed) {
          healthSignals.push('exposed');
        }
        if (this.form.value.rdoNormal) {
          healthSignals.push('normal');
        }
        const healthChange: IHealthChange = {
          userId: this.authService.userId,
          healthSignals: healthSignals,
          eventDate: new Date()
        };
        this.placeService
          .addHealthChange(healthChange)
          .subscribe((newHealthChange: IHealthChange) => {
            console.log('Done added here', newHealthChange);
            this.saveMyHealthSignals(newHealthChange.healthSignals);
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
}
