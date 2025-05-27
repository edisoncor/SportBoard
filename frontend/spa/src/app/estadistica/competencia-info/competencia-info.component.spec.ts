import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenciaInfoComponent } from './competencia-info.component';

describe('CompetenciaInfoComponent', () => {
  let component: CompetenciaInfoComponent;
  let fixture: ComponentFixture<CompetenciaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetenciaInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetenciaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
