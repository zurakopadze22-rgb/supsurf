import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import About from './pages/About';
import Admin from './pages/Admin';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:locale" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:id" element={<ProductDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogPostDetail />} />
          <Route path="about" element={<About />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        {/* Wildcard path will fall into Layout which handles default locale redirect */}
        <Route path="*" element={<Layout />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
