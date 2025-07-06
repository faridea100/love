import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {
  Component,
  inject,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  effect,
  computed,
  signal,
  viewChild,
  ViewContainerRef,
  TemplateRef,
  EmbeddedViewRef,
  WritableSignal,
} from '@angular/core';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { Photo } from './photo';
import { Header } from './shared/header';
import { NgTemplateOutlet } from '@angular/common';
import PageNotFoundComponent from './pages/[...page-not-found].page';
register();

@Component({
  standalone: true,
  selector: 'app-imgs',
  imports: [Header, NgTemplateOutlet, PageNotFoundComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
#swiperWrapper {
  position:relative;
}
#swiperTop {
      background: rgba(255, 255, 255, 0.2);
    display: flex;
    position: absolute;
    top: 0;
    z-index: 344;
    width: 100%;
    height:50px;
    justify-content: space-between;
    align-items:center;
}

#swiperBot {
  display: flex;
  justify-content:center;
  position: absolute;
    bottom: 40px;
    left: 0;
    right: 0; z-index:346
}

.swiper-button-prev svg path, .swiper-button-next svg path {
  fill:#007aff !important;
      stroke-width: 2px;
}

#mySwiper {
  //width: 100vw;
  height: calc(100vh - 50px); /* or auto if using autoHeight */
  min-height: calc(100vh - 50px); /* or auto if using autoHeight */
  swiper-container {
    height: 100%;
    min-height: 100%;
    swiper-slide {
      height: 100%;
      min-height: 100%;
      display:flex;
      align-items:center;
      img {
        width: 100vw;
        min-width: 100vw;
        img {
          margin: 0 auto;
        }
      }
    }
  }


}


  #list_popup{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 989;
        box-shadow: 0 -2px 10px 2px rgb(24 20 3);
    background: rgba(43, 35, 8, 1);
      #list_popup_in{
        height: 50vh;
        max-height: 50vh;
        overflow-y: auto;
        overflow-x: hidden;
      }
  }

  `,
  template: `
    <app-header></app-header>
    @if(photoService.pics.status() === 'resolved') {
    <div id="swiperWrapper">
      <div id="swiperTop" class="px-3">
        <div class="bg-amber-100 inline-block rounded-sm">
          <a (click)="router.navigate(['/home'])">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#007aff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-6 h-6"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </a>
        </div>
        <div><button (click)="openListPopup()">OPEN</button></div>
        <div class="bg-amber-100 inline-block rounded-sm px-2">
          {{ activeImg() }}/{{ photoService.pics.value().images.length + 1 }}
        </div>
        <!-- <div>id</div> -->
      </div>
      <ng-container
        [ngTemplateOutlet]="sld"
        [ngTemplateOutletContext]="{ imgs: photoService.pics.value().images }"
      ></ng-container>

      <!-- <div id="swiperBot">
        <div><button (click)="openListPopup()">OPEN</button></div>
      </div> -->
    </div>

    <ng-container #list_vref></ng-container>
    } @else if(photoService.pics.status() === 'loading') {
    <p>...LOADING</p>
    }

    <ng-template #sld let-imgs="imgs">
      <div id="mySwiper">
        <swiper-container
          id="sc"
          height="100%"
          slides-per-view="1"
          speed="2300"
          loop="false"
          css-mode="true"
          navigation="true"
          pagination="false"
          scrollbar="true"
        >
          @for(img of imgs; track img) {
          <swiper-slide lazy="true">
            <img [src]="img" loading="lazy" />
          </swiper-slide>
          }
        </swiper-container>
      </div>
    </ng-template>

    <ng-template #list let-imgs="imgs">
      <div id="list_popup">
        <a (click)="closeListPopup()">Close</a>
        <div id="list_popup_in">
          <div class="grid  p-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 ">
            @for(img of imgs; track img; let i= $index) {
            <div
              class="flex items-center p-2 md:p-7 md:gap-8 rounded-2xl"
              (click)="updateSlide(i)"
            >
              <div>
                <img class="shadow-xl rounded-md" [alt]="img" [src]="img" />
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class Imgs {
  router = inject(Router);
  ar = inject(ActivatedRoute);
  id: WritableSignal<number> = signal(
    parseInt(inject(ActivatedRoute).snapshot.paramMap.get('id') as string)
  );
  host = inject(ElementRef);
  photoService = inject(Photo);
  activeImg = signal(1);
  listTempRef = viewChild.required<TemplateRef<any>>('list');
  listVref = viewChild.required('list_vref', { read: ViewContainerRef });
  hh!: EmbeddedViewRef<any>;
  swiperEl!: SwiperContainer;
  fff = effect(() => {
    console.log(
      'celebs',
      this.id(),
      this.photoService.pics.status(),
      this.photoService.pics.error()?.message,
      this.photoService.pics.value()
    );
    if (this.photoService.pics.status() === 'resolved') {
      register();

      //  this.id() = this.ar.snapshot.paramMap.get('id') ?? '';
      setTimeout(() => {
        this.swiperEl = document.getElementById('sc') as SwiperContainer;
        this.swiperEl?.swiper.slideTo(this.id());
        this.swiperEl?.swiper.on('slideChange', () => {
          this.activeImg.set(this.swiperEl?.swiper?.activeIndex);
        });
      }, 600);

      // this.isCelebValid = this.pics
      //   .value()
      //   .data.some((d: any) => d.name.includes(this.id));
      // if (!this.isCelebValid) {
      //   this.router.navigate(['/']);
      //   return;
      // } else {
      //   let selectedCelebImages = this.pics
      //     .value()
      //     .data.find((d: any) => d.name.includes(this.id));
      //   console.log('selectedCelebImages', selectedCelebImages);
      //   this.images.set(selectedCelebImages.images);
      // }

      //this.router.navigate(['/img/' + id]);
    }

    // const swiperEl2 = document.getElementById('sc') as SwiperContainer;
  });

  // hhh=effect(()=>{
  //   this.swiperEl?.swiper.slideTo(parseInt(this.id as string));
  //   console.log('swiperEl?.swiper?', this.id, this.swiperEl?.swiper);
  //   this.closeListPopup();
  // })

  openListPopup() {
    const container = this.listVref();
    const template = this.listTempRef();
    if (container && template) {
      this.hh = container.createEmbeddedView(template, {
        imgs: this.photoService.pics.value().images,
      });
    }
  }

  closeListPopup() {
    this.hh.destroy();
  }

  updateSlide(id: number) {
    this.router.navigate(['/img/' + id], { replaceUrl: true });
    this.id.set(id);
    //   setTimeout(() => {
    // this.swiperEl?.swiper.slideTo(parseInt(this.id as string));
    //   this.swiperEl?.swiper.on('slideChange', () => {
    //     this.activeImg.set(this.swiperEl?.swiper?.activeIndex);
    //   });
    console.log('swiperEl?.swiper?', id, this.swiperEl?.swiper);
    this.closeListPopup();
    //
    //}, 1600);
  }
}
