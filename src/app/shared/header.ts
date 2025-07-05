import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  styles:
  `
  header#header{
    height: 50px;
    #settings{
      transform: translate all 0.2s;
      position:absolute;
      top:50px;left:0;right:100%;bottom:0;
      background:white;
      height:calc(100vh-50px);
    }
    #settings.showsettings {
      transform: translate all 0.4s;
      position:absolute;
      top:50px;left:0;bottom:0;
      background:white;right:0;
      }
    }
  }
  `,
  template:
  `
  <header id="header" class="flex justify-between items-center">
    <div>logo</div>
    <div><button (click)="toggleSettings()">M</button></div>
  </header>


  <div id="settings" [class.showsettings]="settingsShow()"></div>
  `
})
export class Header {
  settingsShow = signal(false)
  toggleSettings(){
    this.settingsShow.update((prev) => !prev)
  }
}
