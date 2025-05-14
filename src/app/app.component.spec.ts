import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderbookService } from './services/orderbook.service';
import { of } from 'rxjs';

class MockOrderbookService {
  getOrderBookData() {
    return of([]);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: OrderbookService, useClass: MockOrderbookService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('order-book-visualizer');
  });

  it('should render app-orderbook-visualization', () => {
    const compiled = fixture.nativeElement;
    const element = compiled.querySelector('app-orderbook-visualization');
    expect(element).toBeTruthy();
  });
});