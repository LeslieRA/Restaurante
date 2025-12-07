import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsuarioLogueado, logout } from "../services/AuthService";

export const HeaderComponent = () => {
  const [usuario, setUsuario] = useState(getUsuarioLogueado());
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  useEffect(() => {
    const handler = () => setUsuario(getUsuarioLogueado());
    window.addEventListener("authChange", handler);
    return () => window.removeEventListener("authChange", handler);
  }, []);

  const rol = usuario?.perfil;

  const handleMouseEnter = (index) => setHoveredLink(index);
  const handleMouseLeave = () => setHoveredLink(null);

  return (
    <header className="main-header">
      <nav>
        <div className="container-fluid" style={{display: 'flex', alignItems: 'center', width: '100%'}}>

          {/* LOGO */}
          <div className="logo" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Link to="/" className="logo-link" style={{display:'flex', alignItems:'center', gap:'8px', textDecoration:'none'}}>
              <img
                src="/logo.png"
                alt="Logo"
                style={{
                  width: 52,
                  height: 52,
                  objectFit: "cover",
                  transition: "transform 0.6s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(360deg) scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0deg) scale(1)")}
              />
              <span className="brandText" style={{fontFamily: "'Georgia', serif", color: '#c29c5e', fontSize: '1.6rem', fontWeight: 'bold'}}>El Café</span>
            </Link>
          </div>

          {/* Espaciador para que la navegación llegue a la derecha */}
          <div style={{flex: 1}} />

          {/* Botón hamburguesa (móvil) */}
          <button
            className="navbar-toggler-custom"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Alternar navegación"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.4rem',
              cursor: 'pointer',
              display: 'none' // se activa via media query en CSS
            }}
          >
            ☰
          </button>

          {/* Menú de navegación */}
          <div className={`nav-collapse ${menuAbierto ? "open" : ""}`}>

            <ul className="nav-list-main" style={{display: 'flex', gap: '0.5rem', alignItems: 'center', margin: 0, padding: 0}}>
              <li>
                <Link
                  to="/"
                  className="nav-link"
                  onMouseEnter={() => handleMouseEnter('inicio')}
                  onMouseLeave={handleMouseLeave}
                  style={ hoveredLink === 'inicio' ? { backgroundColor: 'rgba(255,255,255,0.08)'} : {} }
                >
                  🏠 Inicio
                </Link>
              </li>

              {rol === "cliente" && (
                <li>
                  <Link
                    to="/reserva/lista"
                    className="nav-link"
                    onMouseEnter={() => handleMouseEnter('reservas')}
                    onMouseLeave={handleMouseLeave}
                    style={ hoveredLink === 'reservas' ? { backgroundColor: 'rgba(255,255,255,0.08)'} : {} }
                  >
                    📅 Mis Reservas
                  </Link>
                </li>
              )}

              {rol === "mesero" && (
                <li>
                  <Link
                    to="/venta/lista"
                    className="nav-link"
                    onMouseEnter={() => handleMouseEnter('ventas')}
                    onMouseLeave={handleMouseLeave}
                    style={ hoveredLink === 'ventas' ? { backgroundColor: 'rgba(255,255,255,0.08)'} : {} }
                  >
                    📊 Ventas
                  </Link>
                </li>
              )}

              {rol === "cajero" && (
                <>
                  <li>
                    <Link to="/cliente/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('clientes')} onMouseLeave={handleMouseLeave}>👥 Clientes</Link>
                  </li>
                  <li>
                    <Link to="/reserva/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('reservas-c')} onMouseLeave={handleMouseLeave}>📅 Reservas</Link>
                  </li>
                  <li>
                    <Link to="/venta/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('ventas-c')} onMouseLeave={handleMouseLeave}>📊 Ventas</Link>
                  </li>
                </>
              )}

              {rol === "supervisor" && (
                <>
                  <li><Link to="/usuarios/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('usuarios')} onMouseLeave={handleMouseLeave}>👤 Usuarios</Link></li>
                  <li><Link to="/empleado/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('empleados')} onMouseLeave={handleMouseLeave}>👨‍💼 Empleados</Link></li>
                  <li><Link to="/cliente/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('clientes-s')} onMouseLeave={handleMouseLeave}>👥 Clientes</Link></li>
                  <li><Link to="/producto/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('productos')} onMouseLeave={handleMouseLeave}>🍽️ Productos</Link></li>
                </>
              )}

              {rol === "administrador" && (
                <>
                  <li><Link to="/usuarios/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('usuarios-a')} onMouseLeave={handleMouseLeave}>👤 Usuarios</Link></li>
                  <li><Link to="/cliente/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('clientes-a')} onMouseLeave={handleMouseLeave}>👥 Clientes</Link></li>
                  <li><Link to="/empleado/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('empleados-a')} onMouseLeave={handleMouseLeave}>👨‍💼 Empleados</Link></li>
                  <li><Link to="/mesa/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('mesas')} onMouseLeave={handleMouseLeave}>📍 Mesas</Link></li>
                  <li><Link to="/tipoProducto/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('tipos')} onMouseLeave={handleMouseLeave}>🏷️ Tipos</Link></li>
                  <li><Link to="/producto/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('productos-a')} onMouseLeave={handleMouseLeave}>🍽️ Productos</Link></li>
                  <li><Link to="/reserva/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('reservas-a')} onMouseLeave={handleMouseLeave}>📅 Reservas</Link></li>
                  <li><Link to="/venta/lista" className="nav-link" onMouseEnter={() => handleMouseEnter('ventas-a')} onMouseLeave={handleMouseLeave}>📊 Ventas</Link></li>
                </>
              )}
            </ul>

            {/* ZONA DERECHA - Usuario o Login */}
            <ul className="nav-list-right" style={{display: 'flex', gap: '0.5rem', alignItems: 'center', margin: 0, padding: 0, marginLeft: '1rem'}}>

              {!usuario && (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="nav-link"
                      onMouseEnter={() => handleMouseEnter('login')}
                      onMouseLeave={handleMouseLeave}
                      style={ hoveredLink === 'login' ? { backgroundColor: 'rgba(245, 165, 64, 0.4)', transform: 'translateY(-2px)'} : {} }
                    >
                      🔐 Iniciar sesión
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/usuarios/crear"
                      className="nav-link"
                      onMouseEnter={() => handleMouseEnter('registro')}
                      onMouseLeave={handleMouseLeave}
                      style={ hoveredLink === 'registro' ? { backgroundColor: 'rgba(245, 165, 64, 0.4)', transform: 'translateY(-2px)'} : {} }
                    >
                      ➕ Registrarse
                    </Link>
                  </li>
                </>
              )}

              {usuario && (
                <li style={{listStyle: 'none'}}>
                  <div className="user-info" style={{display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative'}}>
                    <span style={{padding: '0.4rem 0.6rem', borderRadius: '12px', fontWeight:'600', color:'#fff', background:'rgba(255,255,255,0.03)'}}>🤗 Bienvenido {usuario.nombre}</span>
                    <button
                      onClick={logout}
                      className="btn-logout"
                      onMouseEnter={() => setHoveredBtn(true)}
                      onMouseLeave={() => setHoveredBtn(false)}
                      style={ hoveredBtn ? { backgroundColor: '#c9302c', color: '#fff' } : {} }
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

      {/* Inyectamos el CSS que nos diste, adaptado a las clases/estructura usadas */}
      <style>{`
        /* =========================================
           1. ESTILOS BASE DEL HEADER
           ========================================= */
        .main-header {
          background-color: #2f4858; /* Azul oscuro elegante */
          height: 100px; /* Altura fija para mantener el orden */
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between; /* Separa Logo de la Navegación */
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: 'Arial', sans-serif;
        }

        /* simple container use */
        .container-fluid { width: 100%; display: flex; align-items: center; gap: 1rem; }

        /* =========================================
           2. LOGOTIPO
           ========================================= */
        .logo a,
        .logo-link {
          color: #c29c5e; /* Dorado/Café claro */
          text-decoration: none;
          font-size: 1.6rem;
          font-weight: bold;
          font-family: 'Georgia', serif;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        /* =========================================
           3. NAVEGACIÓN PRINCIPAL
           ========================================= */
        nav { flex-grow: 1; display: flex; align-items: center; justify-content: flex-end; }

        .nav-collapse {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-collapse.open { display: flex; }

        .nav-list-main,
        .nav-list-right {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .nav-link {
          color: #f0f0f0;
          text-decoration: none;
          font-size: 0.95rem;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          white-space: nowrap;
          background: transparent;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        /* =========================================
           4. SISTEMA DE DROPDOWNS (solo estilos de base para futuro uso)
           ========================================= */
        .dropdown {
          position: relative;
        }

        .dropdown-panel,
        .mega-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%); /* Centrado perfecto */
          background-color: #ffffff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 1.5rem;
          z-index: 1001;
          border-top: 4px solid #c29c5e; /* Línea de color superior */
          min-width: 240px;
          margin-top: 10px; /* Separación visual del header */
        }

        .dropdown-panel::after,
        .mega-menu::after,
        .user-info .dropdown-menu::after {
          content: '';
          position: absolute;
          top: -15px;
          left: 0;
          width: 100%;
          height: 20px;
          background: transparent;
        }

        .dropdown-panel::before,
        .mega-menu::before {
          content: "";
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 0 8px 8px 8px;
          border-style: solid;
          border-color: transparent transparent #c29c5e transparent;
        }

        .dropdown:hover .dropdown-panel,
        .dropdown:hover .mega-menu {
          display: flex;
          flex-direction: row;
          animation: fadeIn 0.2s ease-in-out;
        }

        .mega-menu {
          width: max-content;
          gap: 2rem;
        }

        .mega-menu-column h3 {
          font-size: 0.9rem;
          color: #888;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .mega-menu-column ul,
        .dropdown-panel ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .mega-menu-column a,
        .dropdown-panel a {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.6rem 0.8rem;
          color: #2f4858;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.2s;
          font-size: 0.95rem;
          white-space: nowrap;
        }

        .mega-menu-column a:hover,
        .dropdown-panel a:hover {
          background-color: #f4f1ea; /* Fondo beige suave */
          color: #c29c5e;
          transform: translateX(5px);
        }

        /* =========================================
           5. USUARIO Y CERRAR SESIÓN (Ajustado)
           ========================================= */
        .user-info {
          margin-left: 1rem;
          border-left: 1px solid rgba(255,255,255,0.2); /* Separador visual */
          padding-left: 1rem;
        }

        .user-info > a {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem !important;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.2);
          font-weight: bold;
        }

        .user-info > a:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .user-info .dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          left: auto;
          transform: none;
          background-color: white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          padding: 0.5rem;
          z-index: 1001;
          min-width: 200px;
          margin-top: 12px;
          border-top: 4px solid #d9534f;
        }

        .user-info .dropdown-menu::before {
          content: "";
          position: absolute;
          top: -12px;
          right: 20px;
          left: auto;
          transform: none;
          border-width: 0 8px 8px 8px;
          border-style: solid;
          border-color: transparent transparent #d9534f transparent;
        }

        .user-info:hover .dropdown-menu {
          display: block;
          animation: fadeIn 0.2s ease-in-out;
        }

        .btn-logout {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 0.8rem 1rem;
          color: #d9534f;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: background 0.2s, transform 0.12s;
        }

        .btn-logout:hover {
          background-color: #fff0f0;
        }

        /* =========================================
           6. ANIMACIONES
           ========================================= */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive: esconder el menú y mostrar hamburguesa en pantallas pequeñas */
        .navbar-toggler-custom { display: none; }
        @media (max-width: 992px) {
          .navbar-toggler-custom { display: block !important; }
          .nav-collapse { display: none; position: absolute; top: 100%; right: 1rem; left: 1rem; background: #2f4858; border-radius: 8px; padding: 1rem; flex-direction: column; gap: 0.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 1002; }
          .nav-collapse.open { display: flex; }
          .nav-list-main, .nav-list-right { flex-direction: column; gap: 0.25rem; }
          .main-header { height: auto; padding: 0.75rem 1rem; }
        }
      `}</style>
    </header>
  );
};

export default HeaderComponent;