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

  // Estilos con paleta azul elegante
  const estilos = {
    container: {
      maxWidth: '600px',
      margin: '3rem auto',
      padding: '0 1rem'
    },
    formCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      border: '3px solid #c29c5e',
      padding: '2.5rem',
      position: 'relative',
      overflow: 'hidden'
    },
    decorativeBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '6px',
      background: 'linear-gradient(90deg, #2f4858 0%, #c29c5e 50%, #899458 100%)'
    },
    title: {
      fontFamily: 'Georgia, serif',
      color: '#2f4858',
      textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '2rem',
      fontWeight: 'bold',
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
    },
    fieldGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontWeight: '600',
      color: '#2f4858',
      fontSize: '0.95rem',
      marginBottom: '0.5rem',
      fontFamily: 'Arial, sans-serif'
    },
    input: {
      width: '100%',
      padding: '0.9rem 1rem',
      border: '2px solid #e0ddd0',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'Arial, sans-serif',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: 'white'
    },
    inputFocus: {
      borderColor: '#c29c5e',
      boxShadow: '0 0 0 3px rgba(194, 156, 94, 0.2)',
      backgroundColor: '#fffef8'
    },
    inputError: {
      borderColor: '#c0615f',
      backgroundColor: '#fff5f5'
    },
    inputDisabled: {
      backgroundColor: '#f5f5f5',
      color: '#999',
      cursor: 'not-allowed'
    },
    errorMessage: {
      color: '#c0615f',
      fontSize: '0.85rem',
      marginTop: '0.4rem',
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
      borderRadius: '8px',
      padding: '0.9rem 2rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 3px 10px rgba(194, 156, 94, 0.3)'
    },
    btnSecondary: {
      backgroundColor: 'white',
      color: '#2f4858',
      border: '2px solid #c29c5e',
      borderRadius: '8px',
      padding: '0.9rem 2rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    icon: {
      fontSize: '1.2rem',
      color: '#c29c5e',
      marginRight: '0.5rem'
    },
    helperText: {
      fontSize: '0.85rem',
      color: '#666',
      marginTop: '0.3rem',
      fontStyle: 'italic'
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
          alert("✔️ Cliente creado correctamente");
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
    return id ? "✏️ Modificar Cliente" : "➕ Agregar Cliente";
  }

  const getInputStyle = (fieldName) => {
    let style = { ...estilos.input };
    
    if (errors[fieldName]) {
      style = { ...style, ...estilos.inputError };
    } else if (focusedField === fieldName) {
      style = { ...style, ...estilos.inputFocus };
    }
    
    if (fieldName === 'nombreCliente' && nombreFromUsuario) {
      style = { ...style, ...estilos.inputDisabled };
    }
    
    return style;
  };

  return (
    <div style={estilos.container}>
      <div style={estilos.formCard}>
        <div style={estilos.decorativeBorder}></div>
        
        <h2 style={estilos.title}>
          {pagTitulo()}
        </h2>

        <div>
          {/* Nombre */}
          <div style={estilos.fieldGroup}>
            <label style={estilos.label}>
              <span style={estilos.icon}>👤</span>
              Nombre del Cliente
            </label>
            <input
              type="text"
              style={getInputStyle('nombreCliente')}
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              onFocus={() => setFocusedField('nombreCliente')}
              onBlur={() => setFocusedField(null)}
              disabled={!!nombreFromUsuario}
              placeholder="Ingresa el nombre completo"
            />
            {nombreFromUsuario && (
              <div style={estilos.helperText}>
                Este campo fue completado automáticamente desde el usuario
              </div>
            )}
            {errors.nombreCliente && (
              <div style={estilos.errorMessage}>
                <span>⚠️</span>
                {errors.nombreCliente}
              </div>
            )}
          </div>

          {/* Teléfono */}
          <div style={estilos.fieldGroup}>
            <label style={estilos.label}>
              <span style={estilos.icon}>📱</span>
              Teléfono
            </label>
            <input
              type="tel"
              style={getInputStyle('telefonoCliente')}
              value={telefonoCliente}
              onChange={(e) => setTelefonoCliente(e.target.value)}
              onFocus={() => setFocusedField('telefonoCliente')}
              onBlur={() => setFocusedField(null)}
              placeholder="Ej: 7771234567"
            />
            {errors.telefonoCliente && (
              <div style={estilos.errorMessage}>
                <span>⚠️</span>
                {errors.telefonoCliente}
              </div>
            )}
          </div>

          {/* Correo */}
          <div style={estilos.fieldGroup}>
            <label style={estilos.label}>
              <span style={estilos.icon}>📧</span>
              Correo Electrónico
            </label>
            <input
              type="email"
              style={getInputStyle('correoCliente')}
              value={correoCliente}
              onChange={(e) => setCorreoCliente(e.target.value)}
              onFocus={() => setFocusedField('correoCliente')}
              onBlur={() => setFocusedField(null)}
              placeholder="ejemplo@correo.com"
            />
            {errors.correoCliente && (
              <div style={estilos.errorMessage}>
                <span>⚠️</span>
                {errors.correoCliente}
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
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(194, 156, 94, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 3px 10px rgba(194, 156, 94, 0.3)';
              }}
            >
              <span>{id ? "🔄" : "✅"}</span>
              {id ? "Actualizar" : "Guardar"}
            </button>
            
            <button
              type="button"
              style={estilos.btnSecondary}
              onClick={cancelar}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5dc';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>❌</span>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};