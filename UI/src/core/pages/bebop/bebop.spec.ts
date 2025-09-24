import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bebop } from './bebop';

describe('Bebop', () => {
  let component: Bebop;
  let fixture: ComponentFixture<Bebop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bebop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bebop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
