import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.jsx';

export default function App() {
  return <RouterProvider router={router} />;
}
