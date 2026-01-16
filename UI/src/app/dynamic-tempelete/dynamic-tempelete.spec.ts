import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTempelete } from './dynamic-tempelete';

describe('DynamicTempelete', () => {
  let component: DynamicTempelete;
  let fixture: ComponentFixture<DynamicTempelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTempelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicTempelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
