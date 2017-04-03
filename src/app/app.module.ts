import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ButtonComponent } from './components/button/button.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MapDirective } from './directives/map/map.directive';

import { MapManagementService } from './services/map-management/map-management.service';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ButtonComponent,
    SettingsComponent,
    MapDirective
],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [MapManagementService],
  bootstrap: [AppComponent]
})
export class AppModule { }
