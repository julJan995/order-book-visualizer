import { Component, computed, input, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { OrderBookData } from '../../models/orderbook';

@Component({
  selector: 'app-depth-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './depth-chart.component.html',
  styleUrls: ['./depth-chart.component.scss']
})
export class DepthChartComponent {
  data = input<OrderBookData | null>(null);

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  formatAxisValue(value: number | string): string {
    return Math.abs(Number(value)).toString();
  }

  formatTooltipLabel(datasetLabel: string, value: number): string {
    if (datasetLabel === 'Bids') {
      return value > 0 ? `${datasetLabel}: ${value}` : '';
    }

    if (datasetLabel === 'Asks') {
      return value < 0 ? `${datasetLabel}: ${Math.abs(value)}` : '';
    }

    return '';
  }

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        stacked: true,
        title: {
          display: true,
          text: 'Size'
        },
        min: -15000,
        max: 15000,
        ticks: {
          stepSize: 5000,
          callback: (value) => this.formatAxisValue(value),
          precision: 0,
          autoSkip: false
        }
      },
      y: {
        type: 'category',
        stacked: false,
        reverse: false,
        title: {
          display: true,
          text: 'Price'
        }
      }
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
    },
    animation: {
      duration: 0
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (tooltipItem) => {
            const datasetLabel = tooltipItem.dataset.label || '';
            const value = tooltipItem.parsed.x;
            return this.formatTooltipLabel(datasetLabel, value);
          }
        }
      },
      title: {
        display: true,
        text: 'Order Book Depth Chart'
      },
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  private transformOrderBookData(bookData: OrderBookData) {
    const bids = [...bookData.bids].sort((a, b) => b.price - a.price);
    const asks = [...bookData.asks].sort((a, b) => a.price - b.price);

    const bidPrices = bids.map(bid => bid.price.toFixed(4));
    const bidSizes = bids.map(bid => bid.size);
    const askPrices = asks.map(ask => ask.price.toFixed(4));
    const askSizes = asks.map(ask => -ask.size);

    return {
      prices: { bidPrices, askPrices },
      sizes: { bidSizes, askSizes }
    };
  }

  barChartData = computed(() => {
    if (!this.isBrowser || !this.data()) {
      return {
        labels: [],
        datasets: []
      };
    }

    const bookData = this.data()!;
    const { prices, sizes } = this.transformOrderBookData(bookData);
    const { bidPrices, askPrices } = prices;
    const { bidSizes, askSizes } = sizes;

    return {
      labels: [...bidPrices, ...askPrices],
      datasets: [
        {
          data: [...bidSizes, ...Array(askPrices.length).fill(0)],
          label: 'Bids',
          backgroundColor: 'rgba(0, 37, 107, 0.8)',
          borderColor: 'rgba(0, 37, 107, 1)',
          hoverBackgroundColor: 'rgba(0, 37, 107, 1)',
          borderWidth: 1
        },
        {
          data: [...Array(bidPrices.length).fill(0), ...askSizes],
          label: 'Asks',
          backgroundColor: 'rgba(255, 127, 0, 0.8)',
          borderColor: 'rgba(255, 127, 0, 1)',
          hoverBackgroundColor: 'rgba(255, 127, 0, 1)',
          borderWidth: 1
        }
      ]
    };
  });
}