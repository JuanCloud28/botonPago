import { TestBed } from '@angular/core/testing';

import { VolanteDepagoService } from './volante-depago.service';

describe('VolanteDepagoService', () => {
  let service: VolanteDepagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolanteDepagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
