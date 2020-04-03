import { Component, OnInit, Input } from '@angular/core';

import { IHealthChange } from '../../place.model';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss']
})
export class OfferItemComponent implements OnInit {
  @Input() healthChange: IHealthChange;

  constructor() {}

  ngOnInit() {
    console.log('ngOnInit healthChange', this.healthChange);
  }
}
