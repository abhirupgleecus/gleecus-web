import { Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "./components/layout/AdminLayout";
import AuthLayout from "./components/layout/AuthLayout";
import PublicLayout from "./components/layout/PublicLayout";
import GuestOnlyRoute from "./routes/GuestOnlyRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import AboutMeetTheTeamPage from "./pages/about/AboutMeetTheTeamPage";
import AboutWhoWeArePage from "./pages/about/AboutWhoWeArePage";
import AdminPublishPage from "./pages/admin/AdminPublishPage";
import AdminQueriesPage from "./pages/admin/AdminQueriesPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import ArticleDetailPage from "./pages/insights/ArticleDetailPage";
import ArticlesListingPage from "./pages/insights/ArticlesListingPage";
import CaseStudyDetailPage from "./pages/insights/CaseStudyDetailPage";
import CaseStudiesListingPage from "./pages/insights/CaseStudiesListingPage";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about/who-we-are" element={<AboutWhoWeArePage />} />
        <Route path="/about/meet-the-team" element={<AboutMeetTheTeamPage />} />
        <Route path="/insights/articles" element={<ArticlesListingPage />} />
        <Route path="/insights/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/insights/case-studies" element={<CaseStudiesListingPage />} />
        <Route path="/insights/case-studies/:id" element={<CaseStudyDetailPage />} />

        <Route element={<GuestOnlyRoute />}>
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/publish" element={<AdminPublishPage />} />
          <Route path="/admin/queries" element={<AdminQueriesPage />} />
          <Route path="/admin" element={<Navigate to="/admin/publish" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}