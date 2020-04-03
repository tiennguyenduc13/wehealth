import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { IPositionMap, PositionMap } from './position-map.model';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IHealthChange, HealthChange } from './place.model';
import { environment } from '../../environments/environment';
import * as _ from 'lodash';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);
  private healthChangeUrl = environment.backendUrl + '/health-change';
  private _healthChanges = new BehaviorSubject<IHealthChange[]>([]);
  private positionMapUrl = environment.backendUrl + '/position-map';

  get places() {
    return this._places.asObservable();
  }
  get healthChanges() {
    return this._healthChanges.asObservable();
  }
  constructor(private authService: AuthService, private http: HttpClient) {}
  updatePosition(userId, position) {
    console.log('ttt000 calling backend updatePosition', userId, position);
    if (!_.isEmpty(userId) && !_.isEmpty(position)) {
      return this.http
        .post<IPositionMap>(
          `${this.positionMapUrl}/updatePosition/${userId}`,
          position
        )
        .pipe(
          map((resData: IPositionMap) => {
            console.log('ttt updatePosition resData', resData);
          })
        );
    }
  }
  loadPositionMaps(): Observable<IPositionMap[]> {
    return this.http.get<IPositionMap[]>(`${this.positionMapUrl}/list`).pipe(
      map(resData => {
        const positionMaps = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            const newPositionMap: PositionMap = {
              id: key,
              position: resData[key].position,
              userId: resData[key].userId,
              healthSignals: resData[key].healthSignals,
              eventDate: resData[key].eventDate
            };
            positionMaps.push(newPositionMap);
          }
        }
        return positionMaps;
      })
    );
  }
  loadHealthChanges(userId: string): Observable<IHealthChange[]> {
    return this.http
      .get<IHealthChange[]>(`${this.healthChangeUrl}/listByUserId/${userId}`)
      .pipe(
        map(resData => {
          console.log('loadHealthChanges result: ', resData);
          const healthChanges = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              const newHealthChange: HealthChange = {
                id: key,
                userId: resData[key].userId,
                healthSignals: resData[key].healthSignals,
                eventDate: resData[key].eventDate
              };
              healthChanges.push(newHealthChange);
            }
          }
          console.log(
            'loadHealthChanges result healthChanges: ',
            healthChanges
          );

          return _.orderBy(healthChanges, ['eventDate'], ['desc']);
        })
      );
  }
  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        'https://ionic-angular-course-77f81.firebaseio.com/offered-places.json'
      )
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
          // return [];
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }
  addHealthChange(healthChange: IHealthChange) {
    console.log(healthChange);
    return this.http.post<IHealthChange>(this.healthChangeUrl + '/add', {
      ...healthChange,
      id: null
    });
  }
  updateHealthSignals(userId, healthSignals: string[]) {
    console.log('ttt000 calling backend updateHealthSignals', userId, {
      healthSignals
    });
    if (!_.isEmpty(userId) && !_.isEmpty(healthSignals)) {
      return this.http
        .post<IPositionMap>(
          `${this.positionMapUrl}/updateHealthSignals/${userId}`,
          healthSignals
        )
        .pipe(
          map((resData: IPositionMap) => {
            console.log('ttt updateHealthSignals resData', resData);
          })
        );
    }
  }
  getPlace(id: string) {
    return this.http
      .get<PlaceData>(
        `https://ionic-angular-course-77f81.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map(placeData => {
          return new Place(
            id,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.http
      .post<{ name: string }>(
        'https://ionic-angular-course-77f81.firebaseio.com/offered-places.json',
        {
          ...newPlace,
          id: null
        }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
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
    //       oldPlace.userId
    //     );
    //     return this.http.put(
    //       `https://ionic-angular-course-77f81.firebaseio.com/offered-places/${placeId}.json`,
    //       { ...updatedPlaces[updatedPlaceIndex], id: null }
    //     );
    //   }),
    //   tap(() => {
    //     this._places.next(updatedPlaces);
    //   })
    // )
  }
}
