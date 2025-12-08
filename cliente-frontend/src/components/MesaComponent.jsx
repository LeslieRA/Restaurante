import React, { useState, useEffect } from 'react';
import { crearMesa, getMesa, updateMesa } from '../services/MesaService';
import { useNavigate, useParams } from 'react-router-dom';

// --- ESTILOS DEFINIDOS (Tema Dorado/Elegante) ---
const estilos = {
  container: {
    maxWidth: '500px', // Ancho ideal para formulario de mesa
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

export const MesaComponent = () => {
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const [errors, setErrors] = useState({
    numero: '',
    capacidad: '',
    ubicacion: ''
  });

  const navegar = useNavigate();
  const { id } = useParams();

  // Handlers
  const actualizaNumeroMesa = (e) => setNumero(e.target.value);
  const actualizaCapacidad = (e) => setCapacidad(e.target.value);
  const actualizaUbicacion = (e) => setUbicacion(e.target.value);

  // Validación del formulario
  function validaForm() {
    let valida = true;
    const errorsCopy = { ...errors };

    if (numero.trim()) {
      errorsCopy.numero = '';
    } else {
      errorsCopy.numero = 'El número de mesa es requerido';
      valida = false;
    }

    if (capacidad.trim()) {
      errorsCopy.capacidad = '';
    } else {
      errorsCopy.capacidad = 'La capacidad es requerida';
      valida = false;
    }

    if (ubicacion.trim()) {
      errorsCopy.ubicacion = '';
    } else {
      errorsCopy.ubicacion = 'La ubicación es requerida';
      valida = false;
    }

    setErrors(errorsCopy);
    return valida;
  }

  // Cargar los datos si es edición
  useEffect(() => {
    if (!id) return;
    getMesa(id)
      .then(({ data }) => {
        setNumero(data.numero != null ? String(data.numero) : '');
        setCapacidad(data.capacidad != null ? String(data.capacidad) : '');
        setUbicacion(data.ubicacion ?? '');
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Guardar o actualizar mesa
  function saveMesa(e) {
    e.preventDefault();

    if (validaForm()) {
      const mesa = { numero, capacidad, ubicacion };

      if (id) {
        // Editar mesa existente
        updateMesa(id, mesa)
          .then((response) => {
            console.log('Mesa actualizada:', response.data);
            navegar('/mesa/lista');
          })
          .catch((error) => console.error(error));
      } else {
        // Crear nueva mesa
        crearMesa(mesa)
          .then((response) => {
            console.log('Mesa creada:', response.data);
            navegar('/mesa/lista');
            // limpiar campos
            setNumero('');
            setCapacidad('');
            setUbicacion('');
          })
          .catch((error) => console.error(error));
      }
    }
  }

  // Cancelar y regresar
  function cancelar() {
    navegar('/mesa/lista');
  }

  // Título dinámico
  function pagTitulo() {
    return id ? "Modificar mesa" : "Agregar mesa";
  }

  return (
    <div style={estilos.container}>
      <h2 style={estilos.title}>{pagTitulo()}</h2>

      <form onSubmit={saveMesa}>
        
        {/* Número */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Número de Mesa</label>
          <input
            type="text"
            placeholder="Ejemplo: 1, 2, 3..."
            value={numero}
            onChange={actualizaNumeroMesa}
            style={{
                ...estilos.formInput,
                borderColor: errors.numero ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
          />
          {errors.numero && <div style={estilos.errorMsg}>{errors.numero}</div>}
        </div>

        {/* Capacidad */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Capacidad (Personas)</label>
          <input
            type="number"
            placeholder="Ejemplo: 4"
            value={capacidad}
            onChange={actualizaCapacidad}
            style={{
                ...estilos.formInput,
                borderColor: errors.capacidad ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
          />
          {errors.capacidad && <div style={estilos.errorMsg}>{errors.capacidad}</div>}
        </div>

        {/* Ubicación */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={estilos.label}>Ubicación</label>
          <input
            type="text"
            placeholder="Ejemplo: Terraza, Interior, Barra..."
            value={ubicacion}
            onChange={actualizaUbicacion}
            style={{
                ...estilos.formInput,
                borderColor: errors.ubicacion ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
          />
          {errors.ubicacion && <div style={estilos.errorMsg}>{errors.ubicacion}</div>}
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