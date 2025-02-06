import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TablaPosicionesComponent } from './tabla-posiciones.component';
import { EstadisticasService } from '../../services/estadisticas/estadistica.service';

describe('TablaPosicionesComponent', () => {
  let component: TablaPosicionesComponent;
  let fixture: ComponentFixture<TablaPosicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaPosicionesComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [ EstadisticasService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaPosicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});