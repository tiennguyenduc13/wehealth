import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IHealthChange, HealthChange } from './place.model';
import { IPositionMap, PositionMap } from './position-map.model';
import * as _ from 'lodash';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private healthChangeUrl = environment.backendUrl + '/health-change';
  private positionMapUrl = environment.backendUrl + '/position-map';
  private _healthChanges = new BehaviorSubject<IHealthChange[]>([]);

  get healthChanges() {
    return this._healthChanges.asObservable();
  }

  constructor(private http: HttpClient) {}
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

  loadHealthChanges(userId: string): Observable<IHealthChange[]> {
    return this.http
      .get<IHealthChange[]>(`${this.healthChangeUrl}/listByUserId/${userId}`)
      .pipe(
        map(resData => {
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
          return _.orderBy(healthChanges, ['eventDate'], ['desc']);
        })
      );
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

  getLatestHealthChange(userId: string): Observable<IHealthChange> {
    return this.http
      .get<IHealthChange>(`${this.healthChangeUrl}/latest/${userId}`)
      .pipe(resData => {
        return resData;
      });
  }

  getHealthChange(id: string) {
    return this.http.get<IHealthChange>(`${this.healthChangeUrl}/${id}`).pipe(
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
    console.log(healthChange);
    return this.http.post<IHealthChange>(this.healthChangeUrl + '/add', {
      ...healthChange,
      id: null
    });
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
    //       `https: ; // wehealth-6d7d4.firebaseio.com/offered-places/${placeId}.json`,
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
