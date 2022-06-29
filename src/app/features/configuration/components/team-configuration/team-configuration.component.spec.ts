import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamConfigurationComponent } from './team-configuration.component';

describe('TeamConfigurationComponent', () => {
  let component: TeamConfigurationComponent;
  let fixture: ComponentFixture<TeamConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
