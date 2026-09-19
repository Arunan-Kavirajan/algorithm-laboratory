import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Visualizer } from './pages/Visualizer';
import { Guides } from './pages/Guides';
import { Playground } from './pages/Playground';
import { Benchmark } from './pages/Benchmark';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="visualizer" element={<Visualizer />} />
        <Route path="compare" element={<Benchmark />} />
        <Route path="guides" element={<Guides />} />
        <Route path="playground" element={<Playground />} />
      </Route>
    </Routes>
  );
}
