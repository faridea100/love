import { Component, inject, OnInit, output, Renderer2, signal } from '@angular/core';
import { InstallButton } from '../install-button';
import { Router } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { Photo } from '../photo';

@Component({
  selector: 'app-header',
  imports: [InstallButton, NgTemplateOutlet],
  styles: `
  header#header{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 898;
    height: 50px;}
  .disclaimer {
    overflow-y:auto;
    overflow-x:hidden;
    height:33vh;
  p {
    font-size: 11px;
  }
}
  #settings{
      color:var(--blue-lite);
      transition:transform 0.6s ease;
      position:absolute;
      top:50px;right:100%;bottom:0;
      background:var(--blue-dark);
      z-index:903;
      width:100%;
      height:calc(100vh - 50px);
      &.showsettings {
        transition:transform 0.6s ease;
        right: 0 !important;
      }
    }
  `,
  template: `
    <header
      id="header"
      class="flex px-3 justify-between items-center border-b-2 border-white-300"
    >
      <div>
        <a (click)="settingsVisibility()">
          <span class="flex justify-start"
            ><img [src]="'/logo0.svg'" [width]="'120'" />
            <img [src]="'/logo.svg'" [width]="'60'"
            />
            <img [src]="'/logo-lily.png'" [width]="'53'" /></span
        ></a>
      </div>
      <div>
        <app-install-button />
        <button (click)="toggleSettings()">
          @if(!settingsShow()){
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-6 h-6"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          } @else {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="white"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          }
        </button>
      </div>
    </header>

    <div id="settings" class="px-3" [class.showsettings]="settingsShow()">
      <ng-container
        [ngTemplateOutlet]="settingsShow() ? settingsTempRef : null"
      ></ng-container>
    </div>

    <ng-template #settingsTempRef>
      <div class="mb-5">
        <div
          class="facebook-card w-full"
        >
          <img class="w-full" [src]="photoService.pics.value().profile" />
        </div>
      </div>
      <div class="mb-5">
        <div class="grid  grid-cols-2">
          <div class="flex p-2">
            <a
              class="btn p-2 flex btn-outline btn-wa gap-2"
              href="https://wa.me/?text=FashionLove%20https://subtle-klepon-8e5160.netlify.app/home"
              target="_blank"
              rel="noopener"
              ><img
                class=""
                [alt]="'WhatsApp'"
                [title]="'WhatsApp'"
                [height]="'20px'"
                src="/wa.svg"
            /></a>
          </div>
          <div class="flex p-2">
            <a
              class="btn  flex btn-outline btn-fb gap-2"
              href="https://www.facebook.com/sharer/sharer.php?u=https://subtle-klepon-8e5160.netlify.app/home"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                class=""
                [alt]="'Facebook'"
                [title]="'Facebook'"
                [height]="'20px'"
                src="/fb.svg"
              />
            </a>
          </div>
        </div>
      </div>
      <div class="disclaimer mb-5">
        <div class="mb-3">
          <p>
            This is a "Fashion" app. All the images are only related to
            "Fashion".
          </p>
          <p>
            This app displays images sourced from third-party platforms
            including Unsplash, Pexels, and Pixabay. All images are subject to
            the respective licensing terms of these platforms.
          </p>
          <ul>
            <li><p>Unsplash License</p></li>
            <li><p>Pexels License</p></li>
            <li><p>Pixabay License</p></li>
          </ul>
          <p>
            We do not claim ownership of any images unless explicitly stated.
          </p>
        </div>
        <div class="mb-3">
          <p>
            We are not affiliated with Unsplash, Pexels, or Pixabay. All content
            shown is for display and browsing purposes only and remains the
            property of the respective creators.
          </p>
        </div>
        <div class="mb-3">
          <p>
            Please review the licensing terms before using any image outside the
            app.
          </p>
          <div class="mb-3">
            <p>
              We do not earn any revenue from the app — there are no ads, paid
              features, or monetization mechanisms of any kind.
            </p>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class Header {
  op = output<boolean>();
  settingsShow = signal(false);
  router = inject(Router);
  photoService = inject(Photo);
  r2=inject(Renderer2)

  toggleSettings() {
    this.settingsShow.update((prev) => !prev);
    this.op.emit(this.settingsShow());
  }

   settingsVisibility() {
    this.router.navigate(['/home'])
    let bd = document.getElementsByTagName('html') as any;
    bd[0].scrollTop = 0;
    this.r2.setStyle(bd[0], 'overflow-y', 'auto');
  }
}
