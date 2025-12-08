import React, { useState, useEffect } from 'react';
import { crearProducto, getProducto, updateProducto } from '../services/ProductoService';
import { listaTiposProductos } from '../services/TipoProductoService';
import { useNavigate, useParams } from 'react-router-dom';

// --- ESTILOS DEFINIDOS (Tema Dorado/Elegante) ---
const estilos = {
  container: {
    maxWidth: '600px', // Un poco más ancho para que quepa bien la descripción
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

export const ProductoComponent = () => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcionProducto, setDescripcionProducto] = useState('');
  const [precioProducto, setPrecioProducto] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipos, setTipos] = useState([]);
  const [estado, setEstado] = useState(true);
  const [imagen, setImagen] = useState(null);

  const [errors, setErrors] = useState({
    nombreProducto: '',
    descripcionProducto: '',
    precioProducto: '',
    tipo: ''
  });

  const navegar = useNavigate();
  const { id } = useParams();

  // Funciones para actualizar los estados
  const actualizaNombreProducto = (e) => setNombreProducto(e.target.value);
  const actualizaDescripcionProducto = (e) => setDescripcionProducto(e.target.value);
  const actualizaPrecioProducto = (e) => setPrecioProducto(e.target.value);
  const actualizaTipo = (e) => setTipo(e.target.value);

  // Validación del formulario
  function validaForm() {
    let valida = true;
    const errorsCopy = { ...errors };

    if (String(nombreProducto).trim()) {
      errorsCopy.nombreProducto = '';
    } else {
      errorsCopy.nombreProducto = 'El nombre es requerido';
      valida = false;
    }

    if (String(descripcionProducto).trim()) {
      errorsCopy.descripcionProducto = '';
    } else {
      errorsCopy.descripcionProducto = 'La descripción es requerida';
      valida = false;
    }

    if (String(precioProducto).trim()) {
      errorsCopy.precioProducto = '';
    } else {
      errorsCopy.precioProducto = 'El precio es requerido';
      valida = false;
    }

    if (String(tipo).trim()) {
      errorsCopy.tipo = '';
    } else {
      errorsCopy.tipo = 'El tipo es requerido';
      valida = false;
    }

    setErrors(errorsCopy);
    return valida;
  }

  // Cargar los datos si es edición
  useEffect(() => {
    if (!id) return;
    getProducto(id)
      .then(({ data }) => {
        setNombreProducto(data.nombreProducto ?? '');
        setDescripcionProducto(data.descripcionProducto ?? '');
        setPrecioProducto(data.precioProducto != null ? String(data.precioProducto) : '');
        setTipo(data.tipo?.id_tipo != null ? String(data.tipo.id_tipo) : '');
        setEstado(data.estado ?? true);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Cargar tipos de producto
  useEffect(() => {
    listaTiposProductos()
      .then((response) => setTipos(response.data))
      .catch((error) => console.error('Error al cargar tipos:', error));
  }, []);

  // Guardar producto / Actualizar
  function saveProducto(e) {
    e.preventDefault();

    if (validaForm()) {
      const formData = new FormData();
      formData.append("nombreProducto", nombreProducto);
      formData.append("descripcionProducto", descripcionProducto);
      formData.append("precioProducto", parseFloat(precioProducto));
      formData.append("estado", estado);
      formData.append("tipo", tipo);

      // Si el usuario seleccionó una imagen
      if (imagen) {
        formData.append("file", imagen);
      }

      // 🟠 Si es edición
      if (id) {
        updateProducto(id, formData)
          .then(() => {
            alert("Producto actualizado correctamente");
            navegar("/producto/lista");
          })
          .catch((error) => console.error(error));
      } else {
        // 🟢 Si es nuevo
        crearProducto(formData)
          .then(() => {
            alert("Producto registrado correctamente");
            navegar("/producto/lista");
          })
          .catch((error) => console.error(error));
      }
    }
  }

  function cancelar() {
    navegar('/producto/lista');
  }

  function pagTitulo() {
    return id ? "Modificar producto" : "Agregar producto";
  }

  return (
    <div style={estilos.container}>
      <h2 style={estilos.title}>{pagTitulo()}</h2>

      <form onSubmit={saveProducto}>
        
        {/* Nombre */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Nombre del Producto</label>
          <input
            type="text"
            placeholder="Ejemplo: Taco de birria, Agua de horchata..."
            value={nombreProducto}
            onChange={actualizaNombreProducto}
            style={{
                ...estilos.formInput,
                borderColor: errors.nombreProducto ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
          />
          {errors.nombreProducto && <div style={estilos.errorMsg}>{errors.nombreProducto}</div>}
        </div>

        {/* Descripción */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Descripción</label>
          <textarea
            rows="3"
            placeholder="Describe brevemente el producto"
            value={descripcionProducto}
            onChange={actualizaDescripcionProducto}
            style={{
                ...estilos.formInput,
                minHeight: '100px',
                borderColor: errors.descripcionProducto ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
          />
          {errors.descripcionProducto && <div style={estilos.errorMsg}>{errors.descripcionProducto}</div>}
        </div>

        {/* Tipo */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Tipo de Producto</label>
          <select
            value={tipo}
            onChange={actualizaTipo}
            style={{
                ...estilos.formInput,
                borderColor: errors.tipo ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
          >
            <option value="">Seleccione un tipo</option>
            {tipos.map((t) => (
              <option key={t.id_tipo} value={t.id_tipo}>
                {t.tipo}
              </option>
            ))}
          </select>
          {errors.tipo && <div style={estilos.errorMsg}>{errors.tipo}</div>}
        </div>

        {/* Precio */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Precio</label>
          <input
            type="number"
            placeholder="Ejemplo: 35.50"
            value={precioProducto}
            onChange={actualizaPrecioProducto}
            style={{
                ...estilos.formInput,
                borderColor: errors.precioProducto ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
          />
          {errors.precioProducto && <div style={estilos.errorMsg}>{errors.precioProducto}</div>}
        </div>

        {/* Imagen */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={estilos.label}>Selecciona una imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            style={{
                ...estilos.formInput,
                padding: '0.6rem', // Ajuste ligero para input file
            }}
          />
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