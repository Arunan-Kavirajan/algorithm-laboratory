import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Visualizer } from './pages/Visualizer';
import { Guides } from './pages/Guides';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Visualizer />} />
        <Route path="guides" element={<Guides />} />
      </Route>
    </Routes>
  );
}
