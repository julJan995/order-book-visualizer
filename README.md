# Order Book Visualizer

An interactive data visualization tool built in Angular that displays trading information from order books, including bid and ask levels and their changes over time.

## About the Project

This visualization tool allows users to explore order book data snapshots that show bid and ask prices at different moments in time. Order books are crucial for understanding market depth and liquidity in trading environments.

- **Asks**: Represent prices at which sellers are willing to sell an asset
- **Bids**: Represent prices at which buyers are willing to purchase an asset

## Features

### Snapshot View
- Visualization of market depth showing bid and ask levels
- Display of 10 price levels for both buy and sell orders
- Clear differentiation between buy orders (blue) and sell orders (orange)

### Time Navigation
- Simple controls to navigate between consecutive snapshots
- Display of the current timestamp
- Easy navigation through the available data points

### Replay Mode
- Automatic playback of order book changes
- Preservation of relative time intervals between snapshots
- Complete dataset replay over a 30-second period
- Start/pause controls for user convenience

## Technologies
- Angular 19
- Chart.js with ng2-charts
- SCSS
- Jasmine & Karma for testing

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Project Structure

The application is organized into three main components:

- **TimeControlsComponent**: Manages time navigation and replay functionality
- **DepthChartComponent**: Handles the visualization of order book data
- **OrderbookVisualizationComponent**: Coordinates data flow between components

## Implementation Details

### Data Processing
The application processes order book data from a JSON file, transforming raw snapshots into a format optimized for visualization and time-based navigation.

### Replay Functionality
The replay mode compresses the entire dataset to be viewed over a fixed period (30 seconds) while maintaining the relative timing between snapshots, providing an intuitive view of market changes.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
