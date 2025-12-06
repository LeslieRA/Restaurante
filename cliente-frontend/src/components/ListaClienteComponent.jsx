import React, { useEffect, useState } from "react";
import {
  listaClientes,
  deleteCliente,
  buscarClientes,
} from "../services/ClienteService";
import { deleteUsuario } from "../services/SecurityService";
import { useNavigate } from "react-router-dom";

export const ListaClienteComponent = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const navegar = useNavigate();

  // Estilos mejorados
  const estilos = {
    container: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: '3px solid #f5a540'
    },
    title: {
      fontFamily: 'Georgia, serif',
      color: '#75421e',
      textAlign: 'center',
      fontSize: '2.5rem',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '3px solid #f5a540',
      fontWeight: 'bold',
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
    },
    searchContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    },
    searchInput: {
      flex: 1,
      minWidth: '250px',
      padding: '0.8rem 1rem',
      border: '2px solid #f8bc56',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'system-ui, Arial, sans-serif',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    searchInputFocus: {
      borderColor: '#f5a540',
      boxShadow: '0 0 0 3px rgba(245, 165, 64, 0.2)'
    },
    btnPrimary: {
      backgroundColor: '#f5a540',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0.8rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    btnSecondary: {
      backgroundColor: 'white',
      color: '#75421e',
      border: '2px solid #f5a540',
      borderRadius: '8px',
      padding: '0.8rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1.5rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    thead: {
      backgroundColor: '#f5a540',
      color: '#75421e'
    },
    th: {
      padding: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '1rem',
      fontFamily: 'Georgia, serif',
      borderBottom: '2px solid #f28926'
    },
    td: {
      padding: '1rem',
      textAlign: 'left',
      borderBottom: '1px solid #f28926',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease'
    },
    tdCentered: {
      padding: '1rem',
      textAlign: 'center',
      borderBottom: '1px solid #f28926',
      fontSize: '0.95rem'
    },
    rowOdd: {
      backgroundColor: '#f8bc56'
    },
    rowEven: {
      backgroundColor: '#f5a540'
    },
    rowHover: {
      backgroundColor: '#fbd46d',
      transform: 'scale(1.01)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    btnEdit: {
      backgroundColor: '#f5a540',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.5rem 1rem',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginRight: '0.5rem'
    },
    btnDelete: {
      backgroundColor: '#d9534f',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.5rem 1rem',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    emptyMessage: {
      textAlign: 'center',
      color: '#888',
      fontSize: '1.1rem',
      padding: '2rem',
      fontStyle: 'italic'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      gap: '1rem',
      flexWrap: 'wrap'
    }
  };

  // 🟠 Cargar todos los clientes al inicio
  useEffect(() => {
    getAllClientes();
  }, []);

  // 🔹 Obtener todos los clientes
  function getAllClientes() {
    listaClientes()
      .then((response) => {
        console.log("Clientes recibidos:", response.data);
        setClientes(response.data);
      })
      .catch((error) => console.error("Error al cargar clientes:", error));
  }

  // 🔍 Búsqueda
  function handleBusqueda(e) {
    const valor = e.target.value;
    setBusqueda(valor);

    if (valor.trim() === "") {
      getAllClientes();
    } else {
      buscarClientes(valor)
        .then((response) => setClientes(response.data))
        .catch((error) => console.error("Error al buscar:", error));
    }
  }

  // ➕ Crear nuevo cliente
  function nuevoCliente() {
    navegar("/usuarios/crear");
  }

  // ✏ Editar cliente
  function editarCliente(id) {
    navegar(`/cliente/edita/${id}`);
  }

  // 🗑️ Eliminar cliente + su usuario correspondiente
  function eliminarCliente(idCliente) {
    if (!window.confirm("¿Seguro que deseas eliminar este cliente?")) return;

    deleteCliente(idCliente)
      .then(() => {
        console.log("Cliente eliminado");
        return deleteUsuario(idCliente);
      })
      .then(() => {
        console.log("Usuario asociado eliminado");
        alert("Cliente y usuario eliminados correctamente");
        getAllClientes();
      })
      .catch((error) => {
        console.error("Error al eliminar cliente o usuario:", error);
        alert("Ocurrió un error al eliminar los datos.");
      });
  }

  const getBtnStyle = (type, isHovered) => {
    const baseStyle = type === 'edit' ? estilos.btnEdit : estilos.btnDelete;
    const hoverStyle = {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      backgroundColor: type === 'edit' ? '#f28926' : '#c9302c'
    };
    return isHovered ? { ...baseStyle, ...hoverStyle } : baseStyle;
  };

  return (
    <div style={estilos.container}>
      
      {/* Header con título y botón nuevo */}
      <div style={estilos.buttonContainer}>
        <h2 style={{ ...estilos.title, margin: 0, border: 'none', padding: 0 }}>
          📋 Lista de Clientes
        </h2>
        <button
          style={{
            ...estilos.btnPrimary,
            ...(hoveredBtn === 'nuevo' ? {
              backgroundColor: '#f28926',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            } : {})
          }}
          onClick={nuevoCliente}
          onMouseEnter={() => setHoveredBtn('nuevo')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          ➕ Nuevo Cliente
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={estilos.searchContainer}>
        <input
          type="text"
          style={estilos.searchInput}
          placeholder="🔎 Buscar cliente por nombre..."
          value={busqueda}
          onChange={handleBusqueda}
          onFocus={(e) => {
            e.target.style.borderColor = estilos.searchInputFocus.borderColor;
            e.target.style.boxShadow = estilos.searchInputFocus.boxShadow;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#f8bc56';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          style={{
            ...estilos.btnSecondary,
            ...(hoveredBtn === 'limpiar' ? {
              backgroundColor: '#f5a540',
              color: 'white',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            } : {})
          }}
          onClick={() => {
            setBusqueda("");
            getAllClientes();
          }}
          onMouseEnter={() => setHoveredBtn('limpiar')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          🧹 Limpiar
        </button>
      </div>

      {/* Tabla */}
      <table style={estilos.table}>
        <thead style={estilos.thead}>
          <tr>
            <th style={estilos.th}>ID</th>
            <th style={estilos.th}>Nombre</th>
            <th style={estilos.th}>Teléfono</th>
            <th style={estilos.th}>Correo</th>
            <th style={estilos.th}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clientes.length === 0 ? (
            <tr>
              <td colSpan="5" style={estilos.emptyMessage}>
                ❌ No hay clientes registrados
              </td>
            </tr>
          ) : (
            clientes.map((cliente, index) => (
              <tr
                key={cliente.idCliente}
                style={{
                  ...(index % 2 === 0 ? estilos.rowEven : estilos.rowOdd),
                  ...(hoveredRow === cliente.idCliente ? estilos.rowHover : {})
                }}
                onMouseEnter={() => setHoveredRow(cliente.idCliente)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={estilos.tdCentered}>
                  <strong>{cliente.idCliente}</strong>
                </td>
                <td style={estilos.td}>
                  <strong>{cliente.nombreCliente}</strong>
                </td>
                <td style={estilos.td}>
                  📞 {cliente.telefonoCliente}
                </td>
                <td style={estilos.td}>
                  📧 {cliente.correoCliente}
                </td>
                <td style={estilos.tdCentered}>
                  <button
                    style={getBtnStyle('edit', hoveredBtn === `edit-${cliente.idCliente}`)}
                    onClick={() => editarCliente(cliente.idCliente)}
                    onMouseEnter={() => setHoveredBtn(`edit-${cliente.idCliente}`)}
                    onMouseLeave={() => setHoveredBtn(null)}
                  >
                    📝 Editar
                  </button>

                  <button
                    style={getBtnStyle('delete', hoveredBtn === `delete-${cliente.idCliente}`)}
                    onClick={() => eliminarCliente(cliente.idCliente)}
                    onMouseEnter={() => setHoveredBtn(`delete-${cliente.idCliente}`)}
                    onMouseLeave={() => setHoveredBtn(null)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};