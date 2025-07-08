import {
  Component,
  inject
} from '@angular/core';
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
      <div class="grid  p-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 ">
        @for(img of imgs; track img; let i= $index) {
        <a
          class="flex relative items-center p-2 rounded-md md:p-7 md:gap-8 "
          [title]="'FashionLove ' + i"
          (click)="router.navigate(['/img/' + i])"
        >
          <span class="w-full rounded-md border-b-1 border-white-100 relative">
            <span id="aaa"></span>
            <span
              class="badge shadow-xl flex w-8 h-8 justify-center items-center absolute"
              >{{ i + 1 }}</span
            >
            <img
              class="shadow-xl rounded-md"
              [alt]="'FashionLove ' + i"
              [src]="img"
              loading="lazy"
            />
          </span>
        </a>
        }
      </div>
    </ng-template>
    @if(photoService.pics.status() === 'resolved') {
    <div #page id="page">
      <ng-container
        [ngTemplateOutlet]="list"
        [ngTemplateOutletContext]="{ imgs: photoService.pics.value().images }"
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
  `,
  styles: `
    .grid {
        background: var(--blue-lite);
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
