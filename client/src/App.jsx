import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.jsx';
import { ThemeProvider } from './context/ThemeProvider';

export default function App() {
  return <ThemeProvider><RouterProvider router={router} /></ThemeProvider>;
}
