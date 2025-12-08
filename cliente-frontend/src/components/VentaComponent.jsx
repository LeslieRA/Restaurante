import React, { useState, useEffect } from 'react';
import { crearVenta, getVenta, updateVenta } from '../services/VentaService';
import { getDetallesByVenta } from '../services/DetalleVentaService';
import { listaClientes } from '../services/ClienteService';
import { listaProductos } from '../services/ProductoService';
import { listaEmpleados } from '../services/EmpleadoService';
import { listaAtenciones, crearAtencion } from '../services/AtenderService';
import { getReserva } from '../services/ReservaService';
import { useNavigate, useParams } from 'react-router-dom';

// --- ESTILOS DEFINIDOS (Mismo objeto que el anterior) ---
const estilos = {
  container: {
    maxWidth: '800px', // Ajustado un poco para formulario
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
  // Reutilizamos el estilo de input de búsqueda para los inputs del formulario
  formInput: {
    width: '100%',
    padding: '0.8rem 1rem',
    border: '2px solid #e0ddd0',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: 'Arial, sans-serif',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#fff',
    color: '#000000',        // ✅ AGREGA ESTO: Fuerza el texto a negro
  },
  label: {
    color: '#2f4858',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    display: 'block'
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
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
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
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
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
  totalContainer: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px dashed #c29c5e'
  },
  totalText: {
    color: '#c29c5e',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    fontFamily: 'Georgia, serif'
  },
  errorMsg: {
    color: '#c0615f',
    fontSize: '0.85rem',
    marginTop: '0.25rem'
  }
};

export const VentaComponent = () => {
  const [cliente, setCliente] = useState('');
  const [reserva, setReserva] = useState('');
  const [empleado, setEmpleado] = useState('');
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [detalles, setDetalles] = useState([{ idProducto: '', cantidad: 1 }]);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState({ cliente: '', detalles: '', empleado: '' });

  const navegar = useNavigate();
  const { id, idReserva } = useParams();

  // 🟠 Si viene desde una reserva, obtener cliente automático
  useEffect(() => {
    if (idReserva) {
      setReserva(idReserva);
      getReserva(idReserva)
        .then(({ data }) => {
          if (data.idCliente) setCliente(String(data.idCliente));
        })
        .catch((err) => console.error('Error al cargar reserva:', err));
    }
  }, [idReserva]);

  // 🟢 Calcular total
  useEffect(() => {
    let totalTemp = 0;
    for (const det of detalles) {
      const prod = productos.find((p) => p.id_producto === Number(det.idProducto));
      if (prod) totalTemp += Number(prod.precioProducto) * Number(det.cantidad || 0);
    }
    setTotal(totalTemp);
  }, [detalles, productos]);

  // 🟣 Cargar catálogos
  useEffect(() => {
    listaClientes().then((res) => setClientes(res.data)).catch(console.error);

    listaProductos()
      .then((response) => {
        const activos = response.data.filter((p) => p.estado === true);
        setProductos(activos);
      })
      .catch(console.error);

    listaEmpleados()
      .then((res) => {
        const meseros = res.data.filter((e) => e.puesto?.toLowerCase() === 'mesero');
        setEmpleados(meseros);
      })
      .catch(console.error);
  }, []);

  // 🔹 NUEVO: cargar datos si estamos en modo edición
  useEffect(() => {
    if (id) {
      // 1️⃣ Cargar datos de la venta
      getVenta(id)
        .then(({ data }) => {
          setCliente(String(data.idCliente));
          setReserva(data.idReserva ? String(data.idReserva) : '');
        })
        .catch((err) => console.error('Error al obtener venta:', err));

      // 2️⃣ Cargar detalles de la venta
      getDetallesByVenta(id)
        .then(({ data }) => {
          const detConvertidos = data.map((d) => ({
            idProducto: d.idProducto,
            cantidad: d.cantidad,
          }));
          setDetalles(detConvertidos);
        })
        .catch((err) => console.error('Error al obtener detalles:', err));

      // 3️⃣ Obtener la atención asociada (para saber el mesero)
      listaAtenciones()
        .then(({ data }) => {
          const registro = data.find((a) => a.idVenta === Number(id));
          if (registro) setEmpleado(String(registro.idEmpleado));
        })
        .catch((err) => console.error('Error al cargar atención:', err));
    }
  }, [id]);

  // 🔍 Validar formulario
  function validaForm() {
    let valido = true;
    const copy = { ...errors };

    if (!cliente.trim()) {
      copy.cliente = 'Debe seleccionar un cliente';
      valido = false;
    } else copy.cliente = '';

    if (!empleado.trim()) {
      copy.empleado = 'Debe seleccionar el mesero que atiende la venta';
      valido = false;
    } else copy.empleado = '';

    if (detalles.length === 0 || detalles.some((d) => !d.idProducto || Number(d.cantidad) <= 0)) {
      copy.detalles = 'Debe agregar al menos un producto válido';
      valido = false;
    } else copy.detalles = '';

    setErrors(copy);
    return valido;
  }

  // ➕➖ Actualizar detalles
  const agregarDetalle = () =>
    setDetalles([...detalles, { idProducto: '', cantidad: 1 }]);

  const eliminarDetalle = (index) => {
    const nuevos = [...detalles];
    nuevos.splice(index, 1);
    setDetalles(nuevos);
  };

  const actualizarDetalle = (index, campo, valor) => {
    const nuevos = [...detalles];
    nuevos[index][campo] = campo === 'cantidad' ? Number(valor) : valor;
    setDetalles(nuevos);
  };

  // 💾 Guardar / actualizar venta
  async function saveVenta(e) {
    e.preventDefault();
    if (!validaForm()) return;

    const venta = {
      idCliente: Number(cliente),
      idReserva: reserva ? Number(reserva) : null,
      detalles: detalles
        .filter(d => d.idProducto && Number(d.cantidad) > 0)
        .map(d => ({ idProducto: Number(d.idProducto), cantidad: Number(d.cantidad) })),
    };

    try {
      const { data: ventaGuardada } = id
        ? await updateVenta(id, venta)
        : await crearVenta(venta);

      const atenderBase = {
        idEmpleado: Number(empleado),
        idVenta: Number(ventaGuardada.idVenta),
      };

      const { data: atenciones } = await listaAtenciones();
      const existente = atenciones.find(
        a => Number(a.idVenta ?? a.idventa) === Number(ventaGuardada.idVenta)
      );

      if (existente) {
        const idAtender = Number(existente.idAtender ?? existente.idatender);
        const idEmpleadoExistente = Number(existente.idEmpleado ?? existente.idempleado);
        const atenderPayload = { ...atenderBase, idAtender };

        if (idEmpleadoExistente !== atenderPayload.idEmpleado) {
          await updateAtencion(idAtender, atenderPayload); 
        }
      } else {
        await crearAtencion(atenderBase);
      }

      alert(id ? 'Venta actualizada correctamente' : 'Venta registrada correctamente');
      navegar('/venta/lista');
    } catch (error) {
      console.error('Error al guardar venta o atención:', error);
      const msg = error?.response?.data ?? 'Ocurrió un error al registrar la venta.';
      alert(msg);
    }
  }

  const cancelar = () => navegar('/venta/lista');

  return (
    <div style={estilos.container}>
      <h2 style={estilos.title}>{id ? 'Modificar venta' : 'Registrar venta'}</h2>

      <form onSubmit={saveVenta}>
        
        {/* Cliente */}
        {!reserva && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={estilos.label}>Cliente</label>
            <select
              style={{
                ...estilos.formInput,
                borderColor: errors.cliente ? '#c0615f' : estilos.formInput.border.split(' ')[2]
              }}
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.idCliente} value={c.idCliente}>
                  {c.nombreCliente}
                </option>
              ))}
            </select>
            {errors.cliente && <div style={estilos.errorMsg}>{errors.cliente}</div>}
          </div>
        )}

        {/* Empleado */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Empleado (Mesero)</label>
          <select
            style={{
                ...estilos.formInput,
                borderColor: errors.empleado ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
            value={empleado}
            onChange={(e) => setEmpleado(e.target.value)}
          >
            <option value="">Seleccione un mesero</option>
            {empleados.map((emp) => (
              <option
                key={emp.idEmpleado ?? emp.idempleado}
                value={emp.idEmpleado ?? emp.idempleado}
              >
                {emp.nombre}
              </option>
            ))}
          </select>
          {errors.empleado && <div style={estilos.errorMsg}>{errors.empleado}</div>}
        </div>

        {/* Productos */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ ...estilos.label, borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            Productos
          </label>
          
          {detalles.map((det, index) => (
            <div key={index} className="d-flex align-items-center mb-2 gap-2">
              <select
                style={{ ...estilos.formInput, flex: 3 }}
                value={det.idProducto}
                onChange={(e) => actualizarDetalle(index, 'idProducto', e.target.value)}
              >
                <option value="">Seleccione producto</option>
                {productos.map((p) => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombreProducto} — ${p.precioProducto}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                style={{ ...estilos.formInput, flex: 1, minWidth: '80px' }}
                value={det.cantidad}
                onChange={(e) => actualizarDetalle(index, 'cantidad', e.target.value)}
              />

              <button
                type="button"
                style={estilos.btnDelete}
                onClick={() => eliminarDetalle(index)}
                title="Eliminar producto"
              >
                ✘
              </button>
            </div>
          ))}

          <div style={{ marginTop: '1rem' }}>
             <button
                type="button"
                style={{...estilos.btnPrimary, fontSize: '0.9rem', padding: '0.6rem 1rem'}}
                onClick={agregarDetalle}
            >
                ➕ Agregar otro producto
            </button>
          </div>
          {errors.detalles && <div style={estilos.errorMsg}>{errors.detalles}</div>}
        </div>

        {/* Total */}
        <div style={estilos.totalContainer}>
          <span style={{ fontSize: '1.2rem', color: '#2f4858', marginRight: '1rem' }}>Total a Pagar:</span>
          <span style={estilos.totalText}>💲{total.toFixed(2)}</span>
        </div>

        {/* Botones de Acción */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <button
            type="submit"
            style={estilos.btnPrimary}
          >
            {id ? '🔄 Actualizar Venta' : '✅ Registrar Venta'}
          </button>
          
          <button
            type="button"
            style={estilos.btnSecondary}
            onClick={cancelar}
          >
            ❌ Cancelar
          </button>
        </div>

      </form>
    </div>
  );
};
