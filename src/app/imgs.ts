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
  computed,
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
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    z-index: 17774;
    width: 100%;
    height: 50px;
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


  #list_popup{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 989;
        box-shadow: 0 -2px 10px 2px var(--blue-dark);
    background: var(--blue-dark);
      #list_popup_in{
        .imgList.grid {
          color: var(--blue-lite);
          background: var(--blue-dark);
          img {
            &:after {
              border-color: var(--blue-lite);
            }
          }
            

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
  <div style="position:absolute; left:-1000px;">
    <img src="/fashionlove.jpg" />
    <h1>FashionLove</h1>
    <p>App about Fashion and style. Check out now <a href="https://subtle-klepon-8e5160.netlify.app/home">https://subtle-klepon-8e5160.netlify.app/home</a></p>
  </div>
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
      <ng-container
        [ngTemplateOutlet]="isDownloading() ? download : null"
        [ngTemplateOutletContext]="{ prg: imgLoaded() }"
      ></ng-container>
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
              <img [src]="img" [alt]="'FashionLove ' + (i+1)" loading="lazy" />
              <div id="swiperBot" class="flex justify-content items-center">
                <div class="flex">
                  <a
                    class="btn p-2 flex btn-outline  gap-2"
                    [href]="
                      'https://wa.me/?text=FashionLove%20https://subtle-klepon-8e5160.netlify.app/imgs/' +
                      i
                    "
                    target="_blank"
                    rel="noopener"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="32"
                      height="32"
                      fill="#25D366"
                    >
                      <path
                        d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 0 5.37 0 12a11.9 11.9 0 001.61 6l-1.6 6 6-1.6A11.9 11.9 0 0012 24c6.63 0 12-5.37 12-12a11.86 11.86 0 00-3.48-8.52zM12 22a9.87 9.87 0 01-5.1-1.4l-.36-.21-3.57 1.01 1.02-3.49-.23-.37A9.88 9.88 0 1122 12c0 5.51-4.49 10-10 10zm5.46-7.28l-1.78-.52a1.16 1.16 0 00-1.11.3l-.57.58a8.25 8.25 0 01-4.28-4.27l.58-.57a1.17 1.17 0 00.3-1.11l-.52-1.78A1.17 1.17 0 008.44 7H7.11A1.11 1.11 0 006 8.11c0 5.51 4.49 10 10 10a1.11 1.11 0 001.11-1.11v-1.33a1.17 1.17 0 00-.65-1.05z"
                      />
                    </svg>
                  </a>
                  <a
                    class="btn p-2 flex btn-outline  gap-2"
                    [href]="
                      'https://www.facebook.com/sharer/sharer.php?u=https://subtle-klepon-8e5160.netlify.app/imgs/' +
                      i
                    "
                    target="_blank"
                    rel="noopener"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="32"
                      height="32"
                      fill="#1877F2"
                    >
                      <path
                        d="M22.675 0h-21.35C.596 0 0 .597 0 1.333v21.333C0 23.403.596 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.404 24 24 23.403 24 22.667V1.333C24 .597 23.404 0 22.675 0z"
                      />
                    </svg>
                  </a>
                </div>
                <button
                  class="btn-download btn-secondary"
                  (click)="this.photoService.selectedPic.set({img,name:(i+1)})"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 16l-4 4-4-4" />
                    <path d="M12 12v8" />
                    <path
                      d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.3"
                    />
                  </svg>
                </button>
              </div>
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
          <div
            class="imgList grid  px-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 "
          >
            @for(img of imgs; track img; let i= $index) {
            <div
              class="flex items-center p-2 md:p-7 md:gap-8 rounded-2xl"
              [title]="'FashionLove ' + (i+1)"
              (click)="updateSlide(i)"
            >
              <div>
                <img
                  class="shadow-xl rounded-md"
                  [alt]="'FashionLove ' + (i+1)"
                  [src]="img"
                />
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </ng-template>

    <ng-template #download>
      <div class="progress-wrapper flex justify-center items-center">
        <div id="progress" class="flex gap-2 justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M16 16l-4 4-4-4" />
            <path d="M12 12v8" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.3" />
          </svg>
          <p>Downloading...</p>
        </div>
        <div id="list_popup_overlay"></div>
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
  pic = computed(() => this.photoService.pic);
  imgLoaded = signal<number>(0);
  isDownloading = signal<boolean>(false);

  selectedPic = computed(() => this.photoService.selectedPic());

  constructor() {
    this.photoService.selectedPic.set({ img: '', name: 0 });
  }

  fff = effect(() => {
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

    if (this.selectedPic().img) {
      console.log('this.pic()', this.pic());
      if (this.pic().value() && this.pic().status() !== 'error') {
        this.isDownloading.set(true);
        console.log('pic', this.pic().value());
        const a = document.createElement('a');
        a.href = URL.createObjectURL(this.pic().value());
        a.download = `Fashion-${this.selectedPic().name.toString()}`;
        a.click();
        URL.revokeObjectURL(a.href);
        setTimeout(() => {
          this.isDownloading.set(false);
        }, 1400);
        this.photoService.selectedPic.set({ img: '', name: 0 });
      } else if (this.pic().status() === 'error') {
        this.isDownloading.set(false);
      } else if (this.pic().status() === 'loading') {
        this.isDownloading.set(true);
      }

    }

    let ll = this.pic()?.progress()?.loaded as number;
    let tt = this.pic()?.progress()?.total as number;
    this.imgLoaded.update(() => (ll / tt) * 100);
    console.log('this.imgLoaded', ll, tt);
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
      this.html[0].scrollTop = 0;
      this.r2.setStyle(this.html[0], 'overflow-y', 'hidden');
    } else if (!toggle) {
      this.r2.setStyle(this.html[0], 'overflow-y', 'auto');
    }
  }
}
