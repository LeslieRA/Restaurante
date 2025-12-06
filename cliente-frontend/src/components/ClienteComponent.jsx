import React, { useState, useEffect } from "react";
import { crearCliente, getCliente, updateCliente } from "../services/ClienteService";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { updateUsuario, deleteUsuario } from "../services/SecurityService";

export const ClienteComponent = () => {
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [correoCliente, setCorreoCliente] = useState("");
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

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

  // Estilos mejorados
  const estilos = {
    container: {
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '2rem'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontFamily: 'Georgia, serif',
      color: '#75421e',
      fontSize: '2.5rem',
      fontWeight: 'bold',
      margin: 0,
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    formContainer: {
      backgroundColor: 'white',
      padding: '2.5rem',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      border: '3px solid #f5a540'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#75421e',
      fontSize: '1rem',
      fontFamily: 'system-ui, Arial, sans-serif'
    },
    input: {
      width: '100%',
      padding: '0.9rem 1rem',
      border: '2px solid #f8bc56',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'system-ui, Arial, sans-serif',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: '#fefefe'
    },
    inputFocus: {
      borderColor: '#f5a540',
      boxShadow: '0 0 0 3px rgba(245, 165, 64, 0.2)',
      backgroundColor: 'white'
    },
    inputError: {
      borderColor: '#d9534f',
      backgroundColor: '#fff5f5'
    },
    inputDisabled: {
      backgroundColor: '#f0f0f0',
      cursor: 'not-allowed',
      color: '#888'
    },
    errorMessage: {
      color: '#d9534f',
      fontSize: '0.85rem',
      marginTop: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      fontWeight: '500'
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem',
      flexWrap: 'wrap'
    },
    btnPrimary: {
      backgroundColor: '#f5a540',
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
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    btnSecondary: {
      backgroundColor: 'white',
      color: '#d9534f',
      border: '2px solid #d9534f',
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
    helperText: {
      fontSize: '0.85rem',
      color: '#888',
      marginTop: '0.3rem',
      fontStyle: 'italic'
    },
    badge: {
      display: 'inline-block',
      backgroundColor: '#fbd46d',
      color: '#75421e',
      padding: '0.3rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      marginTop: '0.5rem'
    }
  };

  // Prellenar nombre al venir desde usuario
  useEffect(() => {
    if (nombreFromUsuario) {
      setNombreCliente(nombreFromUsuario);
    }
  }, [nombreFromUsuario]);

  // Cargar datos si es edición
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

  // Validación
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

    // SI ES EDICIÓN NORMAL
    if (id) {
      updateCliente(id, cliente)
        .then(() => {
          updateUsuario(id, { nombre: nombreCliente })
            .then(() => navegar("/cliente/lista"));
        })
        .catch(console.error);
      return;
    }

    // SI ES CLIENTE NUEVO (CREACIÓN)
    crearCliente(cliente)
      .then(() => {
        // 🔹 Personal del restaurante: admin, supervisor o cajero
        if (loggedUser) {
          navegar("/cliente/lista");
        } 
        // 🔹 Registro público de cliente
        else {
          alert("Registro completado. Ahora puedes iniciar sesión.");
          navegar("/login");
        }
      })
      .catch(console.error);
  }

  async function cancelar() {
    const loggedUser = JSON.parse(localStorage.getItem("usuario"));

    // SI VIENE DESDE REGISTRO DE CLIENTE (NO HAY PERSONAL LOGUEADO)
    if (!loggedUser && idUsuario) {
      const confirmar = window.confirm(
        "No completaste tu registro, tu cuenta será eliminada. ¿Deseas cancelar?"
      );

      if (!confirmar) return;

      // ❗ Eliminar usuario incompleto
      await deleteUsuario(idUsuario).catch(() => null);

      navegar("/");
      return;
    }

    // SI ES ADMIN / SUPERVISOR / CAJERO CREANDO CLIENTES
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

    // Si está editando un cliente existente
    navegar("/cliente/lista");
  }

  function pagTitulo() {
    return id ? "✏️ Modificar Cliente" : "➕ Agregar Cliente";
  }

  const getInputStyle = (fieldName) => {
    let style = { ...estilos.input };
    
    if (errors[fieldName]) {
      style = { ...style, ...estilos.inputError };
    } else if (focusedInput === fieldName) {
      style = { ...style, ...estilos.inputFocus };
    }
    
    if (fieldName === 'nombreCliente' && nombreFromUsuario) {
      style = { ...style, ...estilos.inputDisabled };
    }
    
    return style;
  };

  const getBtnStyle = (type) => {
    const baseStyle = type === 'primary' ? estilos.btnPrimary : estilos.btnSecondary;
    const hoverStyle = type === 'primary' ? {
      backgroundColor: '#f28926',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
    } : {
      backgroundColor: '#d9534f',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
    };
    
    return hoveredBtn === type ? { ...baseStyle, ...hoverStyle } : baseStyle;
  };

  return (
    <div style={estilos.container}>
      <div style={estilos.header}>
        <h2 style={estilos.title}>{pagTitulo()}</h2>
      </div>

      <form style={estilos.formContainer} onSubmit={saveCliente}>
        
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
            onFocus={() => setFocusedInput('nombreCliente')}
            onBlur={() => setFocusedInput(null)}
            disabled={!!nombreFromUsuario}
            placeholder="Ingrese el nombre completo"
          />
          {nombreFromUsuario && (
            <div style={estilos.badge}>
              🔒 Nombre bloqueado (proviene del usuario)
            </div>
          )}
          {errors.nombreCliente && (
            <div style={estilos.errorMessage}>
              ⚠️ {errors.nombreCliente}
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
            onFocus={() => setFocusedInput('telefonoCliente')}
            onBlur={() => setFocusedInput(null)}
            placeholder="Ej: 7471234567"
          />
          {!errors.telefonoCliente && (
            <div style={estilos.helperText}>
              💡 Ingrese un número de 10 dígitos
            </div>
          )}
          {errors.telefonoCliente && (
            <div style={estilos.errorMessage}>
              ⚠️ {errors.telefonoCliente}
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
            onFocus={() => setFocusedInput('correoCliente')}
            onBlur={() => setFocusedInput(null)}
            placeholder="ejemplo@correo.com"
          />
          {!errors.correoCliente && (
            <div style={estilos.helperText}>
              💡 Correo válido para notificaciones
            </div>
          )}
          {errors.correoCliente && (
            <div style={estilos.errorMessage}>
              ⚠️ {errors.correoCliente}
            </div>
          )}
        </div>

        {/* Botones */}
        <div style={estilos.buttonContainer}>
          <button
            type="submit"
            style={getBtnStyle('primary')}
            onMouseEnter={() => setHoveredBtn('primary')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            {id ? "🔄 Actualizar" : "✅ Guardar"}
          </button>
          
          <button
            type="button"
            style={getBtnStyle('secondary')}
            onClick={cancelar}
            onMouseEnter={() => setHoveredBtn('secondary')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};