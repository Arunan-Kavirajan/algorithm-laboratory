<div align="center">
  <h1>Algorithm Laboratory 🧪</h1>
  <p>An interactive web platform for visualizing data structures and benchmarking algorithms side by side.</p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License" />
</div>

<br />

Welcome to the **Algorithm Laboratory**! This project brings data structures and algorithms to life. Whether you are a student learning computer science concepts or a developer looking to compare performance, this interactive sandbox provides real-time visualizations and analytics in a highly engaging environment.

### ✨ Features

* **Interactive Visualizer:** Step through sorting, searching, and graph algorithms line by line. Watch how the underlying array or graph changes in real time.
* **Algorithmic Racing (Benchmark):** Put two algorithms head to head. Compare their execution time, step count, comparisons, and swaps on the exact same dataset to see which one truly reigns supreme.
* **Sandbox Playground:** Build custom arrays and graphs to test edge cases and intimately understand algorithmic behavior on your tailored data.
* **Responsive Design:** A beautiful, dark mode optimized UI built with Tailwind CSS and animated using Framer Motion.

### 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand
* **Backend:** Python, FastAPI
* **Deployment:** Vercel (Serverless Functions)

### 🚀 Quick Start

Follow these simple steps to get the Algorithm Laboratory running locally on your machine.

#### Prerequisites
* Node.js (v18 or higher)
* Python (v3.10 or higher)

#### 1. Clone the repository
```bash
git clone https://github.com/Arunan-Kavirajan/algorithm-laboratory.git
cd algorithm-laboratory
```

#### 2. Start the Backend
Navigate to the root directory and install the Python dependencies:
```bash
pip install -r requirements.txt
uvicorn api.index:app 
```
*Note: The API will be available at `http://localhost:8000`*

#### 3. Start the Frontend
Open a new terminal window, navigate to the `frontend` directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
*Note: The frontend will be available at `http://localhost:5173`*

### 📝 License

This project is open sourced and licensed under the MIT License. See the `LICENSE` file for more details.

### 🤝 Contributing

Contributions, issues, and feature requests are highly welcome! Feel free to check the issues page if you want to contribute to the codebase.
