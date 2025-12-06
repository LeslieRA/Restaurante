import React, { useEffect, useState } from 'react';
import { getVenta } from '../services/VentaService';
import { listaClientes } from '../services/ClienteService';
import { listaEmpleados } from '../services/EmpleadoService';
import { listaProductos } from '../services/ProductoService';
import { getDetallesByVenta } from '../services/DetalleVentaService';
import { listaAtenciones } from '../services/AtenderService';
import { getReserva } from '../services/ReservaService';
import { listaMesas } from '../services/MesaService';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const DetalleVentaComponent = ({ show, handleClose, ventaId }) => {
  const [venta, setVenta] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [atencion, setAtencion] = useState(null);
  const [reservaData, setReservaData] = useState(null);
  const [mesas, setMesas] = useState([]);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const estilos = {
    modalHeader: {
      backgroundColor: '#2f4858',
      color: 'white',
      borderBottom: '3px solid #c29c5e'
    },
    ticketTitle: {
      fontFamily: 'Georgia, serif',
      color: '#2f4858',
      borderBottom: '2px solid #c29c5e',
      paddingBottom: '0.5rem',
      marginBottom: '1.5rem'
    },
    infoSection: {
      backgroundColor: '#f4f1ea',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      border: '2px solid #e0ddd0'
    },
    infoLabel: {
      color: '#2f4858',
      fontWeight: 'bold',
      fontFamily: 'Arial, sans-serif'
    },
    infoValue: {
      color: '#555',
      marginLeft: '0.5rem'
    },
    table: {
      border: '2px solid #e0ddd0',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    tableHeader: {
      backgroundColor: '#2f4858',
      color: '#c29c5e',
      fontFamily: 'Georgia, serif',
      fontWeight: 'bold'
    },
    tableRow: {
      borderBottom: '1px solid #e0ddd0'
    },
    totalSection: {
      backgroundColor: '#f4f1ea',
      padding: '1rem',
      borderRadius: '8px',
      border: '2px solid #c29c5e',
      marginTop: '1rem'
    },
    totalAmount: {
      color: '#578661',
      fontFamily: 'Georgia, serif',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    btnPrimary: {
      backgroundColor: '#c29c5e',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      padding: '0.6rem 1.5rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    btnSecondary: {
      backgroundColor: 'white',
      color: '#2f4858',
      border: '2px solid #2f4858',
      borderRadius: '6px',
      padding: '0.6rem 1.5rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  };

  useEffect(() => {
    if (ventaId && show) {
      getVenta(ventaId)
        .then(async (res) => {
          setVenta(res.data);
          if (res.data.idReserva) {
            const { data: reservaInfo } = await getReserva(res.data.idReserva);
            setReservaData(reservaInfo);
          }
        })
        .catch((err) => console.error('Error al obtener venta:', err));

      getDetallesByVenta(ventaId)
        .then((res) => setDetalles(res.data))
        .catch((err) => console.error('Error al obtener detalles:', err));

      listaClientes().then((res) => setClientes(res.data)).catch(console.error);
      listaEmpleados().then((res) => setEmpleados(res.data)).catch(console.error);
      listaProductos().then((res) => setProductos(res.data)).catch(console.error);
      listaMesas().then((res) => setMesas(res.data)).catch(console.error);

      listaAtenciones()
        .then((res) => {
          const encontrada = res.data.find(
            (a) => a.idVenta === ventaId || a.idventa === ventaId
          );
          setAtencion(encontrada || null);
        })
        .catch((err) => console.error('Error al obtener atenciones:', err));
    }
  }, [ventaId, show]);

  const obtenerCliente = (idCliente) => {
    const c = clientes.find((cli) => cli.idCliente === idCliente);
    return c ? c.nombreCliente : `Cliente #${idCliente}`;
  };

  const obtenerMesero = () => {
    if (!atencion) return '—';
    const emp = empleados.find(
      (e) => e.idEmpleado === atencion.idEmpleado || e.idempleado === atencion.idEmpleado
    );
    return emp ? emp.nombre : `Empleado #${atencion.idEmpleado}`;
  };

  const obtenerMesa = () => {
    if (!reservaData) return '—';
    const mesa = mesas.find(
      (m) => m.idMesa === reservaData.idMesa || m.idmesa === reservaData.idMesa
    );
    return mesa ? ` ${mesa.numero}` : '—';
  };

  const obtenerProducto = (idProducto) => {
    const p = productos.find(
      (prod) => prod.idProducto === idProducto || prod.id_producto === idProducto
    );
    return p ? p.nombreProducto : '—';
  };

  const formatearFecha = (fecha) => {
    try {
      const f = new Date(fecha);
      return f.toLocaleString('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return fecha;
    }
  };

  const imprimirTicket = () => {
    const contenidoModal = document.getElementById('ticketVenta');
    const ventanaImpresion = window.open('', '', 'width=800,height=600');
    
    ventanaImpresion.document.write('<html><head><title>Imprimir Ticket</title>');
    ventanaImpresion.document.write('<style>');
    ventanaImpresion.document.write(`
      body { 
        font-family: Arial, sans-serif; 
        padding: 20px;
        color: #2f4858;
      }
      h4 { 
        color: #2f4858; 
        border-bottom: 2px solid #c29c5e;
        padding-bottom: 10px;
        font-family: Georgia, serif;
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-top: 15px;
      }
      th { 
        background-color: #2f4858; 
        color: #c29c5e; 
        padding: 10px;
        font-family: Georgia, serif;
      }
      td { 
        padding: 8px; 
        border-bottom: 1px solid #ddd; 
      }
      .total { 
        font-size: 1.3rem; 
        font-weight: bold; 
        color: #578661;
        margin-top: 15px;
      }
      .info-section {
        background-color: #f4f1ea;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
        border: 2px solid #e0ddd0;
      }
      strong { color: #2f4858; }
    `);
    ventanaImpresion.document.write('</style></head><body>');
    ventanaImpresion.document.write(contenidoModal.innerHTML);
    ventanaImpresion.document.write('</body></html>');

    ventanaImpresion.document.close();
    ventanaImpresion.print();
  };

  const getBtnStyle = (type) => {
    const baseStyle = type === 'primary' ? estilos.btnPrimary : estilos.btnSecondary;
    const hoverStyle = type === 'primary' ? {
      backgroundColor: '#a78247',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    } : {
      backgroundColor: '#2f4858',
      color: 'white',
      transform: 'translateY(-2px)'
    };
    return hoveredBtn === type ? { ...baseStyle, ...hoverStyle } : baseStyle;
  };

  if (!venta) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton style={estilos.modalHeader}>
        <Modal.Title style={{ fontFamily: 'Georgia, serif' }}>
          📋 Detalle de Venta #{venta.idVenta}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body id="ticketVenta">
        <div className="container text-dark">
          <h4 className="text-center" style={estilos.ticketTitle}>
            🎫 TICKET DE VENTA 🎫
          </h4>

          <div style={estilos.infoSection}>
            <div className="row">
              <div className="col-md-6 mb-2">
                <span style={estilos.infoLabel}>No. Venta:</span>
                <span style={estilos.infoValue}>#{venta.idVenta}</span>
              </div>
              <div className="col-md-6 mb-2">
                <span style={estilos.infoLabel}>Fecha:</span>
                <span style={estilos.infoValue}>{formatearFecha(venta.fechaVenta)}</span>
              </div>
              <div className="col-md-6 mb-2">
                <span style={estilos.infoLabel}>Cliente:</span>
                <span style={estilos.infoValue}>{obtenerCliente(venta.idCliente)}</span>
              </div>
              <div className="col-md-6 mb-2">
                <span style={estilos.infoLabel}>Reserva:</span>
                <span style={estilos.infoValue}>
                  {venta.idReserva ? `#${venta.idReserva}` : 'Sin reserva'}
                </span>
              </div>
              {venta.idReserva && (
                <div className="col-md-6 mb-2">
                  <span style={estilos.infoLabel}>Mesa:</span>
                  <span style={estilos.infoValue}>{obtenerMesa()}</span>
                </div>
              )}
              <div className="col-md-6 mb-2">
                <span style={estilos.infoLabel}>Mesero:</span>
                <span style={estilos.infoValue}>{obtenerMesero()}</span>
              </div>
            </div>
          </div>

          <table className="table table-sm mt-3" style={estilos.table}>
            <thead style={estilos.tableHeader}>
              <tr>
                <th>Cant.</th>
                <th>Producto</th>
                <th>Precio U.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d, index) => (
                <tr 
                  key={d.idDetalle}
                  style={{
                    ...estilos.tableRow,
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white'
                  }}
                >
                  <td><strong>{d.cantidad}</strong></td>
                  <td>{obtenerProducto(d.idProducto)}</td>
                  <td style={{ color: '#578661' }}>
                    ${d.precioUnitario?.toFixed(2)}
                  </td>
                  <td style={{ color: '#578661', fontWeight: 'bold' }}>
                    ${(d.cantidad * d.precioUnitario).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={estilos.totalSection} className="text-end">
            <span style={estilos.totalAmount}>
              Total: ${venta.total?.toFixed(2)}
            </span>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <button
          style={getBtnStyle('primary')}
          onClick={imprimirTicket}
          onMouseEnter={() => setHoveredBtn('primary')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          🖨️ Imprimir Ticket
        </button>
        <button 
          style={getBtnStyle('secondary')}
          onClick={handleClose}
          onMouseEnter={() => setHoveredBtn('secondary')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          ✖️ Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  );
};