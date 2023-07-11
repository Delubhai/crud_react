import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRoutes from './AppRoutes';
import ResponsiveAppBar from './components/Appbar';

function App() {
  return (
    <BrowserRouter>
      <ResponsiveAppBar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
