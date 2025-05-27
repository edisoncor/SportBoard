import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchtableComponent } from './matchtable.component';

describe('MatchtableComponent', () => {
  let component: MatchtableComponent;
  let fixture: ComponentFixture<MatchtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchtableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
