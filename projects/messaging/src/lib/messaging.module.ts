import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatBoxComponent} from "./chat-box/chat-box.component";
import {MessagingService} from "./chat-box/messaging.service";
import {BrowserModule} from '@angular/platform-browser';
import {MaterialImportsModule} from "./material-imports/material-imports.module";
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [ChatBoxComponent],
  imports: [
    CommonModule,
    BrowserModule,
    MaterialImportsModule,
    FormsModule
  ],
  exports: [ChatBoxComponent],
  providers: []
})
export class MessagingModule {
  static forRoot(config: any): ModuleWithProviders {
    return {
      ngModule: MessagingModule,
      providers: [MessagingService, {provide: 'config', useValue: config}]
    };
  }
}
