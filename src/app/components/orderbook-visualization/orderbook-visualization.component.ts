import { Component, signal, computed, inject } from '@angular/core';
import { OrderbookService } from '../../services/orderbook.service';
import { TimeControlsComponent } from '../time-controls/time-controls.component';
import { DepthChartComponent } from '../depth-chart/depth-chart.component';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderBookData } from '../../models/orderbook';

@Component({
  selector: 'app-orderbook-visualization',
  standalone: true,
  imports: [CommonModule, TimeControlsComponent, DepthChartComponent],
  templateUrl: './orderbook-visualization.component.html',
  styleUrls: ['./orderbook-visualization.component.scss']
})
export class OrderbookVisualizationComponent {
  private readonly orderbookService = inject(OrderbookService);

  protected readonly orderbookData = toSignal(
    this.orderbookService.getOrderBookData(), 
    { initialValue: [] }
  );

  readonly currentIndex = signal(0);

  protected readonly timestamps = computed(() => 
    this.data.map(item => item.timestamp)
  );

  protected readonly currentSnapshot = computed(() => {
    const index = this.currentIndex();
    return this.data.length && index >= 0 && index < this.data.length 
      ? this.data[index] 
      : null;
  });

  public onIndexChange(index: number): void {
    if (index >= 0 && index < this.data.length) {
      this.currentIndex.set(index);
    }
  }

  protected get data(): OrderBookData[] {
    return this.orderbookData() ?? [];
  }
}