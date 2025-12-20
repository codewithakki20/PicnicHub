// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Heart, MessageCircle } from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import MainSidebar from "../components/layout/MainSidebar";
import BottomNav from "../components/layout/BottomNav";
import TopNav from "../components/layout/TopNav";

// Pages
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

// Memories
import Memories from "../pages/Memories/Memories";
import Notifications from "../pages/Notifications"; // Added Notifications

import MemoryDetails from "../pages/Memories/MemoryDetails";
import EditMemory from "../pages/Memories/EditMemory";
import EditReel from "../pages/Reels/EditReel";


// Reels
import AllReels from "../pages/Reels/Reels";
import ReelPlayer from "../pages/Reels/ReelPlayer";

// Blogs
import AllBlogs from "../pages/Blogs/AllBlogs";
import BlogDetails from "../pages/Blogs/BlogDetails";





// User
import Profile from "../pages/User/Profile";
import OtherUserProfile from "../pages/User/OtherUserProfile";
import EditProfile from "../pages/User/EditProfile";
import UserSettings from "../pages/User/UserSettings";
import FindPeople from "../pages/User/FindPeople";
import ChangePassword from "../pages/User/ChangePassword";
import FollowList from "../pages/User/FollowList";
import CreateStory from "../pages/User/CreateStory";
import StoryView from "../pages/User/StoryView";
import UploadMemory from "../pages/User/UploadMemory";
import UploadReel from "../pages/User/UploadReel";

// Admin
import Dashboard from "../pages/Admin/Dashboard";
import ManageUsers from "../pages/Admin/ManageUsers";
import ManageMemories from "../pages/Admin/ManageMemories";
import ManageReels from "../pages/Admin/ManageReels";
import ManageBlogs from "../pages/Admin/ManageBlogs";
import ManageLocations from "../pages/Admin/ManageLocations";
import AdminCreateBlog from "../pages/Admin/AdminCreateBlog";
import AdminEditBlog from "../pages/Admin/AdminEditBlog";
import AdminCreateLocation from "../pages/Admin/AdminCreateLocation";
import AdminEditLocation from "../pages/Admin/AdminEditLocation";
import Settings from "../pages/Admin/Settings";

// Legal & Support
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";
import TermsOfService from "../pages/Legal/TermsOfService";
import TermsPrivacy from "../pages/Legal/TermsPrivacy";
import AboutUs from "../pages/Legal/AboutUs";
import ContactSupport from "../pages/Support/ContactSupport";
import HelpSupport from "../pages/Support/HelpSupport";

// ---------------- Protected Route ----------------
function ProtectedRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  return user ? children : <Navigate to="/auth/login" replace />;
}

// ---------------- Admin Route ----------------
function AdminRoute({ children }) {
  const { user } = useSelector((s) => s.auth);
  return user?.role === "admin" ? children : <Navigate to="/" replace />;
}

// ---------------- Layout Wrapper ----------------
// ---------------- Layout Wrapper ----------------
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-white md:bg-slate-50">

      {/* Desktop Sidebar */}
      <MainSidebar />

      {/* Mobile Top Header */}
      <TopNav />

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        <div className="w-full md:pt-6 px-0 md:px-4">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}

function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">{children}</div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />

        {/* Auth */}
        <Route
          path="/auth/login"
          element={
            <AppLayout>
              <Login />
            </AppLayout>
          }
        />
        <Route
          path="/auth/register"
          element={
            <AppLayout>
              <Register />
            </AppLayout>
          }
        />
        <Route
          path="/auth/verify-email"
          element={
            <AppLayout>
              <VerifyEmail />
            </AppLayout>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <AppLayout>
              <ForgotPassword />
            </AppLayout>
          }
        />
        <Route
          path="/auth/reset-password"
          element={
            <AppLayout>
              <ResetPassword />
            </AppLayout>
          }
        />

        {/* Memories */}
        <Route
          path="/memories"
          element={
            <AppLayout>
              <Memories />
            </AppLayout>
          }
        />
        <Route
          path="/memories/:id"
          element={
            <AppLayout>
              <MemoryDetails />
            </AppLayout>
          }
        />


        {/* Reels */}
        <Route
          path="/reels"
          element={
            <AppLayout>
              <AllReels />
            </AppLayout>
          }
        />
        <Route
          path="/reels/:id"
          element={<ReelPlayer />}
        />

        {/* Blogs */}
        <Route
          path="/blogs"
          element={
            <AppLayout>
              <AllBlogs />
            </AppLayout>
          }
        />
        <Route
          path="/blogs/:slug"
          element={
            <AppLayout>
              <BlogDetails />
            </AppLayout>
          }
        />





        {/* User Protected Pages */}
        <Route
          path="/create-story"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CreateStory />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stories"
          element={
            <ProtectedRoute>
              <StoryView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stories/:id"
          element={
            <ProtectedRoute>
              <StoryView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/:id"
          element={
            <AppLayout>
              <OtherUserProfile />
            </AppLayout>
          }
        />

        <Route
          path="/user/:id/follow-list"
          element={
            <AppLayout>
              <FollowList />
            </AppLayout>
          }
        />

        <Route
          path="/user/edit"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EditProfile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/upload-memory"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UploadMemory />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/memories/edit/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EditMemory />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reels/edit/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EditReel />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/upload-reel"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UploadReel />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Notifications />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UserSettings />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/find-people"
          element={
            <ProtectedRoute>
              <AppLayout>
                <FindPeople />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/change-password"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ChangePassword />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <ManageUsers />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/memories"
          element={
            <AdminRoute>
              <AdminLayout>
                <ManageMemories />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reels"
          element={
            <AdminRoute>
              <AdminLayout>
                <ManageReels />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/blogs"
          element={
            <AdminRoute>
              <AdminLayout>
                <ManageBlogs />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/blogs/create"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminCreateBlog />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/blogs/edit/:id"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminEditBlog />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/locations"
          element={
            <AdminRoute>
              <AdminLayout>
                <ManageLocations />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/locations/create"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminCreateLocation />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/locations/edit/:id"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminEditLocation />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </AdminRoute>
          }
        />

        {/* Legal & Support */}
        <Route
          path="/privacy-policy"
          element={
            <AppLayout>
              <PrivacyPolicy />
            </AppLayout>
          }
        />
        <Route
          path="/terms-of-service"
          element={
            <AppLayout>
              <TermsOfService />
            </AppLayout>
          }
        />
        <Route
          path="/contact-support"
          element={
            <AppLayout>
              <ContactSupport />
            </AppLayout>
          }
        />
        <Route
          path="/help-support"
          element={
            <AppLayout>
              <HelpSupport />
            </AppLayout>
          }
        />
        <Route
          path="/terms-privacy"
          element={
            <AppLayout>
              <TermsPrivacy />
            </AppLayout>
          }
        />
        <Route
          path="/about-us"
          element={
            <AppLayout>
              <AboutUs />
            </AppLayout>
          }
        />


        {/* Not Found */}
        <Route
          path="*"
          element={
            <AppLayout>
              <NotFound />
            </AppLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
