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
          gap: 2rem;
          padding: 0.6rem 1rem;
          justify-content: space-between;
        }

        /* LOGOTIPO */
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .logo-link {
          color: #c29c5e;
          text-decoration: none;
          font-size: 1.4rem;
          font-weight: bold;
          font-family: 'Georgia', serif;
          display: flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
        }

        .logo-img {
          width: 50px;
          height: 50px;
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
          overflow: visible;
        }

        .nav-list-main,
        .nav-list-right {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          gap: 0.3rem;
          align-items: center;
          flex-wrap: nowrap;
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

        .nav-item {
          display: inline-flex;
        }

        .nav-link {
          color: #f0f0f0;
          text-decoration: none;
          font-size: 0.85rem;
          padding: 0.5rem 0.8rem;
          border-radius: 6px;
          transition: all 0.22s ease;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-weight: 500;
          white-space: nowrap;
          background: transparent;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* USUARIO Y CERRAR SESIÓN */
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          padding-left: 1rem;
          white-space: nowrap;
        }

        .welcomeText {
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .username-text {
          color: #f4e6c8;
          margin-left: 4px;
        }

        .btn-logout {
          background: #d9534f;
          border: none;
          padding: 0.4rem 0.9rem;
          color: #fff;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .btn-logout:hover {
          background-color: #c9302c;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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

        .navbar-toggler-custom:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .container-fluid {
            padding: 0.5rem 0;
            flex-wrap: wrap;
          }

          .navbar-toggler-custom {
            display: inline-flex;
            margin-left: auto;
          }

          .nav-collapse {
            display: none;
            width: 100%;
            flex-direction: column;
            gap: 0.5rem;
            background: #2f4858;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 0.5rem;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          }

          .nav-collapse.open {
            display: flex;
          }

          .nav-list-main,
          .nav-list-right {
            flex-direction: column;
            width: 100%;
            gap: 0.5rem;
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
            gap: 0.5rem;
          }

          .welcomeText {
            width: 100%;
            justify-content: center;
          }

          .btn-logout {
            width: 100%;
          }

          .logo-img {
            width: 50px;
            height: 50px;
          }

          .logo-link {
            font-size: 1.3rem;
          }
        }

        /* Espaciado para el contenido debajo del header */
        body {
          padding-top: 80px;
        }
      `}</style>

      <header className="main-header">
        <div className="container-fluid">
          {/* LOGO */}
          <div className="logo">
            <Link to="/" className="logo-link">
              <img src="/logo.png" className="logo-img" alt="Logo" />
              <span className="brandText">Qué Birria</span>
            </Link>
          </div>

          {/* BOTÓN HAMBURGUESA (móvil) */}
          <button className="navbar-toggler-custom" onClick={toggleMenu}>
            <span>☰</span>
          </button>

          {/* NAVEGACIÓN */}
          <nav className="nav-root">
            <div className={`nav-collapse ${menuOpen ? 'open' : ''}`}>
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
                    <li className="nav-item">
                      <Link className="nav-link" to="/cliente/lista">👥 Clientes</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/reserva/lista">📅 Reservas</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/venta/lista">📊 Ventas</Link>
                    </li>
                  </>
                )}

                {/* SUPERVISOR */}
                {rol === "supervisor" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/usuarios/lista">👤 Usuarios</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/empleado/lista">👨‍💼 Empleados</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cliente/lista">👥 Clientes</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/producto/lista">🍽️ Productos</Link>
                    </li>
                  </>
                )}

                {/* ADMINISTRADOR */}
                {rol === "administrador" && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/usuarios/lista">👤 Usuarios</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cliente/lista">👥 Clientes</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/empleado/lista">👨‍💼 Empleados</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/mesa/lista">📍 Mesas</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/tipoProducto/lista">🏷️ Tipos de productos</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/producto/lista">🍽️ Productos</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/reserva/lista">📅 Reservas</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/venta/lista">📊 Ventas</Link>
                    </li>
                  </>
                )}
              </ul>

              {/* ZONA DERECHA */}
              <ul className="nav-list-right">
                {!usuario ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">🔐 Iniciar sesión</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/usuarios/crear">➕ Registrarse</Link>
                    </li>
                  </>
                ) : (
                  <li className="nav-item user-list-item">
                    <div className="user-info">
                      <span className="welcomeText">
                        🤗 Bienvenido <span className="username-text">{rol} {usuario.nombre}</span>
                      </span>
                      <button onClick={logout} className="btn-logout">
                        ⍈ Cerrar sesión
                      </button>
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