import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenciaEstadisticaComponent } from './competencia-estadistica.component';

describe('CompetenciaEstadisticaComponent', () => {
  let component: CompetenciaEstadisticaComponent;
  let fixture: ComponentFixture<CompetenciaEstadisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetenciaEstadisticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetenciaEstadisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
