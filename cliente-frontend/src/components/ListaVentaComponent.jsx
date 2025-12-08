import React, { useEffect, useState } from 'react';
import { listaVentas, deleteVenta, buscarVentaPorFecha } from '../services/VentaService';
import { listaClientes } from '../services/ClienteService';
import { listaEmpleados } from '../services/EmpleadoService';
import { listaAtenciones } from '../services/AtenderService';
import { listaReservas } from "../services/ReservaService";
import { useNavigate } from 'react-router-dom';
import { DetalleVentaComponent } from './DetalleVentaComponent';

export const ListaVentaComponent = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [atenciones, setAtenciones] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [fechaBusqueda, setFechaBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const navegar = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Estilos con paleta azul elegante
  const estilos = {
    container: {
      maxWidth: '1400px',
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
      alignItems: 'center',
      justifyContent: 'center'
    },
    searchInput: {
      padding: '0.8rem 1rem',
      border: '2px solid #e0ddd0',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'Arial, sans-serif',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: '#ffffff', // ✅ CORREGIDO: Fondo blanco
      color: '#000000',           // ✅ CORREGIDO: Texto negro
      cursor: 'pointer'
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
      transform: 'scale(1.005)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    btnView: {
      backgroundColor: '#2f4858',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.4rem 0.8rem',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      marginRight: '0.4rem',
      marginBottom: '0.3rem'
    },
    btnEdit: {
      backgroundColor: '#c29c5e',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.4rem 0.8rem',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      marginRight: '0.4rem',
      marginBottom: '0.3rem'
    },
    btnDelete: {
      backgroundColor: '#c0615f',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.4rem 0.8rem',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      marginBottom: '0.3rem'
    },
    btnDisabled: {
      backgroundColor: '#ccc',
      color: '#666',
      border: 'none',
      borderRadius: '6px',
      padding: '0.4rem 0.8rem',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      cursor: 'not-allowed',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      marginRight: '0.4rem',
      marginBottom: '0.3rem',
      opacity: 0.6
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
    reservaBadge: {
      backgroundColor: '#899458',
      color: 'white',
      padding: '0.3rem 0.8rem',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      display: 'inline-block'
    },
    sinReservaBadge: {
      backgroundColor: '#ddd',
      color: '#666',
      padding: '0.3rem 0.8rem',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      display: 'inline-block'
    },
    totalBadge: {
      backgroundColor: '#578661',
      color: 'white',
      padding: '0.4rem 0.9rem',
      borderRadius: '15px',
      fontSize: '1rem',
      fontWeight: 'bold',
      display: 'inline-block'
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  async function cargarTodo() {
    try {
      const [
        ventasRes,
        clientesRes,
        empleadosRes,
        atencionesRes,
        reservasRes
      ] = await Promise.all([
        listaVentas(),
        listaClientes(),
        listaEmpleados(),
        listaAtenciones(),
        listaReservas()
      ]);

      setClientes(clientesRes.data);
      setEmpleados(empleadosRes.data);
      setAtenciones(atencionesRes.data);
      setReservas(reservasRes.data);

      let ventasFinales = ventasRes.data;

      if (usuario?.perfil === "mesero") {
        ventasFinales = ventasFinales.filter(v =>
          atencionesRes.data.some(a =>
            Number(a.idVenta ?? a.idventa) === Number(v.idVenta) &&
            Number(a.idEmpleado ?? a.idempleado) === Number(usuario.id)
          )
        );
      }

      setVentas(ventasFinales);

    } catch (error) {
      console.error("Error cargando datos: ", error);
    }
  }

  async function buscarPorFecha(e) {
    e.preventDefault();

    if (!fechaBusqueda) {
      cargarTodo();
      return;
    }

    try {
      const { data } = await buscarVentaPorFecha(fechaBusqueda);
      let ventasFiltradas = data;

      if (usuario?.perfil === "mesero") {
        ventasFiltradas = ventasFiltradas.filter(v =>
          atenciones.some(a =>
            Number(a.idVenta ?? a.idventa) === Number(v.idVenta) &&
            Number(a.idEmpleado ?? a.idempleado) === Number(usuario.id)
          )
        );
      }

      setVentas(ventasFiltradas);

    } catch (err) {
      console.error("Error al buscar ventas:", err);
    }
  }

  function ventaEditable(venta) {
    const hoy = new Date().toISOString().split("T")[0];
    const fechaVenta = new Date(venta.fechaVenta).toISOString().split("T")[0];

    if (!venta.idReserva) {
      return fechaVenta === hoy;
    }

    const reserva = reservas.find(r => r.idReserva === venta.idReserva);
    if (!reserva) return false;

    return reserva.fecha === hoy;
  }

  function motivoVentaBloqueada(venta) {
    const hoy = new Date().toISOString().split("T")[0];
    const fechaVenta = new Date(venta.fechaVenta).toISOString().split("T")[0];

    if (!venta.idReserva) {
      if (fechaVenta < hoy) return "⚠ La fecha de la venta ya venció.";
      return "Solo puedes editar la venta el mismo día.";
    }

    const reserva = reservas.find(r => r.idReserva === venta.idReserva);
    if (!reserva) return "Información de reserva no encontrada.";

    if (reserva.fecha < hoy) return "⚠ La fecha de la reserva ya pasó.";
    if (reserva.fecha > hoy) return "Solo puedes editar la venta el día de la reserva.";

    return "⚠ Venta bloqueada.";
  }

  function nuevaVenta() {
    navegar('/venta/crear');
  }

  function actualizarVenta(idVenta) {
    navegar(`/venta/edita/${idVenta}`);
  }

  function verDetalle(idVenta) {
    setVentaSeleccionada(idVenta);
    setShowModal(true);
  }

  function eliminarVenta(idVenta) {
    if (!window.confirm("¿Seguro que deseas eliminar esta venta?")) return;

    deleteVenta(idVenta)
      .then(() => {
        alert("✔️ Venta eliminada correctamente");
        cargarTodo();
      })
      .catch(err => {
        console.error("Error al eliminar venta:", err);
        alert("❌ Error al eliminar la venta");
      });
  }

  function formatearFecha(f) {
    try {
      return new Date(f).toLocaleString("es-MX", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return f;
    }
  }

  function obtenerNombreCliente(id) {
    const cli = clientes.find(c => c.idCliente === id);
    return cli ? cli.nombreCliente : `Cliente #${id}`;
  }

  const getRowStyle = (index) => {
    const baseStyle = index % 2 === 0 ? estilos.rowEven : estilos.rowOdd;
    return hoveredRow === index ? { ...baseStyle, ...estilos.rowHover } : baseStyle;
  };

  const getInputStyle = () => {
    return focusedInput 
      ? { ...estilos.searchInput, ...estilos.searchInputFocus }
      : estilos.searchInput;
  };

  return (
    <div style={estilos.container}>
      <div style={estilos.buttonContainer}>
        <h2 style={{ ...estilos.title, border: 'none', padding: 0, margin: 0 }}>
          💰 Lista de Ventas
        </h2>

        {(usuario.perfil === "administrador" || usuario.perfil === "cajero") && (
          <button
            style={estilos.btnPrimary}
            onClick={nuevaVenta}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>➕</span>
            Nueva Venta
          </button>
        )}
      </div>

      <div style={{ borderBottom: '3px solid #c29c5e', marginBottom: '2rem' }}></div>

      {/* Búsqueda por fecha */}
      <div style={estilos.searchContainer}>
        <label style={estilos.filterLabel}>
          🔍 Buscar por fecha:
        </label>
        <input
          type="date"
          style={getInputStyle()}
          value={fechaBusqueda}
          onChange={(e) => setFechaBusqueda(e.target.value)}
          onFocus={() => setFocusedInput(true)}
          onBlur={() => setFocusedInput(false)}
        />
        <button
          type="button"
          style={estilos.btnPrimary}
          onClick={buscarPorFecha}
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
          onClick={() => {
            setFechaBusqueda("");
            cargarTodo();
          }}
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

      {/* Tabla de ventas */}
      <div style={{ overflowX: 'auto' }}>
        <table style={estilos.table}>
          <thead style={estilos.thead}>
            <tr>
              <th style={estilos.th}>ID Venta</th>
              <th style={estilos.th}>Fecha</th>
              <th style={estilos.th}>Cliente</th>
              <th style={estilos.th}>Reserva</th>
              <th style={estilos.th}>Total</th>
              <th style={estilos.th}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ventas.length > 0 ? (
              ventas.map((venta, index) => (
                <tr
                  key={venta.idVenta}
                  style={getRowStyle(index)}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={estilos.tdCentered}>
                    <strong>{venta.idVenta}</strong>
                  </td>
                  <td style={estilos.td}>
                    <strong style={{ color: '#2f4858' }}>
                      📅 {formatearFecha(venta.fechaVenta)}
                    </strong>
                  </td>
                  <td style={estilos.td}>
                    <strong style={{ color: '#2f4858' }}>
                      {obtenerNombreCliente(venta.idCliente)}
                    </strong>
                  </td>
                  <td style={estilos.tdCentered}>
                    {venta.idReserva ? (
                      <span style={estilos.reservaBadge}>
                        #{venta.idReserva}
                      </span>
                    ) : (
                      <span style={estilos.sinReservaBadge}>
                        Sin reserva
                      </span>
                    )}
                  </td>
                  <td style={estilos.tdCentered}>
                    <span style={estilos.totalBadge}>
                      ${venta.total?.toFixed(2)}
                    </span>
                  </td>

                  <td style={estilos.tdCentered}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                      <button
                        style={estilos.btnView}
                        onClick={() => verDetalle(venta.idVenta)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#1e2f3a';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#2f4858';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <span>👁️</span>
                        Ver detalle
                      </button>

                      {["mesero", "cajero", "administrador"].includes(usuario.perfil) && (
                        ventaEditable(venta) ? (
                          <button
                            style={estilos.btnEdit}
                            onClick={() => actualizarVenta(venta.idVenta)}
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
                        ) : (
                          <button
                            style={estilos.btnDisabled}
                            onClick={() => alert(motivoVentaBloqueada(venta))}
                            title={motivoVentaBloqueada(venta)}
                          >
                            <span>🔒</span>
                            Venta cerrada
                          </button>
                        )
                      )}

                      {(usuario.perfil === "administrador" || usuario.perfil === "cajero") && (
                        <button
                          style={estilos.btnDelete}
                          onClick={() => eliminarVenta(venta.idVenta)}
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
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={estilos.emptyMessage}>
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                    <div>No hay ventas registradas</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DetalleVentaComponent
        show={showModal}
        handleClose={() => setShowModal(false)}
        ventaId={ventaSeleccionada}
      />
    </div>
  );
};