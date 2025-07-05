import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Photo {

pics!: HttpResourceRef<any>;
  constructor() {
    this.pics = httpResource<any>(
      () =>
        'https://raw.githubusercontent.com/faridea100/love/main/celebs.json',
      {
        parse: (response: any) => response,
      }
    );
  }
}
