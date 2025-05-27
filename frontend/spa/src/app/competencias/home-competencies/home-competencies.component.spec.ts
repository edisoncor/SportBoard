import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCompetenciesComponent } from './home-competencies.component';

describe('HomeCompetenciesComponent', () => {
  let component: HomeCompetenciesComponent;
  let fixture: ComponentFixture<HomeCompetenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCompetenciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCompetenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
