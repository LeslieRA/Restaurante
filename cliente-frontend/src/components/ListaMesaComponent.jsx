import React, { useEffect, useState } from 'react';
import { listaMesas, deleteMesa } from "../services/MesaService";
import { listaReservas } from "../services/ReservaService";
import { useNavigate } from 'react-router-dom';

export const ListaMesaComponent = () => {
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
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
    badgeDisponible: {
      backgroundColor: '#578661',
      color: 'white',
      padding: '0.4rem 0.9rem',
      borderRadius: '15px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      display: 'inline-block'
    },
    badgeOcupada: {
      backgroundColor: '#c0615f',
      color: 'white',
      padding: '0.4rem 0.9rem',
      borderRadius: '15px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      display: 'inline-block'
    },
    ubicacionBadge: {
      backgroundColor: '#899458',
      color: 'white',
      padding: '0.3rem 0.8rem',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      display: 'inline-block'
    }
  };

  useEffect(() => {
    getAllMesas();
    cargarReservas();
  }, []);
  
  function getAllMesas() {
    listaMesas()
      .then((response) => {
        setMesas(response.data);
      })
      .catch((error) => console.error(error));
  }

  function cargarReservas() {
    listaReservas()
      .then((response) => setReservas(response.data))
      .catch((error) => console.error("Error al cargar reservas:", error));
  }

  function nuevaMesa() {
    navegar('/mesa/crear');
  }

  function actualizarMesa(idMesa) {
    navegar(`/mesa/edita/${idMesa}`);
  }

  function eliminarMesa(idMesa) {
    // Buscar si la mesa aparece en alguna reserva
    const mesaTieneReserva = reservas.some(reserva => reserva.idMesa === idMesa);
    
    if (mesaTieneReserva) {
      alert("❌ No se puede eliminar esta mesa porque tiene reservas asociadas.");
      return;
    }

    if (!window.confirm("¿Seguro que deseas eliminar esta mesa?")) return;

    deleteMesa(idMesa)
      .then(() => {
        alert("✔️ Mesa eliminada correctamente.");
        getAllMesas();
      })
      .catch((error) => {
        console.error("Error al eliminar mesa:", error);
        alert("❌ Ocurrió un error al eliminar la mesa.");
      });
  }

  const getRowStyle = (index) => {
    const baseStyle = index % 2 === 0 ? estilos.rowEven : estilos.rowOdd;
    return hoveredRow === index ? { ...baseStyle, ...estilos.rowHover } : baseStyle;
  };

  return (
    <div style={estilos.container}>
      {/* Botón crear */}
      <div style={estilos.buttonContainer}>
        <button
          style={estilos.btnPrimary}
          onClick={nuevaMesa}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span>➕</span>
          Nueva Mesa
        </button>
      </div>

      <h2 style={estilos.title}>
        🪑 Lista de Mesas
      </h2>

      {/* Tabla de mesas */}
      <div style={{ overflowX: 'auto' }}>
        <table style={estilos.table}>
          <thead style={estilos.thead}>
            <tr>
              <th style={estilos.th}>ID Mesa</th>
              <th style={estilos.th}>Número</th>
              <th style={estilos.th}>Capacidad</th>
              <th style={estilos.th}>Ubicación</th>
              <th style={estilos.th}>Estado</th>
              <th style={estilos.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mesas.length === 0 ? (
              <tr>
                <td colSpan="6" style={estilos.emptyMessage}>
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪑</div>
                    <div>No hay mesas registradas</div>
                  </div>
                </td>
              </tr>
            ) : (
              mesas.map((mesa, index) => (
                <tr
                  key={mesa.idMesa}
                  style={getRowStyle(index)}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={estilos.tdCentered}>
                    <strong>{mesa.idMesa}</strong>
                  </td>
                  <td style={estilos.tdCentered}>
                    <div style={{
                      backgroundColor: '#2f4858',
                      color: '#c29c5e',
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                      {mesa.numero}
                    </div>
                  </td>
                  <td style={estilos.tdCentered}>
                    <span style={{
                      color: '#2f4858',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      👥 {mesa.capacidad} personas
                    </span>
                  </td>
                  <td style={estilos.tdCentered}>
                    <span style={estilos.ubicacionBadge}>
                      📍 {mesa.ubicacion}
                    </span>
                  </td>
                  <td style={estilos.tdCentered}>
                    <span style={mesa.estado ? estilos.badgeDisponible : estilos.badgeOcupada}>
                      {mesa.estado ? '✓ Disponible' : '✗ Ocupada'}
                    </span>
                  </td>
                  <td style={estilos.tdCentered}>
                    <button
                      style={estilos.btnEdit}
                      onClick={() => actualizarMesa(mesa.idMesa)}
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
                      onClick={() => eliminarMesa(mesa.idMesa)}
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