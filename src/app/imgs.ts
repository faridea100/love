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
  position:relative;
}
#swiperTop {
    display: flex;
    position: absolute;
    top: 0;
    z-index: 344;
    width: 100%;
    justify-content: space-between;
}

#swiperBot {
  display: flex;
  justify-content:center;
  position: absolute;
    bottom: 40px;
    left: 0;
    right: 0; z-index:346
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

  `,
  template: `
  <app-header></app-header>
    @if(photoService.pics.status() === 'resolved') {
    <div id="swiperWrapper">
      <div id="swiperTop">
        <div><a (click)="router.navigate(['/'])">Back</a></div>
        <div>
          {{ activeImg() }}/{{ photoService.pics.value().images.length + 1 }}
        </div>
        <!-- <div>id</div> -->
      </div>
      <ng-container
        [ngTemplateOutlet]="list"
        [ngTemplateOutletContext]="{ imgs: photoService.pics.value().images }"
      ></ng-container>

      <div id="swiperBot">
        <div>dd</div>
      </div>
    </div>

    } @else if(photoService.pics.status() === 'loading') {
    <p>...LOADING</p>
    }

    <ng-template #list let-imgs="imgs">
      <div id="mySwiper">
        <swiper-container
          id="sc"
          height="100%"
          slides-per-view="1"
          speed="2300"
          loop="false"
          css-mode="true"
          navigation="true"
          pagination="true"
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
  `,
})
export class Imgs implements OnInit {
  router = inject(Router);
  id = inject(ActivatedRoute).snapshot.paramMap.get('id');
  host = inject(ElementRef);
  photoService = inject(Photo);
  activeImg = signal(1);
  ngOnInit(): void {}

  fff = effect(() => {
    console.log(
      'celebs',
      this.id,
      this.photoService.pics.status(),
      this.photoService.pics.error()?.message,
      this.photoService.pics.value()
    );
    if (this.photoService.pics.status() === 'resolved') {
      register();

      setTimeout(() => {
        const swiperEl = document.getElementById('sc') as SwiperContainer;
        swiperEl?.swiper.slideTo(parseInt(this.id as string));
        swiperEl?.swiper.on('slideChange', () => {
          this.activeImg.set(swiperEl?.swiper?.activeIndex);
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
    }

    // const swiperEl2 = document.getElementById('sc') as SwiperContainer;
  });
}
