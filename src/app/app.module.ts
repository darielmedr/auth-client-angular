import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { authInterceptorProviders } from './core/interceptors/auth.interceptor';
import { xsrfInterceptorProviders } from './core/interceptors/xsrf.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    HttpClientXsrfModule
  ],
  providers: [
    xsrfInterceptorProviders,
    authInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
