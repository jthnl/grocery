import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Register';
import Dashboard from './components/Dashboard';

const App = () => {
  const [user, setUser] = React.useState<string | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        {/* Use the ProtectedRoute component for Dashboard */}
        <Route
          path="/"
          element={<ProtectedRoute user={user} component={Dashboard} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

interface ProtectedRouteProps {
  user: string | null;
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  user,
  component: Component,
}) => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default App;