import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country } from '../interfaces/Country.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  baseUrl:string = 'https://restcountries.com'

  private _regions: string[] = [ 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania' ]

  get regions(): string[]{
    return [ ...this._regions ];
  }
  constructor( private _http: HttpClient ) { }

  getCountriesByRegion( region: string ): Observable<Country[] | null>{
    if ( !region ){
      return of(null)
    }
    let url = `${ this.baseUrl }/v3.1/region/${ region }?fields=name,cca3,borders`;
    
    return this._http.get<Country[]>(url)
  }
  
  
  getCountriesByCode( code: string ): Observable<Country[] | any>{
    if ( code === '' ){
      return of([])
    }
    let url = `${ this.baseUrl }/v3.1/alpha/${ code }?fields=borders,cca3`;
    
    return this._http.get<Country[]>(url)
  }
  
  
  getCountryByCode( code: string ): Observable<Country>{

    let url = `${ this.baseUrl }/v2/alpha/${ code }?fields=name,alpha3Code`;
    
    return this._http.get<Country>(url)
  }


  getCountriesDescription( borders: string[] ): Observable<Country[]>{

    
    
    if ( !borders ) return of([]);
    
    const requests: Observable<Country>[] = [];
    
    borders.forEach( borderCode => {
        
      const req = this.getCountryByCode( borderCode );

      requests.push(req)
    })

   return combineLatest( requests )


  }

}
