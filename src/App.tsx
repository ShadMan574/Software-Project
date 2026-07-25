import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import LegalPage from "./pages/LegalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<LegalPage title="Privacy Policy" intro="We respect your privacy and are committed to protecting your personal information while you shop with us." sections={[
                { heading: 'Information We Collect', body: 'We collect information you provide when creating an account, placing an order, contacting support, or subscribing to updates. This may include your name, email address, shipping address, and payment details required to complete your purchase.' },
                { heading: 'How We Use It', body: 'We use your information to process orders, communicate about your purchases, improve customer service, and maintain the security of our platform.' },
                { heading: 'Data Protection', body: 'We store data using secure systems and limit access to authorized team members. You can contact us if you would like to review or update your personal information.' }
              ]} />} />
              <Route path="/terms" element={<LegalPage title="Terms of Service" intro="These terms outline the rules for using our website and placing orders with Shadman Electronics." sections={[
                { heading: 'Use of the Site', body: 'You agree to use the website lawfully and not misuse its content, accounts, or services.' },
                { heading: 'Orders and Payments', body: 'All orders are subject to product availability and verification of payment. We reserve the right to refuse or cancel orders when necessary.' },
                { heading: 'Limitation of Liability', body: 'We are not responsible for indirect damages arising from the use of this site except where required by law.' }
              ]} />} />
              <Route path="/cookies" element={<LegalPage title="Cookie Policy" intro="We use cookies to improve your browsing experience, remember your preferences, and analyze site performance." sections={[
                { heading: 'What Cookies We Use', body: 'We use essential cookies for site functionality, preference cookies to remember your selections, and analytics cookies to understand how visitors use our store.' },
                { heading: 'Managing Cookies', body: 'You can adjust your browser settings to block or delete cookies. Some features may not work properly if cookies are disabled.' },
                { heading: 'Consent', body: 'By continuing to use our website, you consent to the use of cookies as described in this policy.' }
              ]} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
