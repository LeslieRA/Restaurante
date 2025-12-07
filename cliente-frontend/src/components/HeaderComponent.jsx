import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsuarioLogueado, logout } from "../services/AuthService";

export const HeaderComponent = () => {
  const [usuario, setUsuario] = useState(getUsuarioLogueado());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setUsuario(getUsuarioLogueado());
    window.addEventListener("authChange", handler);
    return () => window.removeEventListener("authChange", handler);
  }, []);

  const rol = usuario?.perfil;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <style>{`
        /* =========================================
           ESTILOS DEL HEADER
           ========================================= */
        .main-header {
          background-color: #2f4858;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2000;
          font-family: 'Arial', sans-serif;
          width: 100%;
          box-sizing: border-box;
        }

        .container-fluid {
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 0.8rem 1.5rem;
          justify-content: space-between;
        }

        /* LOGO */
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .logo-link {
          color: #c29c5e;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: bold;
          font-family: 'Georgia', serif;
          display: flex;
          align-items: center;
          gap: 12px;
          white-space: nowrap;
          min-width: fit-content;
        }

        .logo-img {
          width: 55px;
          height: 55px;
          object-fit: cover;
          transition: transform 0.3s ease;
          border-radius: 8px;
        }

        .logo-img:hover {
          transform: scale(1.05);
        }

        .brandText {
          color: #c29c5e;
        }

        /* NAVEGACIÓN */
        .nav-root {
          width: 100%;
          display: flex;
        }

        .nav-collapse {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          justify-content: space-between;
          flex: 1;
        }

        .nav-list-main,
        .nav-list-right {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .nav-list-main {
          flex: 1;
          justify-content: center;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .nav-list-main::-webkit-scrollbar {
          display: none;
        }

        .nav-link {
          color: #f0f0f0;
          text-decoration: none;
          font-size: 0.9rem;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-weight: 500;
          white-space: nowrap;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* USUARIO */
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          padding-left: 1.2rem;
        }

        .welcomeText {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .username-text {
          color: #f4e6c8;
        }

        .btn-logout {
          background: #d9534f;
          border: none;
          padding: 0.5rem 1.1rem;
          color: #fff;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-logout:hover {
          background-color: #c9302c;
          transform: translateY(-2px);
        }

        /* BOTÓN HAMBURGUESA */
        .navbar-toggler-custom {
          display: none;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          padding: 0.5rem 0.8rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1.2rem;
        }

        /* === MEGA MENÚ ESPECIAL ADMIN === */
        .admin-grid {
          display: grid;
          grid-template-columns: repeat(2, auto);
          gap: 0.5rem 1.5rem;
          padding: 0.5rem 1rem;
        }

        @media (max-width: 992px) {
          .admin-grid {
            grid-template-columns: 1fr;
          }

          .navbar-toggler-custom {
            display: inline-flex;
          }

          .nav-collapse {
            display: ${menuOpen ? "flex" : "none"};
            flex-direction: column;
            background: #2f4858;
            padding: 1rem;
            border-radius: 12px;
          }

          .nav-list-main,
          .nav-list-right {
            flex-direction: column;
            width: 100%;
          }

          .nav-link {
            width: 100%;
            padding: 0.7rem 1rem;
          }

          .user-info {
            flex-direction: column;
            border-left: none;
            padding-left: 0;
            width: 100%;
          }
        }

        body {
          padding-top: 90px;
        }
      `}</style>

      <header className="main-header">
        <div className="container-fluid">

          {/* LOGO */}
          <div className="logo">
            <Link to="/" className="logo-link">
              <img src="/logo.png" className="logo-img" alt="Logo" />
              <span className="brandText">Café del Sol</span>
            </Link>
          </div>

          {/* BOTÓN MÓVIL */}
          <button className="navbar-toggler-custom" onClick={toggleMenu}>
            ☰
          </button>

          <nav className="nav-root">
            <div className={`nav-collapse ${menuOpen ? "open" : ""}`}>

              <ul className="nav-list-main">
                <li className="nav-item">
                  <Link className="nav-link" to="/">🏠 Inicio</Link>
                </li>

                {/* CLIENTE */}
                {rol === "cliente" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/reserva/lista">📅 Mis Reservas</Link>
                  </li>
                )}

                {/* MESERO */}
                {rol === "mesero" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/venta/lista">📊 Ventas</Link>
                  </li>
                )}

                {/* CAJERO */}
                {rol === "cajero" && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/cliente/lista">👥 Clientes</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/reserva/lista">📅 Reservas</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/venta/lista">📊 Ventas</Link></li>
                  </>
                )}

                {/* SUPERVISOR */}
                {rol === "supervisor" && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/usuarios/lista">👤 Usuarios</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/empleado/lista">👨‍💼 Empleados</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/cliente/lista">👥 Clientes</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/producto/lista">🍽️ Productos</Link></li>
                  </>
                )}

                {/* ADMINISTRADOR (EN 2 COLUMNAS) */}
                {rol === "administrador" && (
                  <div className="admin-grid">
                    <li className="nav-item"><Link className="nav-link" to="/usuarios/lista">👤 Usuarios</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/cliente/lista">👥 Clientes</Link></li>

                    <li className="nav-item"><Link className="nav-link" to="/empleado/lista">👨‍💼 Empleados</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/mesa/lista">📍 Mesas</Link></li>

                    <li className="nav-item"><Link className="nav-link" to="/tipoProducto/lista">🏷️ Tipos de productos</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/producto/lista">🍽️ Productos</Link></li>

                    <li className="nav-item"><Link className="nav-link" to="/reserva/lista">📅 Reservas</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/venta/lista">📊 Ventas</Link></li>
                  </div>
                )}
              </ul>

              {/* DERECHA */}
              <ul className="nav-list-right">
                {!usuario ? (
                  <>
                    <li><Link className="nav-link" to="/login">🔐 Iniciar sesión</Link></li>
                    <li><Link className="nav-link" to="/usuarios/crear">➕ Registrarse</Link></li>
                  </>
                ) : (
                  <li className="user-list-item">
                    <div className="user-info">
                      <span className="welcomeText">
                        🤗 Bienvenido <span className="username-text">{rol} {usuario.nombre}</span>
                      </span>
                      <button onClick={logout} className="btn-logout">⍈ Cerrar sesión</button>
                    </div>
                  </li>
                )}
              </ul>

            </div>
          </nav>

        </div>
      </header>
    </>
  );
};
