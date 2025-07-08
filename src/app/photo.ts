import { httpResource, HttpResourceRef } from '@angular/common/http';
import { effect, ElementRef, inject, Injectable, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
// import { Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Photo {
pics!: HttpResourceRef<any>;
prevScrollTop=signal<number>(0)
pageShow=signal<boolean>(true);
  constructor() {
    this.pics = httpResource<any>(
      () =>
        // '/celebs.json',
         'https://raw.githubusercontent.com/faridea100/love/main/celebs.json',
      {
        parse: (response: any) => response,
      }
    );
  }

  

//   rrr = effect(()=>{
//       if(this.pageShow()) this.r2.addClass(this.page()?.nativeElement,`shown_${this.pageShow()}`);
//       else if(!this.pageShow()) this.r2.removeClass(this.page()?.nativeElement,`shown_${this.pageShow()}`);
// })
}

