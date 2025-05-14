import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderbookVisualizationComponent } from './orderbook-visualization.component';
import { OrderbookService } from '../../services/orderbook.service';
import { Observable, of } from 'rxjs';
import { OrderBookData, OrderBookLevel } from '../../models/orderbook';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const mockOrderbookData: OrderBookData[] = [
  {
    timestamp: '10:00:00.000',
    bids: [
      { price: 100, size: 10 } as OrderBookLevel,
    ],
    asks: [
      { price: 101, size: 5 } as OrderBookLevel,
    ]
  },
  {
    timestamp: '10:01:00.000',
    bids: [
      { price: 100.5, size: 12 } as OrderBookLevel,
    ],
    asks: [
      { price: 101.5, size: 7 } as OrderBookLevel,
    ]
  }
];

class MockOrderbookService {
  getOrderBookData(): Observable<OrderBookData[]> {
    return of(mockOrderbookData);
  }
}

describe('OrderbookVisualizationComponent', () => {
  let component: OrderbookVisualizationComponent;
  let fixture: ComponentFixture<OrderbookVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderbookVisualizationComponent],
      providers: [
        { provide: OrderbookService, useClass: MockOrderbookService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderbookVisualizationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial state', () => {
    expect(component.currentIndex()).toBe(0);
  });

  it('should update current index when onIndexChange is called', () => {
    // Wywołaj metodę onIndexChange z nowym indeksem
    component.onIndexChange(1);
    
    // Sprawdź, czy indeks został zaktualizowany
    expect(component.currentIndex()).toBe(1);
  });

  it('should not update index when invalid index is provided', () => {
    // Ustaw znany indeks początkowy
    component.currentIndex.set(0);
    
    // Spróbuj ustawić nieprawidłowy indeks (ujemny)
    component.onIndexChange(-1);
    expect(component.currentIndex()).toBe(0);
    
    // Spróbuj ustawić nieprawidłowy indeks (poza zakresem)
    component.onIndexChange(999);
    expect(component.currentIndex()).toBe(0);
  });
});