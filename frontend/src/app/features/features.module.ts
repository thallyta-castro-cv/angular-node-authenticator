import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeaturesRoutingModule } from './features-routing.module';
import { PeopleComponent } from './people/people.component';
import { ProductsComponent } from './products/products.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ProductsComponent,
    PeopleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FeaturesRoutingModule
  ],
  exports: [
    ProductsComponent,
    PeopleComponent
  ]
})
export class FeaturesModule { }
