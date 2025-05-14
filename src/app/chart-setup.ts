import { Chart } from 'chart.js';
import {
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

export function registerChart() {
  Chart.register(
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
}