import React, { useEffect, useState } from "react";
import {
  listaEmpleados,
  deleteEmpleado,
  buscarEmpleadoPorNombre,
  buscarEmpleadoPorPuesto,
} from "../services/EmpleadoService";
import { useNavigate } from "react-router-dom";
import { deleteUsuario } from "../services/SecurityService";  

export const ListaEmpleadoComponent = () => {
  const [empleados, setEmpleados] = useState([]);
  const [criterio, setCriterio] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [puestoSeleccionado, setPuestoSeleccionado] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  
  const navegar = useNavigate();

  // Estilos con paleta azul elegante
  const estilos = {
    container: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      border: '3px solid #c29c5e'
    },
    title: {
      fontFamily: 'Georgia, serif',
      color: '#2f4858',
      textAlign: 'center',
      fontSize: '2.5rem',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '3px solid #c29c5e',
      fontWeight: 'bold',
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
    },
    searchContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    searchInput: {
      flex: 1,
      minWidth: '250px',
      padding: '0.8rem 1rem',
      border: '2px solid #e0ddd0',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'Arial, sans-serif',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    searchInputFocus: {
      borderColor: '#c29c5e',
      boxShadow: '0 0 0 3px rgba(194, 156, 94, 0.2)'
    },
    btnPrimary: {
      backgroundColor: '#c29c5e',
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
      color: '#2f4858',
      border: '2px solid #c29c5e',
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
      backgroundColor: '#2f4858',
      color: '#c29c5e'
    },
    th: {
      padding: '1rem',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '1rem',
      fontFamily: 'Georgia, serif',
      borderBottom: '2px solid #1e2f3a'
    },
    td: {
      padding: '1rem',
      textAlign: 'left',
      borderBottom: '1px solid #ddd',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease'
    },
    tdCentered: {
      padding: '1rem',
      textAlign: 'center',
      borderBottom: '1px solid #ddd',
      fontSize: '0.95rem'
    },
    rowEven: {
      backgroundColor: '#f9f9f9'
    },
    rowOdd: {
      backgroundColor: '#ffffff'
    },
    rowHover: {
      backgroundColor: '#e8e4d9',
      transform: 'scale(1.01)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    btnEdit: {
      backgroundColor: '#c29c5e',
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
      backgroundColor: '#c0615f',
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
    },
    filterLabel: {
      fontWeight: '600',
      color: '#2f4858',
      fontSize: '1rem',
      whiteSpace: 'nowrap'
    },
    select: {
      padding: '0.8rem 1rem',
      border: '2px solid #e0ddd0',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'Arial, sans-serif',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    badge: {
      backgroundColor: '#899458',
      color: 'white',
      padding: '0.4rem 0.9rem',
      borderRadius: '15px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      display: 'inline-block'
    }
  };

  useEffect(() => {
    getAllEmpleados();
  }, []);

  function getAllEmpleados() {
    listaEmpleados()
      .then((response) => setEmpleados(response.data))
      .catch((error) => console.error("Error al cargar empleados:", error));
  }

  function realizarBusqueda(e) {
    e?.preventDefault();

    if (criterio === "nombre") {
      if (!busqueda.trim()) {
        getAllEmpleados();
        return;
      }
      buscarEmpleadoPorNombre(busqueda)
        .then((response) => setEmpleados(response.data))
        .catch((error) => console.error("Error al buscar empleados:", error));
    } else if (criterio === "puesto") {
      if (!puestoSeleccionado) {
        getAllEmpleados();
        return;
      }
      buscarEmpleadoPorPuesto(puestoSeleccionado)
        .then((response) => setEmpleados(response.data))
        .catch((error) => console.error("Error al buscar por puesto:", error));
    }
  }

  function limpiarBusqueda() {
    setBusqueda("");
    setPuestoSeleccionado("");
    setCriterio("nombre");
    getAllEmpleados();
  }

  function nuevoEmpleado() {
    navegar("/usuarios/crear");
  }

  function actualizarEmpleado(id) {
    navegar(`/empleado/edita/${id}`);
  }

  function eliminarEmpleado(idEmpleado) {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;

    deleteEmpleado(idEmpleado)
      .then(() => {
        console.log("Empleado eliminado");
        return deleteUsuario(idEmpleado);
      })
      .then(() => {
        alert("Empleado y usuario eliminados correctamente");
        getAllEmpleados();
      })
      .catch((error) => {
        console.error("Error al eliminar empleado/usuario:", error);
        alert("Ocurrió un error al eliminar los datos.");
      });
  }

  const getRowStyle = (index) => {
    const baseStyle = index % 2 === 0 ? estilos.rowEven : estilos.rowOdd;
    return hoveredRow === index ? { ...baseStyle, ...estilos.rowHover } : baseStyle;
  };

  const getInputStyle = (inputName) => {
    return focusedInput === inputName
      ? { ...estilos.searchInput, ...estilos.searchInputFocus }
      : estilos.searchInput;
  };

  return (
    <div style={estilos.container}>
      {/* Botón crear */}
      <div style={estilos.buttonContainer}>
        <button
          style={estilos.btnPrimary}
          onClick={nuevoEmpleado}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span>➕</span>
          Nuevo Empleado
        </button>
      </div>

      <h2 style={estilos.title}>
        👥 Lista de Empleados
      </h2>

      {/* Filtros de búsqueda */}
      <div>
        <div style={estilos.searchContainer}>
          <label style={estilos.filterLabel}>
            🔍 Filtro de búsqueda:
          </label>

          <select
            style={estilos.select}
            value={criterio}
            onChange={(e) => {
              setCriterio(e.target.value);
              setBusqueda("");
              setPuestoSeleccionado("");
            }}
          >
            <option value="nombre">Por Nombre</option>
            <option value="puesto">Por Puesto</option>
          </select>

          {/* Campo dinámico según criterio */}
          {criterio === "nombre" ? (
            <input
              type="text"
              style={getInputStyle('nombre')}
              placeholder="Escribe el nombre del empleado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onFocus={() => setFocusedInput('nombre')}
              onBlur={() => setFocusedInput(null)}
            />
          ) : (
            <select
              style={estilos.select}
              value={puestoSeleccionado}
              onChange={(e) => setPuestoSeleccionado(e.target.value)}
            >
              <option value="">Selecciona un puesto</option>
              <option value="cocinero">Cocinero</option>
              <option value="mesero">Mesero</option>
              <option value="cajero">Cajero</option>
              <option value="administrador">Administrador</option>
              <option value="supervisor">Supervisor</option>
            </select>
          )}

          {/* Botones */}
          <button
            type="button"
            style={estilos.btnPrimary}
            onClick={realizarBusqueda}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }}
          >
            <span>🔎</span>
            Buscar
          </button>

          <button
            type="button"
            style={estilos.btnSecondary}
            onClick={limpiarBusqueda}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5dc';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>🧹</span>
            Limpiar
          </button>
        </div>
      </div>

      {/* Tabla de empleados */}
      <div style={{ overflowX: 'auto' }}>
        <table style={estilos.table}>
          <thead style={estilos.thead}>
            <tr>
              <th style={estilos.th}>ID</th>
              <th style={estilos.th}>Nombre</th>
              <th style={estilos.th}>Puesto</th>
              <th style={estilos.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.length === 0 ? (
              <tr>
                <td colSpan="4" style={estilos.emptyMessage}>
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
                    <div>No hay empleados registrados</div>
                  </div>
                </td>
              </tr>
            ) : (
              empleados.map((empleado, index) => (
                <tr
                  key={empleado.idEmpleado}
                  style={getRowStyle(index)}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={estilos.tdCentered}>
                    <strong>{empleado.idEmpleado}</strong>
                  </td>
                  <td style={estilos.td}>
                    <strong style={{ color: '#2f4858', fontSize: '1rem' }}>
                      {empleado.nombre}
                    </strong>
                  </td>
                  <td style={estilos.tdCentered}>
                    <span style={estilos.badge}>
                      {empleado.puesto}
                    </span>
                  </td>
                  <td style={estilos.tdCentered}>
                    <button
                      style={estilos.btnEdit}
                      onClick={() => actualizarEmpleado(empleado.idEmpleado)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#b08a52';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#c29c5e';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <span>📝</span>
                      Editar
                    </button>
                    <button
                      style={estilos.btnDelete}
                      onClick={() => eliminarEmpleado(empleado.idEmpleado)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#a04442';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#c0615f';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <span>🗑️</span>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};