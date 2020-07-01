import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionVolantesComponent } from './informacion-volantes.component';

describe('InformacionVolantesComponent', () => {
  let component: InformacionVolantesComponent;
  let fixture: ComponentFixture<InformacionVolantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionVolantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionVolantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
