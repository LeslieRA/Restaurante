import React, { useState } from "react";
import { login } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Estilos elegantes
  const estilos = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2f4858 0%, #899458 50%, #578661 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      opacity: 0.3
    },
    container: {
      maxWidth: '480px',
      width: '100%',
      position: 'relative',
      zIndex: 1
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '25px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      border: '4px solid #c29c5e',
      overflow: 'hidden',
      animation: 'slideIn 0.6s ease-out'
    },
    header: {
      background: 'linear-gradient(135deg, #2f4858 0%, #899458 100%)',
      padding: '3rem 2rem',
      textAlign: 'center',
      position: 'relative'
    },
    logoContainer: {
      width: '100px',
      height: '100px',
      backgroundColor: 'white',
      borderRadius: '50%',
      margin: '0 auto 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
      border: '4px solid #c29c5e'
    },
    logo: {
      fontSize: '3.5rem'
    },
    title: {
      color: 'white',
      fontSize: '2.2rem',
      fontWeight: 'bold',
      fontFamily: 'Georgia, serif',
      margin: '0 0 0.5rem 0',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    },
    subtitle: {
      color: '#f5f5dc',
      fontSize: '1rem',
      margin: 0
    },
    formBody: {
      padding: '2.5rem 2rem'
    },
    welcomeText: {
      textAlign: 'center',
      color: '#2f4858',
      fontSize: '1.1rem',
      marginBottom: '2rem',
      fontWeight: '500'
    },
    formGroup: {
      marginBottom: '1.8rem',
      position: 'relative'
    },
    label: {
      display: 'block',
      color: '#2f4858',
      fontSize: '0.95rem',
      fontWeight: '600',
      marginBottom: '0.6rem',
      fontFamily: 'Georgia, serif'
    },
    inputWrapper: {
      position: 'relative'
    },
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '1.2rem',
      color: '#899458',
      zIndex: 1
    },
    input: {
      width: '100%',
      padding: '1rem 1rem 1rem 3rem',
      border: '2px solid #e0ddd0',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: 'white',
      boxSizing: 'border-box'
    },
    inputFocused: {
      borderColor: '#c29c5e',
      boxShadow: '0 0 0 4px rgba(194, 156, 94, 0.15)',
      transform: 'translateY(-2px)'
    },
    togglePassword: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.2rem',
      color: '#899458',
      padding: '0.5rem',
      zIndex: 2
    },
    errorAlert: {
      backgroundColor: '#fff5f5',
      border: '2px solid #c0615f',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
      animation: 'shake 0.5s ease-out'
    },
    errorIcon: {
      fontSize: '1.5rem'
    },
    errorText: {
      color: '#c0615f',
      margin: 0,
      fontWeight: '500',
      fontSize: '0.95rem'
    },
    btnPrimary: {
      width: '100%',
      backgroundColor: '#c29c5e',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '1rem',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(194, 156, 94, 0.4)',
      marginTop: '1rem'
    },
    footer: {
      textAlign: 'center',
      padding: '1.5rem',
      borderTop: '2px solid #f5f5dc',
      backgroundColor: '#fafaf8'
    },
    footerText: {
      color: '#666',
      fontSize: '0.9rem',
      margin: 0
    },
    link: {
      color: '#c29c5e',
      textDecoration: 'none',
      fontWeight: 'bold',
      cursor: 'pointer'
    }
  };

  const iniciarSesion = (e) => {
    e.preventDefault();
    setErrorMsg("");

    login({ username, password })
      .then((usuario) => {
        console.log("Usuario logueado:", usuario);
        
        if (usuario.estatus === 0) {
          setErrorMsg("⚠️ Tu cuenta está suspendida. Contacta al administrador.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("usuario");
          return;
        }
        
        navigate("/");
      })
      .catch((err) => {
        const msg = err.response?.data;
        if (msg?.includes("inactivo")) {
          setErrorMsg("⚠️ Tu cuenta está suspendida");
        } else if (msg?.includes("no encontrado")) {
          setErrorMsg("❌ El usuario no existe");
        } else if (msg?.includes("incorrecta")) {
          setErrorMsg("🔒 La contraseña es incorrecta");
        } else {
          setErrorMsg("⚠️ Usuario o contraseña incorrectos");
        }
      });
  };

  const getInputStyle = (field) => {
    const baseStyle = { ...estilos.input };
    
    if (focusedField === field) {
      return { ...baseStyle, ...estilos.inputFocused };
    }
    
    return baseStyle;
  };

  return (
    <div style={estilos.pageContainer}>
      <div style={estilos.backgroundPattern}></div>
      
      <div style={estilos.container}>
        <div style={estilos.card}>
          {/* Header */}
          <div style={estilos.header}>
            <div style={estilos.logoContainer}>
              <div style={estilos.logo}>☕</div>
            </div>
            <h2 style={estilos.title}>El Café Elegante</h2>
            <p style={estilos.subtitle}>Sistema de Gestión</p>
          </div>

          {/* Form Body */}
          <div style={estilos.formBody}>
            <p style={estilos.welcomeText}>
              👋 Bienvenido de vuelta
            </p>

            {/* Error Message */}
            {errorMsg && (
              <div style={estilos.errorAlert}>
                <span style={estilos.errorIcon}>⚠️</span>
                <p style={estilos.errorText}>{errorMsg}</p>
              </div>
            )}

            {/* Username */}
            <div style={estilos.formGroup}>
              <label style={estilos.label}>Usuario</label>
              <div style={estilos.inputWrapper}>
                <span style={estilos.inputIcon}>👤</span>
                <input
                  type="text"
                  style={getInputStyle('username')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ingresa tu usuario"
                />
              </div>
            </div>

            {/* Password */}
            <div style={estilos.formGroup}>
              <label style={estilos.label}>Contraseña</label>
              <div style={estilos.inputWrapper}>
                <span style={estilos.inputIcon}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  style={getInputStyle('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  style={estilos.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={estilos.btnPrimary}
              onClick={iniciarSesion}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(194, 156, 94, 0.5)';
                e.currentTarget.style.backgroundColor = '#b08a52';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(194, 156, 94, 0.4)';
                e.currentTarget.style.backgroundColor = '#c29c5e';
              }}
            >
              Iniciar Sesión →
            </button>
          </div>

          {/* Footer */}
          <div style={estilos.footer}>
            <p style={estilos.footerText}>
              ¿No tienes cuenta?{' '}
              <a 
                style={estilos.link}
                onClick={() => navigate('/register')}
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
        `}
      </style>
    </div>
  );
};