import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelecPartidoComponent } from './selec-partido.component';
import {MatButtonModule} from '@angular/material/button';

describe('SelecPartidoComponent', () => {
  let component: SelecPartidoComponent;
  let fixture: ComponentFixture<SelecPartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecPartidoComponent, MatButtonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecPartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
