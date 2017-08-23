import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerDirective, ContentDirective } from './layout.component';

describe('LayoutComponent', () => {
  let component1: ContainerDirective;
  let component2: ContentDirective;
  let fixture1: ComponentFixture<ContainerDirective>;
  let fixture2: ComponentFixture<ContentDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContainerDirective, ContentDirective]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture1 = TestBed.createComponent(ContainerDirective);
    fixture2 = TestBed.createComponent(ContentDirective);
    component1 = fixture1.componentInstance;
    component2 = fixture2.componentInstance;
    fixture1.detectChanges();
    fixture2.detectChanges();
  });

  it('two of the layout directive should be created', () => {
    expect(component1).toBeTruthy();
    expect(component2).toBeTruthy();
  });
});
