import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsEstadisticasComponent } from './tabs-estadisticas.component';

describe('TabsEstadisticasComponent', () => {
  let component: TabsEstadisticasComponent;
  let fixture: ComponentFixture<TabsEstadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsEstadisticasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsEstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
