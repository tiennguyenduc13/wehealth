import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { IHealthChange, HealthChange } from './place.model';
import * as _ from 'lodash';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private url = environment.backendUrl + '/health-change';
  private _healthChanges = new BehaviorSubject<IHealthChange[]>([]);

  get healthChanges() {
    return this._healthChanges.asObservable();
  }

  constructor(private http: HttpClient) {}
  loadHealthChanges(userId: string = ''): Observable<IHealthChange[]> {
    return this.http.get<IHealthChange[]>(this.url).pipe(
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
    return this.http.get<IHealthChange>(`${this.url}/${id}`).pipe(
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
    return this.http
      .post<{ name: string }>(this.url + '/add', {
        ...newHealthChange,
        id: null
      })
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
