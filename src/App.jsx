import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatList from './pages/ChatList';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Error404 from './pages/Error404';

function App() {
  return (
    <BrowserRouter>
      <Routes>
  {/* Public Routes */}
  <Route path="/" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/404" element={<Error404 />} />

  {/* Protected Routes with Layout */}
  <Route
    path="/layout"
    element={
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    }
  >
    {/* Relative paths for children */}
    <Route index element={<Navigate to="chats" replace />} />  {/* /layout → /layout/chats */}
    <Route path="chats" element={<ChatList />} />               {/* /layout/chats */}
    <Route path="chat/:chatId" element={<Chat />} />           {/* /layout/chat/:chatId */}
    <Route path="profile" element={<Profile />} />             {/* /layout/profile */}
  </Route>

  {/* Catch-all → 404 */}
  <Route path="*" element={<Navigate to="/404" replace />} />
</Routes>

    </BrowserRouter>
  );
}

export default App;
