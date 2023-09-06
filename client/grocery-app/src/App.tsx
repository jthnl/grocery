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
        {/* Protected Routes to check Authentication */}
        <Route
          path="/"
          element={<ProtectedRoute user={user} component={Dashboard} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

// TODO: Change to a more reliable check for User Session
// Protected Routes redirect to login if user is not authenitcated.
interface ProtectedRouteProps {
  user: string | null;
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  user,
  component: Component,
}) => {
  if (!localStorage.getItem('jwtToken');) {
    return <Navigate to="/login" />;
  }
  return <Component />;
};

export default App;