import { Component, signal, output, input, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-time-controls',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule
  ],
  template: `
  <div class="time-controls">
    <div class="controls-container">
      <div class="navigation-buttons">
        <button 
          mat-icon-button 
          (click)="goToPrevious()" 
          [disabled]="isGoToPreviousBtnDisabled()">
          <mat-icon>chevron_left</mat-icon>
        </button>
        
        <button 
          mat-icon-button 
          (click)="togglePlayback()">
          <mat-icon>
            {{ isPlaying() ? 'pause' : 'play_arrow' }}
          </mat-icon>
        </button>
        
        <button 
          mat-icon-button 
          (click)="goToNext()" 
          [disabled]="isGoToNextBtnDisabled()">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>

      @if (hasTimestamps()) {
        <div class="timestamp-display">
          {{ formattedCurrentTimestamp() }}
        </div>
      }
    </div>
  </div>
  `,
  styles: [`
    .time-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    
    .controls-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    
    .navigation-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .timestamp-display {
      margin-top: 10px;
      text-align: center;
      font-size: 0.9em;
      color: #666;
    }
  `]
})
export class TimeControlsComponent {
  timestamps = input<string[]>([]);
  currentIndex = input<number>(0);
  isPlaying = signal<boolean>(false);
  indexChange = output<number>();

  isGoToPreviousBtnDisabled = computed(() => this.currentIndex() === 0);
  
  isGoToNextBtnDisabled = computed(() => 
    this.currentIndex() === this.timestamps().length - 1
  );
  
  hasTimestamps = computed(() => this.timestamps().length > 0);
  
  formattedCurrentTimestamp = computed(() => {
    if (!this.hasTimestamps()) return '';
    return this.formatTimestamp(this.timestamps()[this.currentIndex()]);
  });

  private playInterval: ReturnType<typeof setTimeout> | null = null;
  private isPlaybackStopping = false;
  private readonly REPLAY_DURATION_MS = 30000;

  constructor() {
    effect(() => {
      if (this.isPlaying()) {
        this.startPlayback();
      } else {
        this.stopPlayback();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopPlayback();
  }

  goToPrevious(): void {
    const current = this.currentIndex();
    if (current > 0) {
      this.indexChange.emit(current - 1);
    }
  }

  goToNext(): void {
    const current = this.currentIndex();
    const timestamps = this.timestamps();

    if (current < timestamps.length - 1) {
      this.indexChange.emit(current + 1);
    }
  }

  togglePlayback(): void {
    this.isPlaying.update(playing => !playing);
  }

  formatTimestamp(timestamp: string): string {
    const [time, microseconds] = timestamp.split('.');
    return `${time}.${microseconds.slice(0, 3)}`;
  }

  private calculateTimeDifferences(): number[] {
    const timestamps = this.timestamps();
    
    return timestamps.slice(1).map((timestamp, index) => {
      const prevTime = new Date(`1970-01-01T${timestamps[index]}`);
      const currentTime = new Date(`1970-01-01T${timestamp}`);
      return currentTime.getTime() - prevTime.getTime();
    });
  }

  private calculateScaleFactor(timeDiffs: number[]): number {
    const totalTimeDiff = timeDiffs.reduce((a, b) => a + b, 0);
    return this.REPLAY_DURATION_MS / totalTimeDiff;
  }

  private startPlayback(): void {
    this.isPlaybackStopping = false;
    const timestamps = this.timestamps();

    if (timestamps.length <= 1) {
      this.isPlaying.set(false);
      return;
    }

    const timeDiffs = this.calculateTimeDifferences();
    const scaleFactor = this.calculateScaleFactor(timeDiffs);

    let current = this.currentIndex();
    if (current >= timestamps.length - 1) {
      this.indexChange.emit(0);
      current = 0;
    }

    this.playNextFrame(current, timeDiffs, scaleFactor);
  }

  private playNextFrame(index: number, timeDiffs: number[], scaleFactor: number): void {
    if (this.isPlaybackStopping || index >= this.timestamps().length - 1) {
      this.isPlaying.set(false);
      return;
    }

    const nextIndex = index + 1;
    const delay = timeDiffs[index] * scaleFactor;

    this.playInterval = setTimeout(() => {
      this.indexChange.emit(nextIndex);
      this.playNextFrame(nextIndex, timeDiffs, scaleFactor);
    }, delay);
  }

  private stopPlayback(): void {
    this.isPlaybackStopping = true;
    if (this.playInterval) {
      clearTimeout(this.playInterval);
      this.playInterval = null;
    }
  }
}
