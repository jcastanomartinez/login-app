
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { authInterceptor } from './interceptors/auth.interceptor';
import { routes } from './app.routes';

// Registrar los datos de localización española
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};