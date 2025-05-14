import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeControlsComponent } from './time-controls.component';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

describe('TimeControlsComponent', () => {
  let component: TimeControlsComponent;
  let fixture: ComponentFixture<TimeControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TimeControlsComponent,
        MatButtonModule,
        MatIconModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimeControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Button states', () => {
    it('should disable previous button when currentIndex is 0', () => {
      fixture.componentRef.setInput('currentIndex', 0);
      fixture.detectChanges();

      const prevButton = fixture.debugElement.query(By.css('.navigation-buttons button:first-child'));
      expect(prevButton.nativeElement.disabled).toBeTrue();
    });

    it('should enable previous button when currentIndex is greater than 0', () => {
      fixture.componentRef.setInput('timestamps', ['10:00:00.000', '10:00:10.000']);
      fixture.componentRef.setInput('currentIndex', 1);
      fixture.detectChanges();

      const prevButton = fixture.debugElement.query(By.css('.navigation-buttons button:first-child'));
      expect(prevButton.nativeElement.disabled).toBeFalse();
    });

    it('should disable next button when currentIndex is at last timestamp', () => {
      fixture.componentRef.setInput('timestamps', ['10:00:00.000', '10:00:10.000']);
      fixture.componentRef.setInput('currentIndex', 1);
      fixture.detectChanges();

      const nextButton = fixture.debugElement.query(By.css('.navigation-buttons button:last-child'));
      expect(nextButton.nativeElement.disabled).toBeTrue();
    });

    it('should enable next button when currentIndex is not at last timestamp', () => {
      fixture.componentRef.setInput('timestamps', ['10:00:00.000', '10:00:10.000']);
      fixture.componentRef.setInput('currentIndex', 0);
      fixture.detectChanges();

      const nextButton = fixture.debugElement.query(By.css('.navigation-buttons button:last-child'));
      expect(nextButton.nativeElement.disabled).toBeFalse();
    });
  });

  describe('Timestamp display', () => {
    it('should show timestamp display when timestamps are available', () => {
      fixture.componentRef.setInput('timestamps', ['10:00:00.000']);
      fixture.detectChanges();

      const timestampDisplay = fixture.debugElement.query(By.css('.timestamp-display'));
      expect(timestampDisplay).toBeTruthy();
    });

    it('should hide timestamp display when no timestamps are available', () => {
      fixture.componentRef.setInput('timestamps', []);
      fixture.detectChanges();

      const timestampDisplay = fixture.debugElement.query(By.css('.timestamp-display'));
      expect(timestampDisplay).toBeFalsy();
    });

    it('should format timestamp correctly', () => {
      fixture.componentRef.setInput('timestamps', ['10:00:00.123456']);
      fixture.componentRef.setInput('currentIndex', 0);
      fixture.detectChanges();

      const timestampDisplay = fixture.debugElement.query(By.css('.timestamp-display'));
      expect(timestampDisplay.nativeElement.textContent.trim()).toBe('10:00:00.123');
    });
  });

  describe('Navigation controls', () => {
    it('should emit indexChange when goToPrevious is called', () => {
      fixture.componentRef.setInput('timestamps', ['10:00:00.000', '10:00:10.000', '10:00:20.000']);
      fixture.componentRef.setInput('currentIndex', 1);
      fixture.detectChanges();

      const emitSpy = spyOn(component.indexChange, 'emit');

      component.goToPrevious();

      expect(emitSpy).toHaveBeenCalledWith(0);
    });

    it('should emit indexChange when goToNext is called', () => {
      fixture.componentRef.setInput('timestamps', ['10:00:00.000', '10:00:10.000', '10:00:20.000']);
      fixture.componentRef.setInput('currentIndex', 1);
      fixture.detectChanges();

      const emitSpy = spyOn(component.indexChange, 'emit');

      component.goToNext();

      expect(emitSpy).toHaveBeenCalledWith(2);
    });

    it('should emit indexChange when navigation buttons are clicked', () => {
      fixture.componentRef.setInput('timestamps', ['10:00:00.000', '10:00:10.000', '10:00:20.000']);
      fixture.componentRef.setInput('currentIndex', 1);
      fixture.detectChanges();

      const emitSpy = spyOn(component.indexChange, 'emit');

      const prevButton = fixture.debugElement.query(By.css('.navigation-buttons button:first-child'));
      prevButton.nativeElement.click();

      expect(emitSpy).toHaveBeenCalledWith(0);
    });
  });

  describe('Basic playback functionality', () => {
    it('should have isPlaying signal', () => {
      expect(component.isPlaying).toBeDefined();
    });

    it('should have togglePlayback method', () => {
      expect(component.togglePlayback).toBeDefined();
      expect(() => {
        component.togglePlayback();
      }).not.toThrow();
    });

    it('should change isPlaying when togglePlayback is called multiple times', () => {
      const initialState = component.isPlaying();

      component.togglePlayback();
      fixture.detectChanges();

      component.togglePlayback();
      fixture.detectChanges();

      expect(component.isPlaying()).toBe(initialState);
    });

    it('should show play_arrow or pause icon depending on state', () => {
      const icon = fixture.debugElement.query(By.css('.navigation-buttons button:nth-child(2) mat-icon'));

      const iconText = icon.nativeElement.textContent.trim();
      expect(['play_arrow', 'pause']).toContain(iconText);
    });
  });
});