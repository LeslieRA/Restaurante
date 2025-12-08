import React, { useEffect, useState } from 'react';
import { crearTipoProducto, getTipoProducto, updateTipoProducto } from '../services/TipoProductoService';
import { useNavigate, useParams } from 'react-router-dom';

// --- ESTILOS DEFINIDOS (Tema Dorado/Elegante) ---
const estilos = {
  container: {
    maxWidth: '500px', // Ancho ideal para este formulario pequeño
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
    color: '#2f4858', // ✅ TEXTO OSCURO para evitar letras blancas
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

export const TipoProductoComponent = () => {
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [errors, setErrors] = useState({
    tipo: '',
    descripcion: ''
  })

  const navegar = useNavigate();
  const { id } = useParams();

  // Handlers de inputs
  const actualizaTipo = (e) => setTipo(e.target.value);
  const actualizaDescripcion = (e) => setDescripcion(e.target.value);

  // Validación del formulario
  function validaForm() {
    let valida = true;
    const errorsCopy = { ...errors };

    if (tipo.trim()) {
      errorsCopy.tipo = '';
    } else {
      errorsCopy.tipo = 'El tipo es requerido';
      valida = false;
    }

    if (descripcion.trim()) {
      errorsCopy.descripcion = '';
    } else {
      errorsCopy.descripcion = 'La descripcion es requerida';
      valida = false;
    }

    setErrors(errorsCopy);
    return valida;
  }

  // Carga datos si es edición
  useEffect(() => {
    if (!id) return;
    getTipoProducto(id)
      .then(({ data }) => {
        setTipo(data.tipo ?? '');
        setDescripcion(data.descripcion ?? '')
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Guardar Tipo de Producto
  function saveTipoProducto(e) {
    e.preventDefault();

    if (validaForm()) {
      const tipoProducto = { tipo, descripcion };

      if (id) {
        // Editar
        updateTipoProducto(id, tipoProducto)
          .then((response) => {
            console.log("Tipo de producto actualizado: ", response.data);
            navegar("/tipoProducto/lista");
          })
          .catch((error) => console.error(error));
      } else {
        // Crear
        crearTipoProducto(tipoProducto)
          .then((response) => {
            console.log("Tipo de producto registrado", response.data);
            navegar('/tipoProducto/lista');
            setTipo('');
            setDescripcion('');
          })
          .catch((error) => console.error(error));
      }
    }
  }

  function cancelar() {
    navegar('/tipoProducto/lista');
  }

  function pagTitulo() {
    return id ? "Modificar tipo de producto" : "Registrar nuevo tipo";
  }

  return (
    <div style={estilos.container}>
      <h2 style={estilos.title}>{pagTitulo()}</h2>

      <form onSubmit={saveTipoProducto}>
        
        {/* Tipo */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Tipo</label>
          <input
            type="text"
            style={{
                ...estilos.formInput,
                borderColor: errors.tipo ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
            placeholder="Ejemplo: Bebidas, Postres, Tacos..."
            value={tipo}
            onChange={actualizaTipo}
          />
          {errors.tipo && <div style={estilos.errorMsg}>{errors.tipo}</div>}
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={estilos.label}>Descripción</label>
          <textarea
            style={{
                ...estilos.formInput,
                minHeight: '100px', // Altura extra para el textarea
                borderColor: errors.descripcion ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
            rows="3"
            placeholder="Describe este tipo de producto"
            value={descripcion}
            onChange={actualizaDescripcion}
          />
          {errors.descripcion && <div style={estilos.errorMsg}>{errors.descripcion}</div>}
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