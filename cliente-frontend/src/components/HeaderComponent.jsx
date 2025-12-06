import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsuarioLogueado, logout } from "../services/AuthService";

export const HeaderComponent = () => {
  const [usuario, setUsuario] = useState(getUsuarioLogueado());
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const handler = () => setUsuario(getUsuarioLogueado());
    window.addEventListener("authChange", handler);
    return () => window.removeEventListener("authChange", handler);
  }, []);

  const rol = usuario?.perfil;

  // Estilos mejorados
  const estilos = {
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    navbar: {
      backgroundColor: '#75421e',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '80px'
    },
    containerFluid: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      cursor: 'pointer'
    },
    logo: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: '3px solid #f5a540',
      padding: '4px',
      backgroundColor: '#fff',
      transition: 'transform 0.3s ease'
    },
    brandText: {
      fontFamily: 'Georgia, serif',
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#fbd46d',
      margin: 0,
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    },
    navbarToggler: {
      display: 'none',
      backgroundColor: 'transparent',
      border: '2px solid #fbd46d',
      borderRadius: '6px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      color: '#fbd46d',
      fontSize: '1.5rem'
    },
    navCollapse: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      flex: 1,
      justifyContent: 'space-between'
    },
    navList: {
      display: 'flex',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    navListCenter: {
      display: 'flex',
      listStyle: 'none',
      margin: '0 auto',
      padding: 0,
      gap: '0.5rem',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    navItem: {
      position: 'relative'
    },
    navLink: {
      color: '#fff',
      textDecoration: 'none',
      padding: '0.6rem 1rem',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.95rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
      backgroundColor: 'transparent'
    },
    navLinkHover: {
      backgroundColor: 'rgba(251, 212, 109, 0.2)',
      color: '#fbd46d',
      transform: 'translateY(-2px)'
    },
    userContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      borderLeft: '2px solid rgba(251, 212, 109, 0.3)',
      paddingLeft: '1.5rem',
      marginLeft: '1rem'
    },
    welcomeText: {
      color: '#fbd46d',
      fontWeight: 'bold',
      fontSize: '0.95rem',
      margin: 0,
      whiteSpace: 'nowrap'
    },
    btnLogout: {
      backgroundColor: '#d9534f',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.6rem 1.2rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap'
    },
    btnAuth: {
      backgroundColor: 'rgba(245, 165, 64, 0.2)',
      color: '#fbd46d',
      border: '2px solid #f5a540',
      borderRadius: '6px',
      padding: '0.5rem 1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '0.9rem',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap'
    },
    // Responsive
    '@media (max-width: 992px)': {
      navbarToggler: {
        display: 'block'
      }
    }
  };

  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const handleMouseEnter = (index) => setHoveredLink(index);
  const handleMouseLeave = () => setHoveredLink(null);

  return (
    <header style={estilos.header}>
      <nav style={estilos.navbar}>
        <div style={estilos.containerFluid}>

          {/* LOGO */}
          <div style={estilos.logoContainer}>
            <img 
              src="/logo.png" 
              style={estilos.logo}
              alt="Logo"
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(360deg) scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
            />
            <span style={estilos.brandText}>El Café</span>
          </div>

          {/* Botón hamburguesa (móvil) */}
          <button 
            style={estilos.navbarToggler}
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="navbar-toggler-custom"
          >
            ☰
          </button>

          {/* Menú de navegación */}
          <div style={{
            ...estilos.navCollapse,
            display: window.innerWidth <= 992 && !menuAbierto ? 'none' : 'flex'
          }}>

            <ul style={estilos.navListCenter}>

              <li style={estilos.navItem}>
                <Link 
                  style={{
                    ...estilos.navLink,
                    ...(hoveredLink === 'inicio' ? estilos.navLinkHover : {})
                  }}
                  to="/"
                  onMouseEnter={() => handleMouseEnter('inicio')}
                  onMouseLeave={handleMouseLeave}
                >
                  🏠 Inicio
                </Link>
              </li>

              {/* CLIENTE */}
              {rol === "cliente" && (
                <li style={estilos.navItem}>
                  <Link 
                    style={{
                      ...estilos.navLink,
                      ...(hoveredLink === 'reservas' ? estilos.navLinkHover : {})
                    }}
                    to="/reserva/lista"
                    onMouseEnter={() => handleMouseEnter('reservas')}
                    onMouseLeave={handleMouseLeave}
                  >
                    📅 Mis Reservas
                  </Link>
                </li>
              )}

              {/* MESERO */}
              {rol === "mesero" && (
                <li style={estilos.navItem}>
                  <Link 
                    style={{
                      ...estilos.navLink,
                      ...(hoveredLink === 'ventas' ? estilos.navLinkHover : {})
                    }}
                    to="/venta/lista"
                    onMouseEnter={() => handleMouseEnter('ventas')}
                    onMouseLeave={handleMouseLeave}
                  >
                    📊 Ventas
                  </Link>
                </li>
              )}

              {/* CAJERO */}
              {rol === "cajero" && (
                <>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'clientes' ? estilos.navLinkHover : {})
                      }}
                      to="/cliente/lista"
                      onMouseEnter={() => handleMouseEnter('clientes')}
                      onMouseLeave={handleMouseLeave}
                    >
                      👥 Clientes
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'reservas-c' ? estilos.navLinkHover : {})
                      }}
                      to="/reserva/lista"
                      onMouseEnter={() => handleMouseEnter('reservas-c')}
                      onMouseLeave={handleMouseLeave}
                    >
                      📅 Reservas
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'ventas-c' ? estilos.navLinkHover : {})
                      }}
                      to="/venta/lista"
                      onMouseEnter={() => handleMouseEnter('ventas-c')}
                      onMouseLeave={handleMouseLeave}
                    >
                      📊 Ventas
                    </Link>
                  </li>
                </>
              )}

              {/* SUPERVISOR */}
              {rol === "supervisor" && (
                <>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'usuarios' ? estilos.navLinkHover : {})
                      }}
                      to="/usuarios/lista"
                      onMouseEnter={() => handleMouseEnter('usuarios')}
                      onMouseLeave={handleMouseLeave}
                    >
                      👤 Usuarios
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'empleados' ? estilos.navLinkHover : {})
                      }}
                      to="/empleado/lista"
                      onMouseEnter={() => handleMouseEnter('empleados')}
                      onMouseLeave={handleMouseLeave}
                    >
                      👨‍💼 Empleados
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'clientes-s' ? estilos.navLinkHover : {})
                      }}
                      to="/cliente/lista"
                      onMouseEnter={() => handleMouseEnter('clientes-s')}
                      onMouseLeave={handleMouseLeave}
                    >
                      👥 Clientes
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'productos' ? estilos.navLinkHover : {})
                      }}
                      to="/producto/lista"
                      onMouseEnter={() => handleMouseEnter('productos')}
                      onMouseLeave={handleMouseLeave}
                    >
                      🍽️ Productos
                    </Link>
                  </li>
                </>
              )}

              {/* ADMINISTRADOR */}
              {rol === "administrador" && (
                <>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'usuarios-a' ? estilos.navLinkHover : {})
                      }}
                      to="/usuarios/lista"
                      onMouseEnter={() => handleMouseEnter('usuarios-a')}
                      onMouseLeave={handleMouseLeave}
                    >
                      👤 Usuarios
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'clientes-a' ? estilos.navLinkHover : {})
                      }}
                      to="/cliente/lista"
                      onMouseEnter={() => handleMouseEnter('clientes-a')}
                      onMouseLeave={handleMouseLeave}
                    >
                      👥 Clientes
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'empleados-a' ? estilos.navLinkHover : {})
                      }}
                      to="/empleado/lista"
                      onMouseEnter={() => handleMouseEnter('empleados-a')}
                      onMouseLeave={handleMouseLeave}
                    >
                      👨‍💼 Empleados
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'mesas' ? estilos.navLinkHover : {})
                      }}
                      to="/mesa/lista"
                      onMouseEnter={() => handleMouseEnter('mesas')}
                      onMouseLeave={handleMouseLeave}
                    >
                      📍 Mesas
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'tipos' ? estilos.navLinkHover : {})
                      }}
                      to="/tipoProducto/lista"
                      onMouseEnter={() => handleMouseEnter('tipos')}
                      onMouseLeave={handleMouseLeave}
                    >
                      🏷️ Tipos
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'productos-a' ? estilos.navLinkHover : {})
                      }}
                      to="/producto/lista"
                      onMouseEnter={() => handleMouseEnter('productos-a')}
                      onMouseLeave={handleMouseLeave}
                    >
                      🍽️ Productos
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'reservas-a' ? estilos.navLinkHover : {})
                      }}
                      to="/reserva/lista"
                      onMouseEnter={() => handleMouseEnter('reservas-a')}
                      onMouseLeave={handleMouseLeave}
                    >
                      📅 Reservas
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.navLink,
                        ...(hoveredLink === 'ventas-a' ? estilos.navLinkHover : {})
                      }}
                      to="/venta/lista"
                      onMouseEnter={() => handleMouseEnter('ventas-a')}
                      onMouseLeave={handleMouseLeave}
                    >
                      📊 Ventas
                    </Link>
                  </li>
                </>
              )}

            </ul>

            {/* ZONA DERECHA - Usuario o Login */}
            <ul style={estilos.navList}>

              {!usuario && (
                <>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.btnAuth,
                        ...(hoveredLink === 'login' ? { backgroundColor: 'rgba(245, 165, 64, 0.4)', transform: 'translateY(-2px)' } : {})
                      }}
                      to="/login"
                      onMouseEnter={() => handleMouseEnter('login')}
                      onMouseLeave={handleMouseLeave}
                    >
                      🔐 Iniciar sesión
                    </Link>
                  </li>
                  <li style={estilos.navItem}>
                    <Link 
                      style={{
                        ...estilos.btnAuth,
                        ...(hoveredLink === 'registro' ? { backgroundColor: 'rgba(245, 165, 64, 0.4)', transform: 'translateY(-2px)' } : {})
                      }}
                      to="/usuarios/crear"
                      onMouseEnter={() => handleMouseEnter('registro')}
                      onMouseLeave={handleMouseLeave}
                    >
                      ➕ Registrarse
                    </Link>
                  </li>
                </>
              )}

              {usuario && (
                <div style={estilos.userContainer}>
                  <span style={estilos.welcomeText}>
                    🤗 Bienvenido {usuario.nombre}
                  </span>
                  <button
                    onClick={logout}
                    style={{
                      ...estilos.btnLogout,
                      ...(hoveredBtn ? { backgroundColor: '#c9302c', transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' } : {})
                    }}
                    onMouseEnter={() => setHoveredBtn(true)}
                    onMouseLeave={() => setHoveredBtn(false)}
                  >
                    ⚡ Cerrar sesión
                  </button>
                </div>
              )}

            </ul>

          </div>
        </div>
      </nav>

      {/* Estilos CSS adicionales para responsive */}
      <style>{`
        @media (max-width: 992px) {
          .navbar-toggler-custom {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};