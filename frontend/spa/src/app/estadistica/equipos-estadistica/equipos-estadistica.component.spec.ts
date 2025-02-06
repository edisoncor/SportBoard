import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EquiposEstadisticaComponent } from './equipos-estadistica.component';
import { EstadisticasService } from '../../services/estadisticas/estadistica.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('EquiposEstadisticaComponent', () => {
  let component: EquiposEstadisticaComponent;
  let fixture: ComponentFixture<EquiposEstadisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquiposEstadisticaComponent ],
      imports: [ 
        HttpClientTestingModule,
        MatChipsModule,
        MatTableModule,
        MatToolbarModule,
        MatProgressSpinnerModule
      ],
      providers: [ EstadisticasService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquiposEstadisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

