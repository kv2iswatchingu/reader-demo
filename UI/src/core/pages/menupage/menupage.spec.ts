import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menupage } from './menupage';

describe('Menupage', () => {
  let component: Menupage;
  let fixture: ComponentFixture<Menupage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menupage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Menupage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
