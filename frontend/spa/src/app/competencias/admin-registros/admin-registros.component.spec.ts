import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegistrosComponent } from './admin-registros.component';

describe('AdminRegistrosComponent', () => {
  let component: AdminRegistrosComponent;
  let fixture: ComponentFixture<AdminRegistrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRegistrosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRegistrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
