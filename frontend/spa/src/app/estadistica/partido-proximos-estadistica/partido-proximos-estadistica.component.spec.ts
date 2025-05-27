import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidoProximosEstadisticaComponent } from './partido-proximos-estadistica.component';

describe('PartidoProximosEstadisticaComponent', () => {
  let component: PartidoProximosEstadisticaComponent;
  let fixture: ComponentFixture<PartidoProximosEstadisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartidoProximosEstadisticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartidoProximosEstadisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
