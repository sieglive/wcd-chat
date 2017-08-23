import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should has no elements in component's class annoucement`, async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const componentContent = fixture.componentInstance;
    expect(Object.keys(componentContent).length).toEqual(0);
  });
  it(`should have the outlet tag and this tag has no content`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const outletTag = fixture.debugElement.nativeElement.querySelector('router-outlet');
    expect(outletTag).toBeTruthy();
    expect(outletTag.innerHTML).toEqual('');
  }));
});
