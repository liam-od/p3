import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { LayoutComponent } from './layout.component';
import { DetailsComponent } from './details.component';
import { UpdateComponent } from './update.component';
import { StrengthMeterModule } from 'ngx-strength-meter';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    StrengthMeterModule
  ],
  declarations: [LayoutComponent, DetailsComponent, UpdateComponent]
})
export class ProfileModule {}
