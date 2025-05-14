import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import {
  ORDER_SUFFIX,
  OrderType,
  OrderBookData,
  OrderBookLevel,
  RawOrderBookSnapshot } from '../models/orderbook';

@Injectable({
  providedIn: 'root'
})
export class OrderbookService {

  private readonly DATA_URL = 'assets/orderbook-data.json';
  private readonly LEVELS_COUNT = 10;

  constructor(private http: HttpClient) { }

  getRawOrderBookData(): Observable<RawOrderBookSnapshot[]> {
    return this.http.get<RawOrderBookSnapshot[]>(this.DATA_URL).pipe(
      catchError(error => {
        console.warn('Error downloading data from file:', error);
        return of([]);
      })
    );
  }

  getOrderBookData(): Observable<OrderBookData[]> {
    return this.getRawOrderBookData().pipe(
      map(snapshots => this.transformData(snapshots))
    );
  }

  private transformData(rawData: RawOrderBookSnapshot[]): OrderBookData[] {
    return rawData.map(snapshot => this.processSnapshot(snapshot));
  }

  private processSnapshot(snapshot: RawOrderBookSnapshot): OrderBookData {
    const bids = this.extractLevels(snapshot, OrderType.BID);
    const asks = this.extractLevels(snapshot, OrderType.ASK);
    
    bids.sort((a, b) => b.price - a.price);
    asks.sort((a, b) => a.price - b.price);
    
    return {
      timestamp: snapshot.Time,
      bids,
      asks
    };
  }

  private extractLevels(snapshot: RawOrderBookSnapshot, orderType: OrderType): OrderBookLevel[] {
    return Array.from({ length: this.LEVELS_COUNT }, (_, i) => {
      const levelIndex = i + 1;
      
      const priceKey = `${orderType}${levelIndex}${ORDER_SUFFIX.PRICE}` as keyof RawOrderBookSnapshot;
      const sizeKey = `${orderType}${levelIndex}${ORDER_SUFFIX.SIZE}` as keyof RawOrderBookSnapshot;
      
      const price = snapshot[priceKey] as number;
      const size = snapshot[sizeKey] as number;
      
      return (price !== undefined && size !== undefined)
        ? { price, size }
        : null;
    }).filter((level): level is OrderBookLevel => level !== null);
  }
}