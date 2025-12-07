import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getUsuarioLogueado, logout } from "../services/AuthService";

export const HeaderComponent = () => {
  const [usuario, setUsuario] = useState(getUsuarioLogueado());
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [adminOpen, setAdminOpen] = useState(false); // admin dropdown
  const adminRef = useRef(null);

  useEffect(() => {
    const handler = () => setUsuario(getUsuarioLogueado());
    window.addEventListener("authChange", handler);
    return () => window.removeEventListener("authChange", handler);
  }, []);

  // cerrar el dropdown de admin al hacer clic fuera
  useEffect(() => {
    const onClickOutside = (e) => {
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setAdminOpen(false);
      }
    };
    if (adminOpen) document.addEventListener("mousedown", onClickOutside);
    else document.removeEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [adminOpen]);

  const rol = usuario?.perfil;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleAdmin = () => setAdminOpen((s) => !s);

  return (
    <>
      <style>{`
        /* ---------- HEADER BASE ---------- */
        .main-header {
          background-color: #2f4858;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          font-family: Arial, Helvetica, sans-serif;
          color: #f1f1f1;
        }

        .container-fluid {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.8rem 1rem;
          box-sizing: border-box;
        }

        /* logo */
        .logo-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #c29c5e;
          font-weight: 700;
          font-family: Georgia, serif;
          font-size: 1.4rem;
        }

        .logo-img {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
        }

        /* navegación principal */
        .nav-root { flex: 1; display: flex; justify-content: center; }
        .nav-collapse {
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: center;
        }

        .nav-list-main {
          display: flex;
          gap: 0.6rem;
          align-items: center;
          flex-wrap: wrap; /* permite que las opciones "salten" a la siguiente línea si hay muchas */
          justify-content: center;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .nav-item { display: inline-flex; }
        .nav-link {
          display: inline-block;
          padding: 0.45rem 0.9rem;
          text-decoration: none;
          color: #eef3f4;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: background 0.18s, transform 0.18s;
          white-space: nowrap;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.06);
          transform: translateY(-2px);
        }

        /* zona derecha (login / user) */
        .nav-list-right {
          display: flex;
          gap: 0.8rem;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .btn-plain {
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          border: 1px solid transparent;
          background: transparent;
          color: #fff;
          cursor: pointer;
          font-weight: 600;
        }

        .btn-cta {
          background: #c75f54;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
        }
        .btn-cta:hover { transform: translateY(-2px); }

        /* ADMIN DROPDOWN */
        .admin-button {
          position: relative;
        }

        .admin-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #2b3f47;
          border-radius: 8px;
          padding: 0.5rem;
          box-shadow: 0 10px 30px rgba(15,15,15,0.35);
          min-width: 240px;
          z-index: 3000;
        }

        .admin-dropdown ul {
          list-style: none;
          padding: 0.4rem;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.35rem;
        }

        .admin-dropdown a {
          display: block;
          padding: 0.5rem 0.7rem;
          text-decoration: none;
          color: #eef3f4;
          border-radius: 6px;
          font-weight: 600;
        }
        .admin-dropdown a:hover {
          background: rgba(255,255,255,0.04);
        }

        .admin-dropdown .logout-row {
          margin-top: 0.4rem;
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        /* BOTÓN HAMBURGUESA (móvil) */
        .navbar-toggler-custom {
          display: none;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.14);
          color: #fff;
          padding: 0.45rem 0.6rem;
          border-radius: 6px;
          cursor: pointer;
        }

        /* ajustes globales para no superponer contenido bajo header */
        body { padding-top: 86px; }

        /* RESPONSIVE */
        @media (max-width: 992px) {
          .nav-root { justify-content: flex-end; }
          .nav-collapse { flex-direction: column; align-items: stretch; gap: 0.6rem; }
          .nav-list-main { justify-content: flex-start; padding-left: 0.4rem; }
          .navbar-toggler-custom { display: inline-flex; }

          /* cuando está cerrado el menu, lo ocultamos con clases dinámicas en JSX */
          .nav-collapse.mobile-hidden { display: none; }

          .admin-dropdown { right: 1rem; left: 1rem; }
        }

        /* ajustes visuales menores */
        .welcomeText {
          padding: 0.45rem 0.8rem;
          border-radius: 8px;
          background: rgba(255,255,255,0.03);
          color: #f5f3ea;
          font-weight: 600;
        }

      `}</style>

      <header className="main-header">
        <div className="container-fluid">
          {/* LOGO */}
          <Link to="/" className="logo-link" aria-label="Inicio">
            <img src="/logo.png" alt="logo" className="logo-img" />
            <span>Café del Sol</span>
          </Link>

          {/* BOTON HAMBURGUESA (solo visible small) */}
          <button
            className="navbar-toggler-custom"
            onClick={toggleMenu}
            aria-label="Abrir menú"
          >
            ☰
          </button>

          {/* NAVEGACIÓN */}
          <nav className="nav-root" role="navigation" aria-label="Menú principal">
            <div className={`nav-collapse ${menuOpen ? "" : "mobile-hidden"}`}>

              <ul className="nav-list-main" role="menubar">
                <li className="nav-item" role="none">
                  <Link className="nav-link" to="/" role="menuitem">Inicio</Link>
                </li>

                {rol === "cliente" && (
                  <li className="nav-item"><Link className="nav-link" to="/reserva/lista">Mis Reservas</Link></li>
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

                {/* ADMIN: un único botón que abre un dropdown con las opciones */}
                {rol === "administrador" && (
                  <li className="nav-item admin-button" ref={adminRef}>
                    <button
                      onClick={toggleAdmin}
                      className="nav-link btn-plain"
                      aria-expanded={adminOpen}
                      aria-haspopup="true"
                    >
                      Administración
                    </button>

                    {adminOpen && (
                      <div className="admin-dropdown" role="menu" aria-label="Panel de administración">
                        <ul>
                          <li><Link to="/usuarios/lista">Usuarios</Link></li>
                          <li><Link to="/cliente/lista">Clientes</Link></li>
                          <li><Link to="/empleado/lista">Empleados</Link></li>
                          <li><Link to="/mesa/lista">Mesas</Link></li>
                          <li><Link to="/tipoProducto/lista">Tipos de productos</Link></li>
                          <li><Link to="/producto/lista">Productos</Link></li>
                          <li><Link to="/reserva/lista">Reservas</Link></li>
                          <li><Link to="/venta/lista">Ventas</Link></li>
                        </ul>

                        <div className="logout-row">
                          <button
                            onClick={() => { setAdminOpen(false); logout(); }}
                            className="btn-cta"
                          >
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                )}

              </ul>

            </div>
          </nav>

          {/* ZONA DERECHA: si no hay usuario --> mostrar links de login/registro.
              Si hay usuario y no es admin (o incluso si es admin), se muestra un saludo compacto. */}
          <ul className="nav-list-right" aria-hidden={false}>
            {!usuario ? (
              <>
                <li><Link className="nav-link" to="/login">Iniciar sesión</Link></li>
                <li><Link className="nav-link" to="/usuarios/crear">Registrarse</Link></li>
              </>
            ) : (
              <>
                {/* Si quieres que el admin también tenga aquí algo, lo dejamos simple */}
                <li>
                  <div className="welcomeText" title={`Conectado como ${usuario.nombre}`}>
                    {usuario.nombre}
                  </div>
                </li>

                {/* En caso de que quieras un botón de logout rápido visible para todos */}
                {rol !== "administrador" && (
                  <li>
                    <button
                      onClick={logout}
                      className="btn-cta"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                )}
                {/* Nota: para el administrador el botón de cerrar sesión está dentro del dropdown como pediste */}
              </>
            )}
          </ul>
        </div>
      </header>
    </>
  );
};
