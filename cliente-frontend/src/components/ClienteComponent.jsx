import React, { useState, useEffect } from "react";
import { crearCliente, getCliente, updateCliente } from "../services/ClienteService";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { updateUsuario, deleteUsuario } from "../services/SecurityService";

export const ClienteComponent = () => {
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [correoCliente, setCorreoCliente] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const [errors, setErrors] = useState({
    nombreCliente: "",
    telefonoCliente: "",
    correoCliente: "",
  });

  const navegar = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const idUsuario = searchParams.get("idUsuario");
  const nombreFromUsuario = searchParams.get("nombre");

  // Estilos elegantes
  const estilos = {
    container: {
      maxWidth: '600px',
      margin: '3rem auto',
      padding: '0 1rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
      border: '3px solid #c29c5e',
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #2f4858 0%, #899458 100%)',
      padding: '2.5rem 2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    headerPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '30px 30px',
      opacity: 0.3
    },
    title: {
      color: 'white',
      fontSize: '2rem',
      fontWeight: 'bold',
      fontFamily: 'Georgia, serif',
      margin: 0,
      position: 'relative',
      zIndex: 1,
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    },
    subtitle: {
      color: '#f5f5dc',
      fontSize: '1rem',
      marginTop: '0.5rem',
      position: 'relative',
      zIndex: 1
    },
    formBody: {
      padding: '2.5rem 2rem'
    },
    formGroup: {
      marginBottom: '1.8rem'
    },
    label: {
      display: 'block',
      color: '#2f4858',
      fontSize: '1rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      fontFamily: 'Georgia, serif'
    },
    input: {
      width: '100%',
      padding: '0.9rem 1rem',
      border: '2px solid #e0ddd0',
      borderRadius: '10px',
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
    inputError: {
      borderColor: '#c0615f',
      backgroundColor: '#fff5f5'
    },
    inputDisabled: {
      backgroundColor: '#f5f5f5',
      cursor: 'not-allowed',
      color: '#999'
    },
    errorMessage: {
      color: '#c0615f',
      fontSize: '0.85rem',
      marginTop: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem'
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem'
    },
    btnPrimary: {
      backgroundColor: '#c29c5e',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '0.9rem 2rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 12px rgba(194, 156, 94, 0.3)'
    },
    btnSecondary: {
      backgroundColor: 'white',
      color: '#c0615f',
      border: '2px solid #c0615f',
      borderRadius: '10px',
      padding: '0.9rem 2rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    infoBox: {
      backgroundColor: '#f5f5dc',
      border: '2px solid #c29c5e',
      borderRadius: '10px',
      padding: '1rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem'
    },
    icon: {
      fontSize: '1.5rem'
    }
  };

  useEffect(() => {
    if (nombreFromUsuario) {
      setNombreCliente(nombreFromUsuario);
    }
  }, [nombreFromUsuario]);

  useEffect(() => {
    if (!id) return;

    getCliente(id)
      .then(({ data }) => {
        setNombreCliente(data.nombreCliente ?? "");
        setTelefonoCliente(data.telefonoCliente ?? "");
        setCorreoCliente(data.correoCliente ?? "");
      })
      .catch(console.error);
  }, [id]);

  function validaForm() {
    let valida = true;
    const copy = { ...errors };

    if (!nombreCliente.trim()) {
      copy.nombreCliente = "El nombre es requerido";
      valida = false;
    } else copy.nombreCliente = "";

    if (!telefonoCliente.trim()) {
      copy.telefonoCliente = "El teléfono es requerido";
      valida = false;
    } else copy.telefonoCliente = "";

    if (!correoCliente.trim()) {
      copy.correoCliente = "El correo es requerido";
      valida = false;
    } else copy.correoCliente = "";

    setErrors(copy);
    return valida;
  }

  function saveCliente(e) {
    e.preventDefault();

    if (!validaForm()) return;

    const cliente = {
      idCliente: id ? Number(id) : Number(idUsuario),
      nombreCliente,
      telefonoCliente,
      correoCliente,
    };

    const loggedUser = JSON.parse(localStorage.getItem("usuario"));

    if (id) {
      updateCliente(id, cliente)
        .then(() => {
          updateUsuario(id, { nombre: nombreCliente })
            .then(() => {
              alert("✔️ Cliente actualizado correctamente");
              navegar("/cliente/lista");
            });
        })
        .catch(console.error);
      return;
    }

    crearCliente(cliente)
      .then(() => {
        if (loggedUser) {
          alert("✔️ Cliente registrado correctamente");
          navegar("/cliente/lista");
        } else {
          alert("✔️ Registro completado. Ahora puedes iniciar sesión.");
          navegar("/login");
        }
      })
      .catch(console.error);
  }

  async function cancelar() {
    const loggedUser = JSON.parse(localStorage.getItem("usuario"));

    if (!loggedUser && idUsuario) {
      const confirmar = window.confirm(
        "No completaste tu registro, tu cuenta será eliminada. ¿Deseas cancelar?"
      );

      if (!confirmar) return;

      await deleteUsuario(idUsuario).catch(() => null);
      navegar("/");
      return;
    }

    if (loggedUser && idUsuario) {
      const confirmar = window.confirm(
        "Este usuario no ha sido registrado completamente. ¿Eliminarlo?"
      );

      if (confirmar) {
        await deleteUsuario(idUsuario).catch(() => null);
      }

      navegar("/cliente/lista");
      return;
    }

    navegar("/cliente/lista");
  }

  function pagTitulo() {
    return id ? "Modificar Cliente" : "Agregar Cliente";
  }

  const getInputStyle = (field) => {
    const baseStyle = { ...estilos.input };
    
    if (errors[field]) {
      return { ...baseStyle, ...estilos.inputError };
    }
    
    if (field === 'nombreCliente' && nombreFromUsuario) {
      return { ...baseStyle, ...estilos.inputDisabled };
    }
    
    if (focusedField === field) {
      return { ...baseStyle, ...estilos.inputFocused };
    }
    
    return baseStyle;
  };

  return (
    <div style={estilos.container}>
      <div style={estilos.card}>
        {/* Header con degradado */}
        <div style={estilos.header}>
          <div style={estilos.headerPattern}></div>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            {id ? '📝' : '👤'}
          </div>
          <h2 style={estilos.title}>{pagTitulo()}</h2>
          <p style={estilos.subtitle}>
            {id ? 'Actualiza la información del cliente' : 'Complete los datos del nuevo cliente'}
          </p>
        </div>

        {/* Cuerpo del formulario */}
        <div style={estilos.formBody}>
          {nombreFromUsuario && (
            <div style={estilos.infoBox}>
              <span style={estilos.icon}>ℹ️</span>
              <span style={{ color: '#2f4858', fontSize: '0.9rem' }}>
                El nombre proviene de tu usuario y no puede ser modificado aquí
              </span>
            </div>
          )}

          {/* Nombre */}
          <div style={estilos.formGroup}>
            <label style={estilos.label}>
              👤 Nombre del Cliente
            </label>
            <input
              type="text"
              style={getInputStyle('nombreCliente')}
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              onFocus={() => setFocusedField('nombreCliente')}
              onBlur={() => setFocusedField(null)}
              disabled={!!nombreFromUsuario}
              placeholder="Ingrese el nombre completo"
            />
            {errors.nombreCliente && (
              <div style={estilos.errorMessage}>
                <span>⚠️</span>
                <span>{errors.nombreCliente}</span>
              </div>
            )}
          </div>

          {/* Teléfono */}
          <div style={estilos.formGroup}>
            <label style={estilos.label}>
              📞 Teléfono
            </label>
            <input
              type="tel"
              style={getInputStyle('telefonoCliente')}
              value={telefonoCliente}
              onChange={(e) => setTelefonoCliente(e.target.value)}
              onFocus={() => setFocusedField('telefonoCliente')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ej: 777-123-4567"
            />
            {errors.telefonoCliente && (
              <div style={estilos.errorMessage}>
                <span>⚠️</span>
                <span>{errors.telefonoCliente}</span>
              </div>
            )}
          </div>

          {/* Correo */}
          <div style={estilos.formGroup}>
            <label style={estilos.label}>
              📧 Correo Electrónico
            </label>
            <input
              type="email"
              style={getInputStyle('correoCliente')}
              value={correoCliente}
              onChange={(e) => setCorreoCliente(e.target.value)}
              onFocus={() => setFocusedField('correoCliente')}
              onBlur={() => setFocusedField(null)}
              placeholder="correo@ejemplo.com"
            />
            {errors.correoCliente && (
              <div style={estilos.errorMessage}>
                <span>⚠️</span>
                <span>{errors.correoCliente}</span>
              </div>
            )}
          </div>

          {/* Botones */}
          <div style={estilos.buttonContainer}>
            <button
              type="submit"
              style={estilos.btnPrimary}
              onClick={saveCliente}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(194, 156, 94, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(194, 156, 94, 0.3)';
              }}
            >
              <span>{id ? '🔄' : '✅'}</span>
              <span>{id ? 'Actualizar' : 'Guardar'}</span>
            </button>

            <button
              type="button"
              style={estilos.btnSecondary}
              onClick={cancelar}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#fff5f5';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(192, 97, 95, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>❌</span>
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};