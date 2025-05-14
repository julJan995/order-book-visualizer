import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderbookService } from './orderbook.service';
import { RawOrderBookSnapshot, OrderBookData } from '../models/orderbook';

describe('OrderbookService', () => {
  let service: OrderbookService;
  let httpMock: HttpTestingController;

  const mockRawData: RawOrderBookSnapshot[] = [
    {
      Time: '09:00:31.529389',
      Bid1: 4.768, Bid1Size: 1175,
      Bid2: 4.7675, Bid2Size: 3729,
      Ask1: 4.77, Ask1Size: 3611,
      Ask2: 4.7705, Ask2Size: 49614
    }
  ];

  const expectedTransformedData: OrderBookData[] = [
    {
      timestamp: '09:00:31.529389',
      bids: [
        { price: 4.768, size: 1175 },
        { price: 4.7675, size: 3729 }
      ].sort((a, b) => b.price - a.price),
      asks: [
        { price: 4.77, size: 3611 },
        { price: 4.7705, size: 49614 }
      ].sort((a, b) => a.price - b.price)
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderbookService]
    });

    service = TestBed.inject(OrderbookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get raw orderbook data from HTTP', () => {
    service.getRawOrderBookData().subscribe(data => {
      expect(data).toEqual(mockRawData);
    });

    const req = httpMock.expectOne('assets/orderbook-data.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockRawData);
  });

  it('should handle error when getting raw data', () => {
    service.getRawOrderBookData().subscribe(data => {
      expect(data).toEqual([]);
    });

    const req = httpMock.expectOne('assets/orderbook-data.json');
    req.error(new ErrorEvent('Network error'));
  });

  it('should transform raw data to OrderBookData format', () => {
    service.getOrderBookData().subscribe(data => {
      expect(data[0].timestamp).toEqual(expectedTransformedData[0].timestamp);
      expect(data[0].bids.length).toEqual(expectedTransformedData[0].bids.length);
      expect(data[0].bids[0].price).toEqual(expectedTransformedData[0].bids[0].price);
      expect(data[0].asks.length).toEqual(expectedTransformedData[0].asks.length);
      expect(data[0].asks[0].price).toEqual(expectedTransformedData[0].asks[0].price);
    });

    const req = httpMock.expectOne('assets/orderbook-data.json');
    req.flush(mockRawData);
  });

  it('should sort bids in descending order and asks in ascending order', () => {
    service.getOrderBookData().subscribe(data => {
      expect(data[0].bids[0].price).toBeGreaterThanOrEqual(data[0].bids[1].price);
      expect(data[0].asks[0].price).toBeLessThanOrEqual(data[0].asks[1].price);
    });

    const req = httpMock.expectOne('assets/orderbook-data.json');
    req.flush(mockRawData);
  });
});