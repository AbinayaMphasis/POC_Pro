import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  private apiUrl = 'http://localhost:8080/api/v1/lookups';

  /** Cached lookup results keyed by sorted table-name list */
  private cache = new Map<string, Record<string, any[]>>();

  /** In-flight requests keyed by the same cache key (avoids duplicate calls) */
  private inFlight = new Map<string, Observable<Record<string, any[]>>>();

  constructor(private http: HttpClient) {}

  /**
   * Fetches lookup data for the given table names.
   * Results are cached after the first successful call; subsequent calls
   * with the same set of table names return the cached data instantly.
   *
   * @param tableNames e.g. ['ServiceType', 'Drugs']
   * @returns Observable of a map: { ServiceType: [...], Drugs: [...] }
   */
  getLookupData(tableNames: string[]): Observable<Record<string, any[]>> {
    const cacheKey = [...tableNames].sort().join(',');

    // Return from cache if available
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return of(cached);
    }

    // Return in-flight observable if a request for the same key is already pending
    const pending = this.inFlight.get(cacheKey);
    if (pending) {
      return pending;
    }

    // Make the HTTP call, cache the result, and share with any concurrent subscribers
    const request$ = this.http.post<Record<string, any[]>>(this.apiUrl, tableNames).pipe(
      tap(data => {
        this.cache.set(cacheKey, data);
        this.inFlight.delete(cacheKey);
      }),
      shareReplay(1)
    );

    this.inFlight.set(cacheKey, request$);
    return request$;
  }

  /** Clear the lookup cache (e.g. on logout) */
  clearCache(): void {
    this.cache.clear();
    this.inFlight.clear();
  }
}
