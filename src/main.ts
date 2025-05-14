import './app/chart-setup';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerChart } from './app/chart-setup';

registerChart();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
