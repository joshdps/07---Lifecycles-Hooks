import { Component, OnInit } from '@angular/core';
import { switchMap, tap, map } from 'rxjs';

import { PaisesService } from '../../services/paises.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Borders, Country } from '../../interfaces/Country.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {

  // UI 
  loadingFlag: boolean = false;

  form: FormGroup = this._fb.group({
    region  : [ '', [ Validators.required ] ],
    country : [ '', [ Validators.required ] ],
    border  : [ '', [ Validators.required ] ]

  })

  // Selects info arrays
  regions   : string[]  = [];
  countries : Country[] = [];
  borders   : Country[] = [];

  constructor(private _fb: FormBuilder,
    private _ps: PaisesService) { }

  ngOnInit(): void {
    this.regions = this._ps.regions;

    this.form.get('region')?.valueChanges
      .pipe(
        tap( _ => {
          this.form.get('country')?.reset('');
          this.loadingFlag = true;
        }),
        switchMap( region => this._ps.getCountriesByRegion(region) )
        )
        .subscribe(countries => {
          
          this.countries = countries!;
          this.loadingFlag = false;

      })

    this.form.get('country')?.valueChanges
      .pipe(
        tap( _ => {          
          this.form.get('border')?.reset('');
          this.loadingFlag = true;

        }),
        switchMap( code => this._ps.getCountriesByCode( code ) ),
        tap( ( country ) => {
            if (country.borders) this.loadingFlag = false;

        }),
        switchMap( country => this._ps.getCountriesDescription( country.borders  )  )
        )
        .subscribe( countries => {
                    
          this.borders = countries || [];
          this.loadingFlag = false;
           
        } )


  }

  save() {
    console.log(this.form.value);
  }



}





/*
  
// When region selector changes
 
 this.form.get('region')?.valueChanges
 .subscribe( region => {
 
 
// If none region selected
  
if (region === '') return 
  
// Call http request to get countries by region selected
 
  this._ps.getCountriesByRegion( region ).subscribe( countries => {
    this.countries = countries;
  })
  
})

*/