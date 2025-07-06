import { Component, inject, signal } from '@angular/core';
import { InstallButton } from '../install-button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [InstallButton],
  styles: `
  header#header{height: 50px;}
  #settings{
      transition:transform 0.6s ease;
      position:absolute;
      top:50px;right:100%;bottom:0;
      background:white;
      z-index:903;
      width:100vw;
      height:calc(100vh - 50px);
      &.showsettings {
        transition:transform 0.6s ease;
        right: 0 !important;
      }
    }
  `,
  template: `
    <header id="header" class="flex px-3 justify-between items-center border-b-2 border-amber-100">
      <div>
        <a (click)="router.navigate(['/home'])"><img [src]="'/logo.svg'" [width]="'60'" /></a>
      </div>
      <div>
        <app-install-button />
        <button (click)="toggleSettings()">
          <svg xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-6 h-6">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>

    <div id="settings" [class.showsettings]="settingsShow()"></div>
  `,
})
export class Header {
  settingsShow = signal(false);
  router=inject(Router)
  toggleSettings() {
    this.settingsShow.update((prev) => !prev);
  }
}
