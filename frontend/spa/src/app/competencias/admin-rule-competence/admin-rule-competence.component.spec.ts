import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRuleCompetenceComponent } from './admin-rule-competence.component';

describe('AdminRuleCompetenceComponent', () => {
  let component: AdminRuleCompetenceComponent;
  let fixture: ComponentFixture<AdminRuleCompetenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRuleCompetenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRuleCompetenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
