"use client"
import { Menu, RefreshCw } from "lucide-react"
import { useState } from "react"
import "../../stylos/cssPropietario/EncabezadoPropietario.css"

const EncabezadoPropietario = ({ onToggleMenu, isSidebarOpen, userData, onRefreshData }) => {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await onRefreshData()
    } catch (error) {
      console.error("Error al actualizar datos:", error)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className={`encabezado-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <header className="encabezado">
        <button className="boton-menu" onClick={onToggleMenu}>
          <Menu size={20} />
          <span>MENU</span>
        </button>

        <div className="header-controls">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              background: "none",
              border: "none",
              cursor: refreshing ? "not-allowed" : "pointer",
              marginRight: "15px",
              padding: "5px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
            title="Actualizar datos"
          >
            <RefreshCw
              size={16}
              style={{
                animation: refreshing ? "spin 1s linear infinite" : "none",
                color: "#666",
              }}
            />
          </button>

          <div className="info-usuario">
            <span>{userData?.nombre + ' ' + userData?.apellido || "Propietario"}</span>
            <small>{userData?.role || "Propietario"}</small>
            {userData?.email && <small style={{ fontSize: "11px", color: "#888" }}>{userData.email}</small>}
          </div>
        </div>
      </header>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default EncabezadoPropietario

