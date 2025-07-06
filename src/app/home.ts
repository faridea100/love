import { Component, inject } from '@angular/core';
import { Photo } from './photo';
import { Header } from './shared/header';
import { Router } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-home',
  imports: [Header, NgTemplateOutlet],
  template: `
    <app-header></app-header>
    <ng-template #list let-imgs="imgs">
        <div class="grid  p-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 ">
          @for(img of imgs; track img; let i= $index) {
          <div
            class="flex relative items-center p-2 md:p-7 md:gap-8 rounded-2xl"
            (click)="router.navigate(['/img/' + i])"
          >
            <div class="img-wrapper relative">
              <div class="badge bg-cyan-100 flex w-8 h-8 justify-center items-center absolute">{{i+1}}</div>
              <img class="shadow-xl rounded-md" [alt]="img" [src]="img" loading="lazy" />
            </div>
          </div>
          }
        </div>
      </ng-template>
    @if(photoService.pics.status() === 'resolved') {
      <ng-container [ngTemplateOutlet]="list" [ngTemplateOutletContext]="{'imgs':photoService.pics.value().images}"></ng-container>
    }
  `,
  styles: `
    .badge {
      top:-10px;left:-10px;
      border-radius:100px;
    }
  `,
})
export class Home {
  router = inject(Router);
  photoService = inject(Photo);
}
