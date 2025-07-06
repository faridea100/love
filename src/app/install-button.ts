
import { Component, signal, computed } from '@angular/core';
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

@Component({
  selector: 'app-install-button',
  standalone: true,
  template: `
  @if(canInstall()){
    <button
      (click)="installPWA()"
      class="p-2 bg-blue-600 text-white rounded"
    >
      Install App
    </button>
  }
  `
})
export class InstallButton {
  deferredPrompt = signal<BeforeInstallPromptEvent | null>(null);

  constructor() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt.set(e as BeforeInstallPromptEvent);
    });
  }

  canInstall = computed(() => this.deferredPrompt() !== null);

  installPWA() {
    const prompt = this.deferredPrompt();
    if (prompt) {
      prompt.prompt();
      prompt.userChoice.then(() => this.deferredPrompt.set(null));
    }
  }
}