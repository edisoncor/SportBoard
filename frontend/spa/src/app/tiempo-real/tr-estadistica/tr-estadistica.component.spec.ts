import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrEstadisticaComponent } from './tr-estadistica.component';

describe('TrEstadisticaComponent', () => {
  let component: TrEstadisticaComponent;
  let fixture: ComponentFixture<TrEstadisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrEstadisticaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrEstadisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
