import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';

import { IHealthChange, HealthChange } from './place.model';
import { PlaceLocation } from './location.model';
import * as firebaseAdmin from 'firebase-admin';
const serviceAccount = require('../../environments/config/wehealth-service-account.json');

import * as _ from 'lodash';
interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _healthChanges = new BehaviorSubject<IHealthChange[]>([]);

  get healthChanges() {
    return this._healthChanges.asObservable();
  }

  constructor(private http: HttpClient) {}
  loadHealthChanges(userId: string = '') {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount)
    });

    const db = firebaseAdmin.firestore();
    const collectionRef = db.collection('health-change');
    const queryResult = collectionRef
      .where('userId', '==', userId)
      .get()
      .then(healthChanges => {
        if (healthChanges.empty) {
          console.log('No matching documents.');
          return;
        }

        healthChanges.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

    return queryResult;
  }
  fetchHealthChanges(userId: string = '') {
    return this.http
      .get<{ [key: string]: IHealthChange }>(
        'https://wehealth-6d7d4.firebaseio.com/health-change.json'
      )
      .pipe(
        map(resData => {
          const healthChanges = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              const resDataUserId = resData[key].userId;
              if (
                _.isEmpty(userId) ||
                (!_.isEmpty(userId) && resDataUserId === userId)
              ) {
                const newHealthChange: HealthChange = {
                  id: key,
                  userId: resData[key].userId,
                  healthSignals: resData[key].healthSignals,
                  eventDate: resData[key].eventDate
                };
                healthChanges.push(newHealthChange);
              }
            }
          }
          return _.orderBy(healthChanges, ['eventDate'], ['desc']);
        }),
        tap(healthChanges => {
          this._healthChanges.next(healthChanges);
        })
      );
  }

  getHealthChange(id: string) {
    return this.http
      .get<IHealthChange>(
        `https://wehealth-6d7d4.firebaseio.com/health-change/${id}.json`
      )
      .pipe(
        map((healthChange: HealthChange) => {
          return {
            id: healthChange.id,
            userId: healthChange.userId,
            eventDate: healthChange.eventDate,
            healthSignals: healthChange.healthSignals
          };
        })
      );
  }

  addHealthChange(healthChange: IHealthChange) {
    let generatedId: string;

    const newHealthChange = new HealthChange(
      Math.random().toString(),
      healthChange.userId,
      healthChange.eventDate,
      healthChange.healthSignals
    );
    console.log('ttt newHealthChange ', newHealthChange);
    return this.http
      .post<{ name: string }>(
        'https://wehealth-6d7d4.firebaseio.com/health-change.json',
        {
          ...newHealthChange,
          id: null
        }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.healthChanges;
        }),
        take(1),
        tap(healthChanges => {
          newHealthChange.id = generatedId;
          this._healthChanges.next(healthChanges.concat(newHealthChange));
        })
      );
  }
  getPlace(id: any) {
    return null;
  }
  updatePlace(placeId: string, title: string, description: string) {
    // let updatedPlaces: Place[];
    // return this.places.pipe(
    //   take(1),
    //   switchMap(places => {
    //     if (!places || places.length <= 0) {
    //       return this.fetchPlaces();
    //     } else {
    //       return of(places);
    //     }
    //   }),
    //   switchMap(places => {
    //     const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
    //     updatedPlaces = [...places];
    //     const oldPlace = updatedPlaces[updatedPlaceIndex];
    //     updatedPlaces[updatedPlaceIndex] = new Place(
    //       oldPlace.id,
    //       title,
    //       description,
    //       oldPlace.imageUrl,
    //       oldPlace.price,
    //       oldPlace.availableFrom,
    //       oldPlace.availableTo,
    //       oldPlace.userId,
    //       oldPlace.location
    //     );
    //     return this.http.put(
    //       `https://wehealth-6d7d4.firebaseio.com/offered-places/${placeId}.json`,
    //       { ...updatedPlaces[updatedPlaceIndex], id: null }
    //     );
    //   }),
    //   tap(() => {
    //     this._places.next(updatedPlaces);
    //   })
    // );
    return null;
  }
}
