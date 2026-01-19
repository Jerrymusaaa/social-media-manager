import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import Drafts from './pages/Drafts';
import Scheduled from './pages/Scheduled';
import Analytics from './pages/Analytics';

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!token ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/create" 
          element={token ? <CreatePost /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/drafts" 
          element={token ? <Drafts onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/scheduled" 
          element={token ? <Scheduled onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/analytics" 
          element={token ? <Analytics onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
