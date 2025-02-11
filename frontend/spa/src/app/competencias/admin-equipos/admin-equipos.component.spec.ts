import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEquiposComponent } from './admin-equipos.component';

describe('AdminEquiposComponent', () => {
  let component: AdminEquiposComponent;
  let fixture: ComponentFixture<AdminEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEquiposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
