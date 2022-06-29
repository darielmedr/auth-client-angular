import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material/material.module';

const components: any[] = [
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    ...components
  ]
})
export class SharedModule { }
