import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactions } from './interactions';

describe('Interactions', () => {
  let component: Interactions;
  let fixture: ComponentFixture<Interactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Interactions],
    }).compileComponents();

    fixture = TestBed.createComponent(Interactions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
