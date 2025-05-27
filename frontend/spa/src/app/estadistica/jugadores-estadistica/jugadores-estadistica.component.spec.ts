import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JugadoresEstadisticaComponent } from './jugadores-estadistica.component';
import { EstadisticasService } from '../../services/estadisticas/estadistica.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('JugadoresEstadisticaComponent', () => {
  let component: JugadoresEstadisticaComponent;
  let fixture: ComponentFixture<JugadoresEstadisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JugadoresEstadisticaComponent ],
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

    fixture = TestBed.createComponent(JugadoresEstadisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});