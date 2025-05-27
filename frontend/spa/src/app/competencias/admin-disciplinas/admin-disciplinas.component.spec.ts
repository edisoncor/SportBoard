import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDisciplinasComponent } from './admin-disciplinas.component';

describe('AdminDisciplinasComponent', () => {
  let component: AdminDisciplinasComponent;
  let fixture: ComponentFixture<AdminDisciplinasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDisciplinasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDisciplinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
