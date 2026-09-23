<div align="center">

# Algorithm Laboratory

**Data structures and algorithms, visualized.**

*An interactive web platform built to visualize complex data structures and benchmark algorithmic performance side by side.*

**[View Live Demo](https://algorithm-laboratory.vercel.app)**

<br />

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
<br />
<br />
<img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT" />
<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome" />

</div>

<br />

## Introduction

Algorithm Laboratory is an interactive platform that eliminates the guesswork in understanding how computer science algorithms operate under the hood. 

Generate custom datasets, select algorithms, and watch real-time visualizations of sorting, searching, and graph traversals. Or pit two algorithms against each other in the benchmark arena to compare performance metrics natively, executed via a Python serverless backend.

<br />

## Features

*   **Interactive visualizer**: Step through sorting, searching, and graph algorithms line by line.
*   **Algorithmic racing (Benchmark)**: Put two algorithms head to head on identical datasets to compare execution time, step count, comparisons, and memory space.
*   **Smart synchronization**: Automatically ensures you only benchmark algorithms that solve the same problem (e.g., sorting vs sorting).
*   **Sandbox playground**: Build custom arrays manually, tweak individual values, and enforce sorting for algorithms like Binary Search.
*   **Playback controls**: Full control over execution visualization with play, pause, step forward, rewind, and dynamic speed adjustment.
*   **Live code tracking**: Highlights the exact line of code currently being executed as the visualizer runs.
*   **Desktop-first experience**: The visualizer is optimized for desktop and laptop screens to accommodate complex canvas rendering and split-screen races.
*   **Native execution**: Algorithms are not simulated in JavaScript; they run natively on a Python backend which traces and returns chronological execution snapshots.

<br />

## Tech Stack

### Frontend
*   **React**: UI library
*   **Vite**: Build tool and dev server
*   **TypeScript**: Static typing across the app
*   **Tailwind CSS**: Utility-first styling for the dark mode interface
*   **Zustand**: Global state management for playback and event tracking

### Backend
*   **Python**: Core execution engine for algorithms
*   **FastAPI**: High-performance API framework serving execution snapshots
*   **Vercel Serverless**: Stateless, instantly scaling function deployments

### Core Libraries
*   **Framer Motion**: Fluid, spring-based animations for array bars and graph nodes
*   **Lucide React**: Clean and consistent iconography

<br />

## Project Structure

```text
algorithm_laboratory/
├── backend/
│   ├── app/
│   │   ├── algorithms/     # Native Python implementations of sorting/searching algorithms
│   │   ├── api/            # FastAPI routers
│   │   ├── engine/         # Execution engine and custom tracer for state snapshots
│   │   └── models/         # Pydantic schemas for data validation
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI elements (AlgorithmSelect, PlayerControls)
│   │   ├── content/        # Markdown guides for algorithms
│   │   ├── pages/          # Main views: Visualizer, Benchmark, Playground, Guides
│   │   ├── store/          # Zustand global state (usePlayerStore, useThemeStore)
│   │   └── visualizers/    # Complex rendering logic for arrays and graphs
```

<br />

## How It Works

```text
User Request
     │  Selects algorithm and dataset via React UI
     ▼
FastAPI Backend
     │  Receives payload and initializes native Python algorithm
     │  Injects custom Tracer into the execution loop
     │  Algorithm runs to completion instantly
     │  Tracer records every atomic operation (swap, compare, read)
     ▼
Snapshot Generation
     │  Events are packaged into a chronological JSON array
     │  Calculates total steps, time, and space complexity
     ▼
React Frontend
     │  Zustand store receives the event array
     │  Acts as a VCR player, iterating through events sequentially
     ▼
Visual Render
     │  Framer Motion calculates positional differences
     │  Animates elements smoothly to their new states on the canvas
```

> **Note:** Because HTTP requests are stateless, the Python backend runs the algorithm instantly and returns the complete history of states. The frontend handles the pacing and visualization locally.

<br />

## Getting Started

### Prerequisites
*   Node.js (LTS recommended)
*   Python (v3.10 or higher)
*   npm

### Installation

```bash
git clone https://github.com/Arunan-Kavirajan/algorithm-laboratory.git
cd algorithm-laboratory
npm install
```

### Start the Backend

```bash
pip install -r requirements.txt
uvicorn api.index:app 
```

*The API will be available at `http://localhost:8000`.*

### Start the Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

*The app will be available at `http://localhost:5173` (or the port Vite assigns).*

<br />

## Design System

Algorithm Laboratory uses a sleek, dark-mode-first aesthetic inspired by IDEs and terminal environments, ensuring data visualizations pop against the background. Typography relies on a clean, monospace-heavy structure for data points and code tracking.

<table>
  <thead>
    <tr>
      <th align="left">Token</th>
      <th align="left">Color</th>
      <th align="left">Usage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Background</td>
      <td><code>#0F172A</code> (Slate 900)</td>
      <td>Primary page background</td>
    </tr>
    <tr>
      <td>Surface</td>
      <td><code>#1E293B</code> (Slate 800)</td>
      <td>Cards, panels, and dropdowns</td>
    </tr>
    <tr>
      <td>Accent</td>
      <td><code>#38BDF8</code> (Sky 400)</td>
      <td>Primary buttons, active states, track A highlights</td>
    </tr>
    <tr>
      <td>Success</td>
      <td><code>#10B981</code> (Emerald 500)</td>
      <td>Sorted elements, completed states</td>
    </tr>
    <tr>
      <td>Warning</td>
      <td><code>#F59E0B</code> (Amber 500)</td>
      <td>Comparisons, active processing elements</td>
    </tr>
    <tr>
      <td>Heading text</td>
      <td><code>#F8FAFC</code> (Slate 50)</td>
      <td>Headings, high emphasis text</td>
    </tr>
    <tr>
      <td>Muted text</td>
      <td><code>#94A3B8</code> (Slate 400)</td>
      <td>Labels, secondary text, idle array bars</td>
    </tr>
    <tr>
      <td>Border</td>
      <td><code>#334155</code> (Slate 700)</td>
      <td>Default borders and dividers</td>
    </tr>
  </tbody>
</table>

<br />

## Browser Support

Algorithm Laboratory is designed for desktop and laptop screens. Visiting on a mobile device or narrow window shows a dedicated notice asking the user to switch to a larger screen, as the complex canvas visualizers and side-by-side benchmarking tracks require adequate horizontal space to function and render properly.
