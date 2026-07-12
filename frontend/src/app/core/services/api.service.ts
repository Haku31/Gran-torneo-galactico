import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Species, Combat, CreateSpeciesDto } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // ── Species ──────────────────────────────────────────────────────────────

  getSpecies(): Observable<Species[]> {
    return this.http.get<Species[]>(`${this.baseUrl}/species`);
  }

  createSpecies(data: CreateSpeciesDto): Observable<Species> {
    return this.http.post<Species>(`${this.baseUrl}/species`, data);
  }

  // ── Combats ───────────────────────────────────────────────────────────────

  getCombats(): Observable<Combat[]> {
    return this.http.get<Combat[]>(`${this.baseUrl}/combats`);
  }

  startCombat(data: { species1Id: number; species2Id: number }): Observable<Combat> {
    return this.http.post<Combat>(`${this.baseUrl}/combats`, data);
  }

  randomCombat(): Observable<Combat> {
    return this.http.post<Combat>(`${this.baseUrl}/combats/random`, {});
  }

  // ── Ranking ───────────────────────────────────────────────────────────────

  getRanking(): Observable<Species[]> {
    return this.http.get<Species[]>(`${this.baseUrl}/ranking`);
  }
}
