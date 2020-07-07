import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoPagoComponent } from './estado-pago.component';

describe('EstadoPagoComponent', () => {
  let component: EstadoPagoComponent;
  let fixture: ComponentFixture<EstadoPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
