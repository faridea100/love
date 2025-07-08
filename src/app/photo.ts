import { httpResource, HttpResourceRef, HttpEvent, HttpEventType  } from '@angular/common/http';
import { effect, ElementRef, inject, Injectable, signal, Signal, ViewChild, WritableSignal } from '@angular/core';
// import { Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Photo {
pics!: HttpResourceRef<any>;
pic!: HttpResourceRef<any>;
prevScrollTop=signal<number>(0);
selectedPic=signal<{img:string,name:number}>({img:'',name:0})
pageShow=signal<boolean>(true);
  constructor() {
    this.pics = httpResource<any>(
      () =>
        // '/celebs.json',
         'https://raw.githubusercontent.com/faridea100/love/main/celebs.json',
      {
        parse: (response: any) => response
      },
    );

    this.pic = httpResource.blob<any>(
      () => this.selectedPic().img,
      {
        parse: (response: any) => response
      }
    );

    console.log("selected-pic",this.pic.value())
  }

  

//   rrr = effect(()=>{
//       if(this.pageShow()) this.r2.addClass(this.page()?.nativeElement,`shown_${this.pageShow()}`);
//       else if(!this.pageShow()) this.r2.removeClass(this.page()?.nativeElement,`shown_${this.pageShow()}`);
// })
}

