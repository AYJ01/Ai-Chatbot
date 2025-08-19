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
  <Route path="/" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/404" element={<Error404 />} />
  <Route
    path="/layout"
    element={
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="chats" replace />} />  
    <Route path="chats" element={<ChatList />} />             
    <Route path="chat/:chatId" element={<Chat />} />         
    <Route path="profile" element={<Profile />} />            
  </Route>

</Routes>

    </BrowserRouter>
  );
}

export default App;
