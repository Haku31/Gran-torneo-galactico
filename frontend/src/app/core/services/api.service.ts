import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Species, Combat, CreateSpeciesDto } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  private handleError(context: string) {
    return (err: unknown) => {
      console.error(`[ApiService] ${context}:`, err);
      return throwError(() => err);
    };
  }

  getSpecies(): Observable<Species[]> {
    return this.http.get<Species[]>(`${this.baseUrl}/species`).pipe(
      catchError(this.handleError('getSpecies'))
    );
  }

  createSpecies(data: CreateSpeciesDto): Observable<Species> {
    return this.http.post<Species>(`${this.baseUrl}/species`, data).pipe(
      catchError(this.handleError('createSpecies'))
    );
  }

  getCombats(): Observable<Combat[]> {
    return this.http.get<Combat[]>(`${this.baseUrl}/combats`).pipe(
      catchError(this.handleError('getCombats'))
    );
  }

  startCombat(data: { species1Id: number; species2Id: number }): Observable<Combat> {
    return this.http.post<Combat>(`${this.baseUrl}/combats`, data).pipe(
      catchError(this.handleError('startCombat'))
    );
  }

  randomCombat(): Observable<Combat> {
    return this.http.post<Combat>(`${this.baseUrl}/combats/random`, {}).pipe(
      catchError(this.handleError('randomCombat'))
    );
  }

  getRanking(): Observable<Species[]> {
    return this.http.get<Species[]>(`${this.baseUrl}/ranking`).pipe(
      catchError(this.handleError('getRanking'))
    );
  }
}
