import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EncabezadoCompetenciaComponent } from './encabezado-competencia.component';
import { EstadisticasService } from '../../services/estadisticas/estadistica.service';

describe('EncabezadoCompetenciaComponent', () => {
  let component: EncabezadoCompetenciaComponent;
  let fixture: ComponentFixture<EncabezadoCompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncabezadoCompetenciaComponent ],
      imports: [ 
        HttpClientTestingModule,
        MatProgressSpinnerModule
      ],
      providers: [ EstadisticasService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncabezadoCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

