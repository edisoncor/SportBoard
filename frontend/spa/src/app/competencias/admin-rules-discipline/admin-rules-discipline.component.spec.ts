import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRulesDisciplineComponent } from './admin-rules-discipline.component';

describe('AdminRulesDisciplineComponent', () => {
  let component: AdminRulesDisciplineComponent;
  let fixture: ComponentFixture<AdminRulesDisciplineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRulesDisciplineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRulesDisciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
