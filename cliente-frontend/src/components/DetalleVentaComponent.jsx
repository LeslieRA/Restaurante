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

// --- ESTILOS DEFINIDOS ---
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
  totalText: {
    color: '#c29c5e', 
    fontWeight: 'bold', 
    fontSize: '1.5rem',
    textAlign: 'right',
    marginTop: '1.5rem'
  },
  infoLabel: {
    color: '#2f4858',
    fontWeight: 'bold'
  }
};

export const DetalleVentaComponent = ({ show, handleClose, ventaId }) => {
  const [venta, setVenta] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [atencion, setAtencion] = useState(null);
  const [reservaData, setReservaData] = useState(null);
  const [mesas, setMesas] = useState([]);

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
    // No necesitamos importar CSS externo porque todos los estilos ahora están inline en el JS
    ventanaImpresion.document.write('</head><body style="font-family: Arial, sans-serif; padding: 20px;">');
    ventanaImpresion.document.write(contenidoModal.innerHTML);
    ventanaImpresion.document.write('</body></html>');

    ventanaImpresion.document.close();
    ventanaImpresion.print();
  };

  if (!venta) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      {/* Ocultamos el Header por defecto de bootstrap o lo personalizamos para que coincida */}
      <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
      </Modal.Header>
      
      <Modal.Body id="ticketVenta" style={{ padding: '0 1rem 1rem 1rem' }}>
        {/* Contenedor principal estilizado */}
        <div style={{
            ...estilos.container,
            margin: '0', // Reseteamos margen para el modal
            maxWidth: '100%', // Ancho completo dentro del modal
            boxShadow: 'none' // Quitamos sombra doble
        }}>
          
          <h4 style={estilos.title}>🎫 TICKET DE VENTA 🎫</h4>

          <div style={{ fontSize: '1rem', color: '#333', lineHeight: '1.6' }}>
            <div><span style={estilos.infoLabel}>No. Venta:</span> {venta.idVenta}</div>
            <div><span style={estilos.infoLabel}>Fecha:</span> {formatearFecha(venta.fechaVenta)}</div>
            <div><span style={estilos.infoLabel}>Cliente:</span> {obtenerCliente(venta.idCliente)}</div>
            <div>
                <span style={estilos.infoLabel}>Reserva asociada:</span>{' '}
                {venta.idReserva ? `#${venta.idReserva}` : 'Sin reserva'}
            </div>
            {venta.idReserva && (
              <div><span style={estilos.infoLabel}>Número de mesa:</span> {obtenerMesa()}</div>
            )}
            <div><span style={estilos.infoLabel}>Atendido por:</span> {obtenerMesero()}</div>
          </div>

          <table style={estilos.table}>
            <thead style={estilos.thead}>
              <tr>
                <th style={estilos.th}>Cant.</th>
                <th style={estilos.th}>Producto</th>
                <th style={estilos.th}>Precio U.</th>
                <th style={estilos.th}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((d, index) => (
                <tr key={d.idDetalle} style={index % 2 === 0 ? estilos.rowEven : {}}>
                  <td style={estilos.tdCentered}>{d.cantidad}</td>
                  <td style={estilos.td}>{obtenerProducto(d.idProducto)}</td>
                  <td style={estilos.tdCentered}>💲{d.precioUnitario?.toFixed(2)}</td>
                  <td style={estilos.tdCentered}>💲{(d.cantidad * d.precioUnitario).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={estilos.totalText}>
            Total: ${venta.total?.toFixed(2)}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer style={{ borderTop: 'none', justifyContent: 'space-between' }}>
        <button
          style={estilos.btnPrimary}
          onClick={imprimirTicket}
        >
          🧾 Imprimir ticket
        </button>
        <button 
          style={estilos.btnSecondary} 
          onClick={handleClose}
        >
          ➜ Cerrar
        </button>
      </Modal.Footer>
    </Modal>
  );
};