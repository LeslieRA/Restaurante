import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getUsuarioLogueado, logout } from "../services/AuthService";

export const HeaderComponent = () => {
  const [usuario, setUsuario] = useState(getUsuarioLogueado());
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [userMenuOpen, setUserMenuOpen] = useState(false); // dropdown for user
  const userRef = useRef(null);

  useEffect(() => {
    const handler = () => setUsuario(getUsuarioLogueado());
    window.addEventListener("authChange", handler);
    return () => window.removeEventListener("authChange", handler);
  }, []);

  // cerrar dropdown de usuario al hacer clic fuera
  useEffect(() => {
    const onClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [userMenuOpen]);

  const rol = usuario?.perfil;

  const toggleMenu = () => setMenuOpen((s) => !s);
  const toggleUserMenu = () => setUserMenuOpen((s) => !s);

  // Links para administrador (mostrados en la navegación central cuando rol === "administrador")
  const adminLinks = [
    { to: "/cliente/lista", label: "Clientes" },
    { to: "/producto/lista", label: "Productos" },
    { to: "/empleado/lista", label: "Empleados" },
    { to: "/mesa/lista", label: "Mesas" },
    { to: "/tipoProducto/lista", label: "Tipos de productos" },
    { to: "/reserva/lista", label: "Reservas" },
    { to: "/venta/lista", label: "Ventas" },
    { to: "/usuarios/lista", label: "Usuarios" },
  ];

  return (
    <>
      <style>{`
        /* ===== HEADER ===== */
        .main-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2000;
          background: #32444c;
          color: #eef2f3;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          font-family: Arial, Helvetica, sans-serif;
        }
        .container-fluid {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 1rem;
          box-sizing: border-box;
        }

        /* LOGO */
        .logo-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #d6b875;
          font-weight: 700;
          font-family: Georgia, serif;
          font-size: 1.2rem;
        }
        .logo-img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; }

        /* NAV CENTER */
        .nav-root { flex: 1; display: flex; justify-content: center; }
        .nav-list {
          display: flex;
          gap: 1.1rem;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          flex-wrap: wrap;
        }
        .nav-item { display: inline-flex; }
        .nav-link {
          text-decoration: none;
          color: #eef2f3;
          padding: 0.45rem 0.6rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: background 0.15s, transform 0.12s;
        }
        .nav-link:hover { background: rgba(255,255,255,0.04); transform: translateY(-2px); }

        /* RIGHT user */
        .nav-right { display: flex; align-items: center; gap: 0.8rem; margin: 0; padding: 0; }
        .user-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.03);
          padding: 0.35rem 0.8rem;
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.03);
          user-select: none;
        }
        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #4b646c;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
          text-transform: uppercase;
        }
        .user-name { font-weight: 700; color: #f3f1ea; font-size: 0.95rem; }
        .user-role { color: #cfc7a8; font-weight: 600; font-size: 0.85rem; margin-left: 6px; }

        /* USER DROPDOWN */
        .user-dropdown {
          position: absolute;
          right: 1rem;
          top: calc(100% + 8px);
          background: #2f3e44;
          padding: 0.5rem;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
          min-width: 190px;
          z-index: 2500;
        }
        .user-dropdown .name {
          color: #e7efef;
          font-weight: 700;
          margin-bottom: 0.6rem;
        }
        .user-dropdown button {
          width: 100%;
          padding: 0.48rem 0.6rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          background: #c75f54;
          color: #fff;
        }
        .user-dropdown button:hover { transform: translateY(-2px); }

        /* HAMBURGER */
        .navbar-toggler-custom {
          display: none;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          padding: 0.45rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
        }

        /* spacing so page content doesn't go under header */
        body { padding-top: 72px; }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .nav-root { justify-content: flex-start; }
          .nav-list { display: none; flex-direction: column; gap: 0.6rem; background: transparent; padding: 0.6rem 0; }
          .nav-list.open { display: flex; }
          .navbar-toggler-custom { display: inline-flex; }
          .user-dropdown { right: 0.6rem; left: auto; }
        }
      `}</style>

      <header className="main-header">
        <div className="container-fluid">
          {/* LOGO */}
          <Link to="/" className="logo-link" aria-label="Inicio">
            <img src="/logo.png" alt="logo" className="logo-img" />
            <span>Café del Sol</span>
          </Link>

          {/* HAMBURGER (mobile) */}
          <button
            className="navbar-toggler-custom"
            onClick={toggleMenu}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          {/* NAVEGACIÓN CENTRADA */}
          <nav className="nav-root" role="navigation" aria-label="Menú principal">
            <ul className={`nav-list ${menuOpen ? "open" : ""}`} role="menubar">
              {/* Si es administrador mostramos todas las opciones principales */}
              {rol === "administrador" ? (
                adminLinks.map((l) => (
                  <li className="nav-item" key={l.to} role="none">
                    <Link role="menuitem" className="nav-link" to={l.to}>{l.label}</Link>
                  </li>
                ))
              ) : (
                /* Otros roles: mostramos su set de opciones */
                <>
                  <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>

                  {rol === "cliente" && (
                    <li className="nav-item"><Link className="nav-link" to="/reserva/lista">Reservas</Link></li>
                  )}

                  {rol === "mesero" && (
                    <li className="nav-item"><Link className="nav-link" to="/venta/lista">Ventas</Link></li>
                  )}

                  {rol === "cajero" && (
                    <>
                      <li className="nav-item"><Link className="nav-link" to="/cliente/lista">Clientes</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/reserva/lista">Reservas</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/venta/lista">Ventas</Link></li>
                    </>
                  )}

                  {rol === "supervisor" && (
                    <>
                      <li className="nav-item"><Link className="nav-link" to="/usuarios/lista">Usuarios</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/empleado/lista">Empleados</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/cliente/lista">Clientes</Link></li>
                      <li className="nav-item"><Link className="nav-link" to="/producto/lista">Productos</Link></li>
                    </>
                  )}
                </>
              )}
            </ul>
          </nav>

          {/* ZONA DERECHA: usuario / login */}
          <div style={{ position: "relative" }} ref={userRef}>
            {!usuario ? (
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <Link className="nav-link" to="/login">Iniciar sesión</Link>
                <Link className="nav-link" to="/usuarios/crear">Registrarse</Link>
              </div>
            ) : (
              <>
                <div
                  className="user-pill"
                  onClick={toggleUserMenu}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <div className="user-avatar">
                    {usuario.nombre ? usuario.nombre.charAt(0) : "U"}
                  </div>
                  <div>
                    <div className="user-name">{usuario.nombre}</div>
                    <div className="user-role">{rol}</div>
                  </div>
                </div>

                {userMenuOpen && (
                  <div className="user-dropdown" role="menu" aria-label="Menú de usuario">
                    <div className="name">{usuario.nombre} — {rol}</div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
