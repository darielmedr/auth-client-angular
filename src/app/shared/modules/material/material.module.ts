import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const modules: any[] = [
  LayoutModule,
  MatCardModule,
  MatFormFieldModule,
  MatDividerModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatInputModule,
  MatIconModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
];

@NgModule({
  declarations: [],
  imports: [...modules],
  exports: [...modules],
})
export class MaterialModule {}
