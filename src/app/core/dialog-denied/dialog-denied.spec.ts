import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDenied } from './dialog-denied';

describe('DialogDenied', () => {
  let component: DialogDenied;
  let fixture: ComponentFixture<DialogDenied>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDenied]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDenied);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
