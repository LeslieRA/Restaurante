import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getUsuarioLogueado, logout } from "../services/AuthService";

export const HeaderComponent = () => {
  const [usuario, setUsuario] = useState(getUsuarioLogueado());
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handler = () => setUsuario(getUsuarioLogueado());
    window.addEventListener("authChange", handler);
    return () => window.removeEventListener("authChange", handler);
  }, []);

  // Evita que el contenido quede oculto bajo el header fijo
  useEffect(() => {
    const setBodyPadding = () => {
      const h = headerRef.current ? headerRef.current.offsetHeight : 100;
      document.documentElement.style.setProperty("--header-height", `${h}px`);
      document.body.style.paddingTop = `${h}px`;
    };
    setBodyPadding();
    window.addEventListener("resize", setBodyPadding);
    return () => {
      window.removeEventListener("resize", setBodyPadding);
      document.body.style.paddingTop = "";
      document.documentElement.style.removeProperty("--header-height");
    };
  }, []);

  const rol = usuario?.perfil;

  const handleMouseEnter = (index) => setHoveredLink(index);
  const handleMouseLeave = () => setHoveredLink(null);

  return (
    <header className="main-header" ref={headerRef}>
      <nav className="nav-root">
        <div className="container-fluid">

          {/* LOGO */}
          <div className="logo">
            <Link to="/" className="logo-link" aria-label="Inicio - El Café">
              <img
                src="/logo.png"
                alt="Logo"
                className="logo-img"
                onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(360deg) scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0deg) scale(1)")}
              />
              <span className="brandText">El Café</span>
            </Link>
          </div>

          {/* Botón hamburguesa (móvil) */}
          <button
            className="navbar-toggler-custom"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Alternar navegación"
            aria-expanded={menuAbierto}
          >
            ☰
          </button>

          {/* Menú de navegación */}
          <div className={`nav-collapse ${menuAbierto ? "open" : ""}`}>

            <ul className="nav-list-main">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link ${hoveredLink === 'inicio' ? 'hovered' : ''}`}
                  onMouseEnter={() => handleMouseEnter('inicio')}
                  onMouseLeave={handleMouseLeave}
                >
                  🏠 Inicio
                </Link>
              </li>

              {rol === "cliente" && (
                <li className="nav-item">
                  <Link to="/reserva/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('reservas')} onMouseLeave={handleMouseLeave}>
                    📅 Mis Reservas
                  </Link>
                </li>
              )}

              {rol === "mesero" && (
                <li className="nav-item">
                  <Link to="/venta/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('ventas')} onMouseLeave={handleMouseLeave}>
                    📊 Ventas
                  </Link>
                </li>
              )}

              {rol === "cajero" && (
                <>
                  <li className="nav-item"><Link to="/cliente/lista" className="nav-link">👥 Clientes</Link></li>
                  <li className="nav-item"><Link to="/reserva/lista" className="nav-link">📅 Reservas</Link></li>
                  <li className="nav-item"><Link to="/venta/lista" className="nav-link">📊 Ventas</Link></li>
                </>
              )}

              {rol === "supervisor" && (
                <>
                  <li className="nav-item"><Link to="/usuarios/lista" className="nav-link">👤 Usuarios</Link></li>
                  <li className="nav-item"><Link to="/empleado/lista" className="nav-link">👨‍💼 Empleados</Link></li>
                  <li className="nav-item"><Link to="/cliente/lista" className="nav-link">👥 Clientes</Link></li>
                  <li className="nav-item"><Link to="/producto/lista" className="nav-link">🍽️ Productos</Link></li>
                </>
              )}

              {rol === "administrador" && (
                <>
                  <li className="nav-item"><Link to="/usuarios/lista" className="nav-link">👤 Usuarios</Link></li>
                  <li className="nav-item"><Link to="/cliente/lista" className="nav-link">👥 Clientes</Link></li>
                  <li className="nav-item"><Link to="/empleado/lista" className="nav-link">👨‍💼 Empleados</Link></li>
                  <li className="nav-item"><Link to="/mesa/lista" className="nav-link">📍 Mesas</Link></li>
                  <li className="nav-item"><Link to="/tipoProducto/lista" className="nav-link">🏷️ Tipos</Link></li>
                  <li className="nav-item"><Link to="/producto/lista" className="nav-link">🍽️ Productos</Link></li>
                  <li className="nav-item"><Link to="/reserva/lista" className="nav-link">📅 Reservas</Link></li>
                  <li className="nav-item"><Link to="/venta/lista" className="nav-link">📊 Ventas</Link></li>
                </>
              )}
            </ul>

            {/* ZONA DERECHA - Usuario o Login */}
            <ul className="nav-list-right">
              {!usuario && (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link btnAuth" onMouseEnter={() => handleMouseEnter('login')} onMouseLeave={handleMouseLeave}>
                      🔐 Iniciar sesión
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/usuarios/crear" className="nav-link btnAuth" onMouseEnter={() => handleMouseEnter('registro')} onMouseLeave={handleMouseLeave}>
                      ➕ Registrarse
                    </Link>
                  </li>
                </>
              )}

              {usuario && (
                <li className="nav-item user-list-item">
                  <div className="user-info">
                    <span className="welcomeText" title={usuario.nombre}>
                      🤗 Bienvenido <strong className="username-text">{usuario.nombre}</strong>
                    </span>
                    <button
                      onClick={logout}
                      className={`btn-logout ${hoveredBtn ? "hover" : ""}`}
                      onMouseEnter={() => setHoveredBtn(true)}
                      onMouseLeave={() => setHoveredBtn(false)}
                    >
                      ⚡ Cerrar sesión
                    </button>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <style>{`
        /* =========================================
           1. ESTILOS BASE DEL HEADER
           ========================================= */
        .main-header {
          background-color: #2f4858; /* Azul oscuro elegante */
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: fixed; /* fijo en la parte superior */
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
          max-width: 1200px;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.6rem 0;
        }

        /* =========================================
           2. LOGOTIPO
           ========================================= */
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .logo-link {
          color: #c29c5e;
          text-decoration: none;
          font-size: 1.6rem;
          font-weight: bold;
          font-family: 'Georgia', serif;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .logo-img {
          width: 52px;
          height: 52px;
          object-fit: cover;
          transition: transform 0.6s ease;
          border-radius: 6px;
        }

        .brandText { color: #c29c5e; }

        /* =========================================
           3. NAVEGACIÓN PRINCIPAL
           ========================================= */
        .nav-root { width: 100%; display: flex; }
        nav { width: 100%; }

        .nav-collapse {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: flex-end;
          flex: 1;
          overflow: visible;
        }

        .nav-collapse.open { display: flex; }

        .nav-list-main,
        .nav-list-right {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          gap: 0.6rem;
          align-items: center;
        }

        .nav-list-main { flex-wrap: nowrap; }
        .nav-list-right { margin-left: 1rem; align-items: center; }

        .nav-item { display: inline-flex; }

        .nav-link {
          color: #f0f0f0;
          text-decoration: none;
          font-size: 0.95rem;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          transition: all 0.22s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          white-space: nowrap;
          background: transparent;
        }

        .nav-link:hover,
        .nav-link.hovered {
          background-color: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          transform: translateY(-2px);
        }

        .btnAuth { border: 1px solid rgba(255,255,255,0.06); }

        /* =========================================
           4. USUARIO Y CERRAR SESIÓN (Ajustado)
           ========================================= */
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          border-left: 1px solid rgba(255,255,255,0.06);
          padding-left: 0.8rem;
          white-space: nowrap;
        }

        .welcomeText {
          padding: 0.3rem 0.6rem;
          border-radius: 12px;
          font-weight: 600;
          color: #fff;
          background: rgba(255,255,255,0.02);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          max-width: 320px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .username-text { color: #f4e6c8; margin-left: 4px; }

        .btn-logout {
          background: none;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 0.5rem 0.8rem;
          color: #ffdede;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: transform .12s ease, background .12s ease;
        }
        .btn-logout:hover, .btn-logout.hover {
          background-color: #c9302c;
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(0,0,0,0.18);
        }

        .nav-list-right, .user-list-item { z-index: 2100; }

        /* =========================================
           5. DROPDOWNS / MEGAMENU (base)
           ========================================= */
        .dropdown { position: relative; }
        .dropdown-panel, .mega-menu { display: none; }

        /* =========================================
           6. ANIMACIONES
           ========================================= */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* =========================================
           7. RESPONSIVE
           ========================================= */
        .navbar-toggler-custom {
          display: none;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.06);
          color: #fff;
          padding: 0.4rem 0.6rem;
          border-radius: 8px;
          cursor: pointer;
        }

        @media (max-width: 992px) {
          .container-fluid { padding: 0.5rem 0.8rem; }
          .navbar-toggler-custom { display: inline-flex; margin-left: auto; }
          .nav-collapse { display: none; position: absolute; top: var(--header-height, 100px); right: 1rem; left: 1rem; background: #2f4858; border-radius: 8px; padding: 0.75rem; flex-direction: column; gap: 0.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.22); z-index: 2001; }
          .nav-collapse.open { display: flex; }
          .nav-list-main, .nav-list-right { flex-direction: column; gap: 0.5rem; }
          .nav-link { padding: 0.6rem 0.75rem; }
          .user-info { border-left: none; padding-left: 0; }
          .welcomeText { max-width: 100%; }
          .logo-img { width: 44px; height: 44px; }
        }

        /* seguridad visual: evita que contenido se pegue al header */
        html { scroll-padding-top: var(--header-height, 100px); }
      `}</style>
    </header>
  );
};

export default HeaderComponent;
