import { Component } from '@angular/core';
import { OrderbookVisualizationComponent } from './components/orderbook-visualization/orderbook-visualization.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    OrderbookVisualizationComponent,
    CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'order-book-visualizer';
}
