import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import './pages/Public/HomePage/HomePage.css'
import './components/features/Home/ContactSection.css'
import './components/features/Home/AboutSection.css'
import './components/features/Home/HeroSection.css'
import './components/features/Home/BestSellerSection.css'
import './components/features/Home/CallToActionSection.css'
import './components/common/Header/Header.css'
import './components/common/Footer/Footer.css'
import './pages/Public/products.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)