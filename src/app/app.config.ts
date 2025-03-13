import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, HttpInterceptorFn, provideHttpClient, withInterceptors,withFetch } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';

export const TokenIterceptor: HttpInterceptorFn = (req, next) => { 
  let headers: { [header: string]: string } = {}; 
    const token = localStorage.getItem('authToken');
  
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
 
    req = req.clone({ headers:req.headers.set("orgId","intern_test") });
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes) ,provideClientHydration(withEventReplay()),
      provideAnimationsAsync(), provideAnimationsAsync(),
      provideHttpClient(withFetch(),withInterceptors([TokenIterceptor])),
    ]
};

