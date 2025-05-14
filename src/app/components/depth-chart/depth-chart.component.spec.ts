import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepthChartComponent } from './depth-chart.component';
import { PLATFORM_ID } from '@angular/core';
import { OrderBookData, OrderBookLevel } from '../../models/orderbook';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('DepthChartComponent', () => {
  let component: DepthChartComponent;
  let fixture: ComponentFixture<DepthChartComponent>;

  const mockOrderBookData: OrderBookData = {
    timestamp: '10:00:00.000',
    bids: [
      { price: 100, size: 10 } as OrderBookLevel,
      { price: 99, size: 15 } as OrderBookLevel
    ],
    asks: [
      { price: 101, size: 5 } as OrderBookLevel,
      { price: 102, size: 8 } as OrderBookLevel
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepthChartComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DepthChartComponent);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('data', mockOrderBookData);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format axis value correctly', () => {
    expect(component.formatAxisValue(-5000)).toBe('5000');
    expect(component.formatAxisValue(1000)).toBe('1000');
  });

  it('should format tooltip labels correctly', () => {
    expect(component.formatTooltipLabel('Bids', 500)).toBe('Bids: 500');
    expect(component.formatTooltipLabel('Bids', -200)).toBe('');

    expect(component.formatTooltipLabel('Asks', -300)).toBe('Asks: 300');
    expect(component.formatTooltipLabel('Asks', 100)).toBe('');

    expect(component.formatTooltipLabel('Unknown', 100)).toBe('');
  });

  it('should transform data correctly', () => {
    const chartData = component.barChartData();
    
    expect(chartData.labels.length).toBe(4);
    expect(chartData.datasets.length).toBe(2);
    
    expect(chartData.datasets[0].label).toBe('Bids');
    expect(chartData.datasets[0].backgroundColor).toBe('rgba(0, 37, 107, 0.8)');
    
    expect(chartData.datasets[1].label).toBe('Asks');
    expect(chartData.datasets[1].backgroundColor).toBe('rgba(255, 127, 0, 0.8)');
  });
});