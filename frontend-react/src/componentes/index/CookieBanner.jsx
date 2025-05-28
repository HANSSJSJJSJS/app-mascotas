"use client"

import { useState, useEffect } from "react"
import "../../stylos/cssIndex/CookieBanner.css"
import { X, Shield, Settings, Check, ChevronLeft } from "lucide-react"

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [cookies, setCookies] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent")
    if (!cookieConsent) {
      setTimeout(() => {
        setShowBanner(true)
      }, 1500)
    }
  }, [])

  const handleAcceptAll = () => {
    const allCookies = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    setCookies(allCookies)
    localStorage.setItem("cookieConsent", JSON.stringify(allCookies))
    localStorage.setItem("cookieConsentDate", new Date().toISOString())
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleAcceptSelected = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(cookies))
    localStorage.setItem("cookieConsentDate", new Date().toISOString())
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleRejectAll = () => {
    const necessaryOnly = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    setCookies(necessaryOnly)
    localStorage.setItem("cookieConsent", JSON.stringify(necessaryOnly))
    localStorage.setItem("cookieConsentDate", new Date().toISOString())
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleCookieChange = (type) => {
    if (type === "necessary") return
    setCookies((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  if (!showBanner) return null

  return (
    <div className="cookie-backdrop">
      <div className="cookie-modal">
        {!showSettings ? (
          // Vista principal - Banner horizontal
          <div className="cookie-main-view">
            <button className="cookie-close-btn" onClick={() => setShowBanner(false)}>
              <X size={16} />
            </button>

            <div className="cookie-content-wrapper">
              <div className="cookie-info-section">
                <div className="cookie-icon-container">
                  <Shield size={24} />
                </div>
                <div className="cookie-text-content">
                  <h3 className="cookie-title">🍪 Respetamos tu Privacidad</h3>
                  <p className="cookie-description">
                    En <strong>MOYBE</strong> utilizamos cookies para mejorar tu experiencia y personalizar nuestros
                    servicios veterinarios.
                  </p>
                </div>
              </div>

              <div className="cookie-actions">
                <button className="cookie-btn cookie-btn-accept" onClick={handleAcceptAll}>
                  <Check size={16} />
                  Aceptar Todo
                </button>
                <button className="cookie-btn cookie-btn-essential" onClick={handleRejectAll}>
                  Solo Esenciales
                </button>
                <button className="cookie-btn cookie-btn-settings" onClick={() => setShowSettings(true)}>
                  <Settings size={14} />
                  Configurar
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Vista de configuración
          <div className="cookie-settings-view">
            <div className="settings-header">
              <div className="settings-title">
                <button className="cookie-back-btn" onClick={() => setShowSettings(false)}>
                  <ChevronLeft size={16} />
                </button>
                <h3>Configuración de Cookies</h3>
              </div>
              <button className="cookie-close-btn" onClick={() => setShowBanner(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="settings-grid">
              <div className="cookie-category">
                <div className="category-header">
                  <div className="category-info">
                    <h4>🔒 Cookies Esenciales</h4>
                    <p>Necesarias para el funcionamiento básico del sitio web</p>
                  </div>
                  <div className="toggle-switch active disabled">
                    <div className="toggle-slider"></div>
                  </div>
                </div>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <div className="category-info">
                    <h4>⚡ Cookies Funcionales</h4>
                    <p>Mejoran la funcionalidad y personalización</p>
                  </div>
                  <div
                    className={`toggle-switch ${cookies.functional ? "active" : ""}`}
                    onClick={() => handleCookieChange("functional")}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <div className="category-info">
                    <h4>📊 Cookies de Análisis</h4>
                    <p>Nos ayudan a entender cómo usas nuestro sitio</p>
                  </div>
                  <div
                    className={`toggle-switch ${cookies.analytics ? "active" : ""}`}
                    onClick={() => handleCookieChange("analytics")}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <div className="category-info">
                    <h4>🎯 Cookies de Marketing</h4>
                    <p>Para mostrarte contenido más relevante</p>
                  </div>
                  <div
                    className={`toggle-switch ${cookies.marketing ? "active" : ""}`}
                    onClick={() => handleCookieChange("marketing")}
                  >
                    <div className="toggle-slider"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-footer">
              <button className="cookie-btn cookie-btn-essential" onClick={() => setShowSettings(false)}>
                Cancelar
              </button>
              <button className="cookie-btn cookie-btn-accept" onClick={handleAcceptSelected}>
                <Check size={16} />
                Guardar Preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

