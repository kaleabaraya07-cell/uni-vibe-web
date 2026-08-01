import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LocaleProvider } from "./context/LocaleContext";
import { AuthProvider } from "./context/AuthContext";
import { FeedProvider } from "./context/FeedContext";
import { SeeThroughProvider } from "./context/SeeThroughContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ChatProvider } from "./context/ChatContext";
import { UploadProvider } from "./context/UploadContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AuthLayout from "./components/AuthLayout/AuthLayout";
import AppLayout from "./components/AppLayout/AppLayout";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Home from "./pages/Home/Home";
import Feed from "./pages/Feed/Feed";
import Live from "./pages/Live/Live";
import Search from "./pages/Search/Search";
import Profile from "./pages/Profile/Profile";
import University from "./pages/University/University";
import Department from "./pages/Department/Department";
import Club from "./pages/Club/Club";
import Event from "./pages/Event/Event";
import Rankings from "./pages/Rankings/Rankings";
import Saved from "./pages/Saved/Saved";
import Chat from "./pages/Chat/Chat";
import ChatRoom from "./pages/ChatRoom/ChatRoom";
import Notifications from "./pages/Notifications/Notifications";
import Opportunities from "./pages/Opportunities/Opportunities";
import Settings from "./pages/Settings/Settings";
import Upload from "./pages/Upload/Upload";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <FeedProvider>
          <SeeThroughProvider>
            <NotificationProvider>
              <UploadProvider>
                <ChatProvider>
                  <BrowserRouter>
                    <Routes>
                      <Route element={<AuthLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                      </Route>
                      <Route
                        element={
                          <ProtectedRoute>
                            <AppLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<Home />} />
                        <Route path="feed" element={<Feed />} />
                        <Route path="live" element={<Live />} />
                        <Route path="search" element={<Search />} />
                        <Route path="profile/:id" element={<Profile />} />
                        <Route path="university/:id" element={<University />} />
                        <Route path="department/:id" element={<Department />} />
                        <Route path="club/:id" element={<Club />} />
                        <Route path="event/:id" element={<Event />} />
                        <Route path="rankings" element={<Rankings />} />
                        <Route path="saved" element={<Saved />} />
                        <Route path="chat" element={<Chat />} />
                        <Route path="chat/:id" element={<ChatRoom />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="opportunities" element={<Opportunities />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="upload" element={<Upload />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </ChatProvider>
              </UploadProvider>
            </NotificationProvider>
          </SeeThroughProvider>
        </FeedProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}

export default App;
