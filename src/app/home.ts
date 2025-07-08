import { Component, computed, effect, inject, signal } from '@angular/core';
import { Photo } from './photo';
import { Header } from './shared/header';
import { Router } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { Renderer2 } from '@angular/core';
@Component({
  standalone: true,
  selector: 'app-home',
  imports: [Header, NgTemplateOutlet],
  template: `
    <app-header (op)="settingsVisibility($event)"></app-header>
    <ng-template #list let-imgs="imgs">
      <div class="imgList grid  p-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 ">
        @for(img of imgs; track img; let i= $index) {
        <div
          class="flex relative items-center p-2 rounded-md md:p-7 md:gap-8 "
          [title]="'FashionLove ' + i"
        >
          <span class="w-full rounded-md border-b-1 border-white-100 relative">
            <span
              class="badge shadow-xl flex w-8 h-8 justify-center items-center absolute"
              >{{ i + 1 }}</span
            >
            <a (click)="router.navigate(['/img/' + i])">
              <img
                class="shadow-xl rounded-md"
                [alt]="'FashionLove ' + i"
                [src]="img"
                loading="lazy"
              />
            </a>
            <button
              class="btn-download btn-secondary"
              (click)="this.photoService.selectedPic.set({img,name:i})"
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
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 4 16.3" />
              </svg>
            </button>
          </span>
        </div>
        }
      </div>
    </ng-template>
    @if(photoService.pics.status() === 'resolved') {
    <div #page id="page">
      <ng-container
        [ngTemplateOutlet]="list"
        [ngTemplateOutletContext]="{ imgs: photoService.pics.value().images }"
      ></ng-container>

      <ng-container
        [ngTemplateOutlet]="isDownloading() ? download : null"
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
  styles: `
    .imgList.grid {
      color: var(--blue);
      background: var(--blue-lite);
  img {
    &:after {
      border-color: var(--blue-dark);
    }
  }
}
    .badge {
      color: var(--blue-dark);
      background: var(--blue-lite);
      top:-10px;left:-10px;
      border-radius:100px;
    }
  `,
})
export class Home {
  router = inject(Router);
  photoService = inject(Photo);
  r2 = inject(Renderer2);
  selectedPic = computed(() => this.photoService.selectedPic());
  pic = computed(() => this.photoService.pic);
  imgLoaded = signal<number>(0);
  isDownloading = signal<boolean>(false);

  constructor() {
    this.photoService.selectedPic.set({ img: '', name: 0 });
  }

  ttt = effect(() => {
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
      } else if (this.pic().status() === 'error') {
        this.isDownloading.set(false);
      } else if (this.pic().status() === 'loading') {
        this.isDownloading.set(true);
      }
    }
  });
  settingsVisibility(toggle: boolean) {
    let bd = document.getElementsByTagName('html') as any;
    if (toggle) {
      this.photoService.prevScrollTop.set(bd[0].scrollTop);
      bd[0].scrollTop = 0;
      this.r2.setStyle(bd[0], 'overflow-y', 'hidden');
    } else if (!toggle) {
      bd[0].scrollTop = this.photoService.prevScrollTop();
      this.r2.setStyle(bd[0], 'overflow-y', 'auto');
    }
  }
}
