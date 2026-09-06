import { Suspense, lazy } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { AuthLayout } from "./layouts/AuthLayout";
import { AppLayout } from "./layouts/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Every page is loaded on-demand instead of bundled into one big
// initial download. Vite flagged the bundle as over 500kB back when we
// only had 4 pages — with 8 now, that would only have gotten worse.
// lazy() + Suspense means visiting /login downloads Login.tsx's code,
// not Dashboard's, Discover's, and everyone else's too.
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Discover = lazy(() => import("./pages/Discover"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const CreateProject = lazy(() => import("./pages/CreateProject"));
const Profile = lazy(() => import("./pages/Profile"));
const Applications = lazy(() => import("./pages/Applications"));
const Learning = lazy(() => import("./pages/Learning"));
const Meetings = lazy(() => import("./pages/Meetings"));
const MeetingRoom = lazy(() => import("./pages/MeetingRoom"));

function RouteFallback() {
  return <div className="min-h-screen flex items-center justify-center text-ink/60">Loading…</div>;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Authenticated app routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/projects/new" element={<CreateProject />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/meetings/:roomId" element={<MeetingRoom />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
