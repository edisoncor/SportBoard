import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbCompetenciasComponent } from './breadcrumb-competencias.component';

describe('BreadcrumbCompetenciasComponent', () => {
  let component: BreadcrumbCompetenciasComponent;
  let fixture: ComponentFixture<BreadcrumbCompetenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbCompetenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumbCompetenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
