import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';

import { Observable, throwError } from 'rxjs';

import { Person } from './interfaces/person';
import { Product } from './interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

  readonly path = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getPeople(): Observable<Person[]>{
    return this.http.get<Person[]>(`${this.path}/people`);
  }

  getProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.path}/products`);
  }
}
