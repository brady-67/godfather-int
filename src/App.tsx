import { Route, Routes } from 'react-router-dom';
import { RequireAdmin } from '@/components/layout/RequireAdmin';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { AboutPage } from '@/pages/AboutPage';
import { AdminPage } from '@/pages/AdminPage';
import { AccountPage } from '@/pages/AccountPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ServicesPage } from '@/pages/ServicesPage';
import { ShopPage } from '@/pages/ShopPage';
import { TrackOrderPage } from '@/pages/TrackOrderPage';

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/track" element={<TrackOrderPage />} />
        <Route path="/track/:code" element={<TrackOrderPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <AccountPage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
