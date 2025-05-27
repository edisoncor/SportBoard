import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEdicionCompetenciaComponent } from './admin-edicion-competencia.component';

describe('AdminEdicionCompetenciaComponent', () => {
  let component: AdminEdicionCompetenciaComponent;
  let fixture: ComponentFixture<AdminEdicionCompetenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEdicionCompetenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEdicionCompetenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
