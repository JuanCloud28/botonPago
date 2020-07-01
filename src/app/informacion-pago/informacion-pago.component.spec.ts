import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionPagoComponent } from './informacion-pago.component';

describe('InformacionPagoComponent', () => {
  let component: InformacionPagoComponent;
  let fixture: ComponentFixture<InformacionPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
