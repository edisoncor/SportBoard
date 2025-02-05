import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardMenuComponent } from './card-menu.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('CardMenuComponent', () => {
  let component: CardMenuComponent;
  let fixture: ComponentFixture<CardMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardMenuComponent],
      imports: [MatCardModule, MatIconModule] // Importar MatCard y MatIcon para evitar errores
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
