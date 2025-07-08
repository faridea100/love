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
  effect,
  signal,
  viewChild,
  ViewContainerRef,
  TemplateRef,
  EmbeddedViewRef,
  WritableSignal,
  Renderer2,
} from '@angular/core';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { Photo } from './photo';
import { Header } from './shared/header';
import { NgTemplateOutlet } from '@angular/common';
register();

@Component({
  standalone: true,
  selector: 'app-imgs',
  imports: [Header, NgTemplateOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
#swiperWrapper {
  position: relative;
    height: 100%;
    min-height: 100%;
}
#swiperTop {
      background: var(--blue-lite-2);
    display: flex;
    position: fixed;
    top: 50px;
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
    right: 0; z-index:346;
}

.swiper-button-prev svg path, .swiper-button-next svg path {
  fill:#007aff !important;
      stroke-width: 2px;
}

#mySwiper {
  position:relative;
  height: 100%;
    min-height: 100%;
    top:50px;
  swiper-container {
    height: 100%;
    min-height: 100%;
    swiper-slide {
      height: 100%;
      min-height: 100%;
      display:flex;
      flex-direction: row;
      align-items: flex-start;
          justify-content: center;
      img {
        width: 100%;
        min-width: 100%;margin: 0 auto;
      }
    }
  }
}

  #list_popup_overlay {
    position:absolute; top:50px;left:0;right:0;bottom:0;z-index: 988;
        background: rgba(0, 0, 0, 0.6);
  }
  #list_popup{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 989;
        box-shadow: 0 -2px 10px 2px var(--blue-dark);
    background: var(--blue-dark);
      #list_popup_in{
        .grid{
          background: var(--blue-dark);
        }
        height: 50vh;
        max-height: 50vh;
        overflow-y: auto;
        overflow-x: hidden;
      }
  }
  .badge {
      position: absolute;
      z-index:222;
      background: white;
      width:100%;height:100%;
      top:0;left:0;right:0;bottom:0;
    }

    .loader-wrapper {
        height: calc(100vh - 50px); 
        min-height: calc(100vh - 50px); 
    }
  `,
  template: `
    <app-header (op)="settingsVisibility($event)"></app-header>
    @if(photoService.pics.status() === 'resolved') {
    <div #page id="page">
      <div id="swiperWrapper">
        <div id="swiperTop" class="px-3 shadow-md">
          <a
            class="inline-block rounded-sm btn-secondary"
            (click)="router.navigate(['/home'])"
          >
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

          <div>
            <button class=" btn-primary" (click)="openListPopup()">OPEN</button>
          </div>
          <div class="bg-white inline-block rounded-sm px-2">
            {{ activeImg() }}/{{ photoService.pics.value().images.length + 1 }}
          </div>
          <!-- <div>id</div> -->
        </div>
        <ng-container
          [ngTemplateOutlet]="sld"
          [ngTemplateOutletContext]="{ imgs: photoService.pics.value().images }"
        ></ng-container>
      </div>
      <ng-container #list_vref></ng-container>
    </div>
    } @else if(photoService.pics.error()) {
    <div class="loader-wrapper flex justify-center items-center w-full ">
      <div>
        <h5>{{ photoService.pics.error()?.message }}</h5>
        <button
          class="btn btn-primary"
          (click)="this.photoService.pics.reload()"
        >
          <span class="flex justify-between items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 4v6h6M20 20v-6h-6M20 4a9 9 0 00-15.5 6.5M4 20a9 9 0 0015.5-6.5"
              />
            </svg>
            <p>Reload</p>
          </span>
        </button>
      </div>
    </div>
    } @else if(photoService.pics.status() === 'loading') {
    <div class="loader-wrapper flex justify-center items-center w-full ">
      <div class="loader">
        <div class="swiper-lazy-preloader" part="preloader"></div>
      </div>
    </div>
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
          @for(img of imgs; track img; let i = $index) {
          <swiper-slide lazy="true">
            <div class="relative">
              <!-- <div class="badge"></div> -->
              <img [src]="img" [alt]="'FashionLove ' + i" loading="lazy" />
            </div>
          </swiper-slide>
          }
        </swiper-container>
      </div>
    </ng-template>

    <ng-template #list let-imgs="imgs">
      <div id="list_popup_overlay" (click)="closeListPopup()"></div>
      <div id="list_popup" class="flex flex-col items-end justify-center">
        <a class="inline-block btn-secondary m-3" (click)="closeListPopup()"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </a>
        <div id="list_popup_in">
          <div class="grid  px-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 ">
            @for(img of imgs; track img; let i= $index) {
            <div
              class="flex items-center p-2 md:p-7 md:gap-8 rounded-2xl"
              [title]="'FashionLove ' + i"
              (click)="updateSlide(i)"
            >
              <div>
                <img
                  class="shadow-xl rounded-md"
                  [alt]="'FashionLove ' + i"
                  [src]="img"
                />
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
  r2 = inject(Renderer2);
  html = document.getElementsByTagName('html') as any;
  fff = effect(() => {
    // console.log(
    //   'celebs',
    //   this.id(),
    //   this.photoService.pics.status(),
    //   this.photoService.pics.error()?.message,
    //   this.photoService.pics.value()
    // );
    this.id();
    if (this.photoService.pics.status() === 'resolved') {
      register();

      setTimeout(() => {
        this.swiperEl = document.getElementById('sc') as SwiperContainer;
        this.swiperEl?.swiper.slideTo(this.id());
        this.swiperEl?.swiper.on('slideChange', () => {
          this.activeImg.set(this.swiperEl?.swiper?.activeIndex);
          this.html[0].scrollTop = 0;
        });
        console.log('new slide no.', this.id());
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
    }
  });
  openListPopup() {
    this.settingsVisibility(true);
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
    this.settingsVisibility(false);
  }

  settingsVisibility(toggle: boolean) {
    if (this.hh) this.closeListPopup();
    if (toggle) {
      this.photoService.prevScrollTop.set(this.html[0].scrollTop);
      this.html[0].scrollTop = 0;
      this.r2.setStyle(this.html[0], 'overflow-y', 'hidden');
    } else if (!toggle) {
      this.html[0].scrollTop = this.photoService.prevScrollTop();
      this.r2.setStyle(this.html[0], 'overflow-y', 'auto');
    }
  }
}
