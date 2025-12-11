// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Streaks from "./pages/Streaks";
import Stats from "./pages/Stats";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/streaks" element={<Streaks />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
