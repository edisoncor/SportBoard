import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosEstadisticaComponent } from './resultados-estadistica.component';

describe('ResultadosEstadisticaComponent', () => {
  let component: ResultadosEstadisticaComponent;
  let fixture: ComponentFixture<ResultadosEstadisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosEstadisticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadosEstadisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
