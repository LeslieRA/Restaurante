import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsuarioLogueado, logout } from "../services/AuthService";
import { FaUser } from "react-icons/fa";

export const HeaderComponent = () => {
  const [usuario, setUsuario] = useState(getUsuarioLogueado());
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  useEffect(() => {
    const handler = () => setUsuario(getUsuarioLogueado());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const cerrarSesion = () => {
    logout();
    window.location.href = "/login";
  };

  const esAdmin = usuario?.perfil === "ADMIN";
  const esEmpleado = usuario?.perfil === "EMPLEADO";

  return (
    <header className="main-header">
      <nav className="nav-container">

        {/* ========== MENÚ PRINCIPAL ========== */}
        <ul className="nav-links">

          {/* RUTAS PARA ADMIN */}
          {esAdmin && (
            <>
              <li><Link to="/clientes">Clientes</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/empleados">Empleados</Link></li>
              <li><Link to="/mesas">Mesas</Link></li>
              <li><Link to="/reservas">Reservas</Link></li>
              <li><Link to="/ventas">Ventas</Link></li>
            </>
          )}

          {/* RUTAS PARA EMPLEADO */}
          {esEmpleado && (
            <>
              <li><Link to="/clientes">Clientes</Link></li>
              <li><Link to="/reservas">Reservas</Link></li>
              <li><Link to="/ventas">Ventas</Link></li>
            </>
          )}
        </ul>

        {/* ========== BLOQUE DEL USUARIO ========== */}
        <div className="usuario-box">
          <div 
            className="usuario-info" 
            onClick={() => setDropdownAbierto(!dropdownAbierto)}
          >
            <FaUser className="user-icon" />
            <span>{usuario?.username} ({usuario?.perfil})</span>
          </div>

          {dropdownAbierto && (
            <div className="dropdown-menu">
              <button onClick={cerrarSesion}>Cerrar sesión</button>
            </div>
          )}
        </div>

      </nav>
    </header>
  );
};
