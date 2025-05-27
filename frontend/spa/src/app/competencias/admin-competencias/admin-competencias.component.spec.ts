import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompetenciasComponent } from './admin-competencias.component';

describe('AdminCompetenciasComponent', () => {
  let component: AdminCompetenciasComponent;
  let fixture: ComponentFixture<AdminCompetenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCompetenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCompetenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
