import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSquadComponent } from './admin-squad.component';

describe('AdminSquadComponent', () => {
  let component: AdminSquadComponent;
  let fixture: ComponentFixture<AdminSquadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSquadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSquadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
