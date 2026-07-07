import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotBox } from './bot-box';

describe('BotBox', () => {
  let component: BotBox;
  let fixture: ComponentFixture<BotBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotBox],
    }).compileComponents();

    fixture = TestBed.createComponent(BotBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
