import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import './styles.scss';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
