import React, { useState, useEffect } from 'react';
import { crearReserva, getReserva, updateReserva } from '../services/ReservaService';
import { listaMesas } from '../services/MesaService';
import { listaClientes } from '../services/ClienteService';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsuarioLogueado } from "../services/AuthService";

// --- ESTILOS DEFINIDOS (Tema Dorado/Elegante) ---
const estilos = {
  container: {
    maxWidth: '500px',
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
    color: '#2f4858', // ✅ TEXTO OSCURO
  },
  // Estilo específico para inputs deshabilitados (ej. nombre del cliente)
  disabledInput: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
    cursor: 'not-allowed'
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
  errorMsg: {
    color: '#c0615f',
    fontSize: '0.85rem',
    marginTop: '0.25rem'
  }
};

export const ReservaComponent = () => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [mesa, setMesa] = useState('');
  const [cliente, setCliente] = useState('');
  const [mesas, setMesas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [errors, setErrors] = useState({
    fecha: '',
    hora: '',
    mesa: '',
    cliente: ''
  });

  const usuario = getUsuarioLogueado();
  const rol = usuario?.perfil;

  const navegar = useNavigate();
  const { id } = useParams();

  // Handlers
  const actualizaFecha = (e) => setFecha(e.target.value);
  const actualizaHora = (e) => setHora(e.target.value);
  const actualizaMesa = (e) => setMesa(e.target.value);
  const actualizaCliente = (e) => setCliente(e.target.value);

  // Validación
  function validaForm() {
    let valida = true;
    const copy = { ...errors };

    if (String(fecha).trim()) copy.fecha = ''; else { copy.fecha = 'La fecha es requerida'; valida = false; }
    if (String(hora).trim()) copy.hora = ''; else { copy.hora = 'La hora es requerida'; valida = false; }
    if (String(mesa).trim()) copy.mesa = ''; else { copy.mesa = 'Debe seleccionar una mesa'; valida = false; }
    if (String(cliente).trim()) copy.cliente = ''; else { copy.cliente = 'Debe seleccionar un cliente'; valida = false; }

    setErrors(copy);
    return valida;
  }

  // Cargar datos si es edición
  useEffect(() => {
    if (!id) return;
    getReserva(id)
      .then(({ data }) => {
        setFecha(data.fecha ?? '');
        const h = data.hora || '';
        setHora(h.length >= 5 ? h.substring(0, 5) : '');
        
        const idMesaFromDto = data.idMesa;
        const idMesaFromEntity = data.mesa?.idMesa ?? data.mesa?.id_mesa;
        setMesa(
          idMesaFromDto != null
            ? String(idMesaFromDto)
            : (idMesaFromEntity != null ? String(idMesaFromEntity) : '')
        );
        
        setCliente(data.idCliente != null ? String(data.idCliente) : '');
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Cargar listas
  useEffect(() => {
    listaMesas()
      .then((res) => {
        const mesasDisponibles = res.data.filter(mesa => mesa.estado === true);
        setMesas(mesasDisponibles);
      })
      .catch(console.error);

    listaClientes()
      .then((res) => {
        setClientes(res.data);
        if (rol === "cliente") {
          setCliente(String(usuario.id)); 
        }
      })
      .catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Guardar / Actualizar
  function saveReserva(e) {
    e.preventDefault();
    if (!validaForm()) return;

    const reserva = {
      fecha,
      hora,
      idMesa: Number(mesa),
      idCliente: Number(cliente)
    };

    const op = id ? updateReserva(id, reserva) : crearReserva(reserva);

    op
      .then(() => navegar('/reserva/lista'))
      .catch((error) => {
        console.error(error);
        const mensaje = error.response?.data || "❌ Ocurrió un error inesperado.";
        alert(mensaje);
      });
  }

  function cancelar() {
    navegar('/reserva/lista');
  }

  function pagTitulo() {
    return id ? 'Modificar reserva' : 'Registrar reserva';
  }

  return (
    <div style={estilos.container}>
      <h2 style={estilos.title}>{pagTitulo()}</h2>

      <form onSubmit={saveReserva}>
        
        {/* Fecha */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Fecha de reserva</label>
          <input
            type="date"
            required
            min={new Date().toISOString().split("T")[0]} 
            value={fecha}
            onChange={actualizaFecha}
            style={{
                ...estilos.formInput,
                borderColor: errors.fecha ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
          />
          {errors.fecha && <div style={estilos.errorMsg}>{errors.fecha}</div>}
        </div>

        {/* Hora */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Hora de reserva</label>
          <input
            type="time"
            required
            value={hora}
            onChange={actualizaHora}
            min="09:00"
            max="22:00"
            step="900" // 15 minutos
            style={{
                ...estilos.formInput,
                borderColor: errors.hora ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
          />
          {errors.hora && <div style={estilos.errorMsg}>{errors.hora}</div>}
        </div>

        {/* Mesa */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Mesa</label>
          <select
            value={mesa}
            onChange={actualizaMesa}
            style={{
                ...estilos.formInput,
                borderColor: errors.mesa ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
          >
            <option value="">Seleccione una mesa</option>
            {mesas.map((m) => {
              const idValor = m.idMesa ?? m.id_mesa; 
              return (
                <option key={idValor} value={idValor}>
                  Mesa {m.numero} — {m.ubicacion}
                </option>
              );
            })}
          </select>
          {errors.mesa && <div style={estilos.errorMsg}>{errors.mesa}</div>}
        </div>

        {/* Cliente */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={estilos.label}>Cliente</label>
          {rol === "cliente" ? (
            <input
              type="text"
              value={usuario.nombre}
              disabled
              style={{ ...estilos.formInput, ...estilos.disabledInput }}
            />
          ) : (
            <select
              value={cliente}
              onChange={actualizaCliente}
              style={{
                ...estilos.formInput,
                borderColor: errors.cliente ? '#c0615f' : estilos.formInput.border.split(' ')[2]
              }}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((c) => (
                <option key={c.idCliente} value={c.idCliente}>
                  {c.nombreCliente}
                </option>
              ))}
            </select>
          )}
          {rol !== "cliente" && errors.cliente && (
            <div style={estilos.errorMsg}>{errors.cliente}</div>
          )}
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            type="submit"
            style={estilos.btnPrimary}
          >
            {id ? '🔄 Actualizar' : '✅ Guardar'}
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