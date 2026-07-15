import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LogInteraction from './pages/LogInteraction';
import Doctors from './pages/Doctors';
import Interactions from './pages/Interactions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                 element={<Dashboard />}       />
        <Route path="/log-interaction"  element={<LogInteraction />}  />
        <Route path="/doctors"          element={<Doctors />}         />
        <Route path="/interactions"     element={<Interactions />}    />
        <Route path="/analytics"        element={<Analytics />}       />
        <Route path="/settings"         element={<Settings />}        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
