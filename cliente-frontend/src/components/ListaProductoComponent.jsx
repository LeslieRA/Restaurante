import React, { useEffect, useState } from "react";
import {
  listaProductos,
  deleteProducto,
  buscarProductoPorNombre,
  buscarProductoPorTipo,
  buscarProductoPorRangoPrecio,
} from "../services/ProductoService";
import { listaTiposProductos } from "../services/TipoProductoService";
import { useNavigate } from "react-router-dom";

export const ListaProductosComponent = () => {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  // Estados para búsqueda
  const [criterio, setCriterio] = useState("nombre");
  const [busqueda, setBusqueda] = useState("");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

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
    }
  };

  useEffect(() => {
    getAllProductos();
    getTipos();
  }, []);

  function getAllProductos() {
    listaProductos()
      .then((response) => {
        const activos = response.data.filter((p) => p.estado === true);
        setProductos(activos);
      })
      .catch((error) => console.error(error));
  }

  function getTipos() {
    listaTiposProductos()
      .then((response) => setTipos(response.data))
      .catch((error) => console.error(error));
  }

  function realizarBusqueda(e) {
    e.preventDefault();

    if (criterio === "nombre") {
      if (!busqueda.trim()) return getAllProductos();
      buscarProductoPorNombre(busqueda)
        .then((res) => setProductos(res.data))
        .catch(console.error);
    } else if (criterio === "tipo") {
      if (!tipoSeleccionado) return getAllProductos();
      buscarProductoPorTipo(tipoSeleccionado)
        .then((res) => setProductos(res.data))
        .catch(console.error);
    } else if (criterio === "precio") {
      if (!precioMin || !precioMax) return getAllProductos();
      buscarProductoPorRangoPrecio(precioMin, precioMax)
        .then((res) => setProductos(res.data))
        .catch(console.error);
    }
  }

  function limpiarBusqueda() {
    setBusqueda("");
    setTipoSeleccionado("");
    setPrecioMin("");
    setPrecioMax("");
    setCriterio("nombre");
    getAllProductos();
  }

  function nuevoProducto() {
    navegar("/producto/crear");
  }

  function actualizarProducto(id_producto) {
    navegar(`/producto/edita/${id_producto}`);
  }

  function eliminarProducto(id_producto) {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      deleteProducto(id_producto)
        .then(() => getAllProductos())
        .catch(console.error);
    }
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
      {/* Botón crear + título */}
      <div style={estilos.buttonContainer}>
        <button
          style={estilos.btnPrimary}
          onClick={nuevoProducto}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span>➕</span>
          Nuevo Producto
        </button>
      </div>

      <h2 style={estilos.title}>
        ☕ Lista de Productos
      </h2>

      {/* Barra de filtros */}
      <div>
        <div style={estilos.searchContainer}>
          <label style={estilos.filterLabel}>
            🔍 Filtro de búsqueda:
          </label>

          <select
            style={estilos.select}
            value={criterio}
            onChange={(e) => setCriterio(e.target.value)}
          >
            <option value="nombre">Por Nombre</option>
            <option value="tipo">Por Tipo</option>
            <option value="precio">Por Rango de Precio</option>
          </select>

          {/* Input dinámico según criterio */}
          {criterio === "nombre" && (
            <input
              type="text"
              style={getInputStyle('nombre')}
              placeholder="Buscar por nombre del producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onFocus={() => setFocusedInput('nombre')}
              onBlur={() => setFocusedInput(null)}
            />
          )}

          {criterio === "tipo" && (
            <select
              style={estilos.select}
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
            >
              <option value="">Selecciona un tipo</option>
              {tipos.map((t) => (
                <option key={t.id_tipo} value={t.id_tipo}>
                  {t.tipo}
                </option>
              ))}
            </select>
          )}

          {criterio === "precio" && (
            <>
              <input
                type="number"
                style={getInputStyle('precioMin')}
                placeholder="Precio mínimo"
                value={precioMin}
                onChange={(e) => setPrecioMin(e.target.value)}
                onFocus={() => setFocusedInput('precioMin')}
                onBlur={() => setFocusedInput(null)}
              />
              <input
                type="number"
                style={getInputStyle('precioMax')}
                placeholder="Precio máximo"
                value={precioMax}
                onChange={(e) => setPrecioMax(e.target.value)}
                onFocus={() => setFocusedInput('precioMax')}
                onBlur={() => setFocusedInput(null)}
              />
            </>
          )}

          {/* Botones de acción */}
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

      {/* Tabla de productos */}
      <div style={{ overflowX: 'auto' }}>
        <table style={estilos.table}>
          <thead style={estilos.thead}>
            <tr>
              <th style={estilos.th}>ID</th>
              <th style={estilos.th}>Nombre</th>
              <th style={estilos.th}>Descripción</th>
              <th style={estilos.th}>Tipo</th>
              <th style={estilos.th}>Precio</th>
              <th style={estilos.th}>Imagen</th>
              <th style={estilos.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((producto, index) => (
                <tr
                  key={producto.id_producto}
                  style={getRowStyle(index)}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={estilos.tdCentered}>
                    <strong>{producto.id_producto}</strong>
                  </td>
                  <td style={estilos.td}>
                    <strong style={{ color: '#2f4858' }}>
                      {producto.nombreProducto}
                    </strong>
                  </td>
                  <td style={estilos.td}>{producto.descripcionProducto}</td>
                  <td style={estilos.tdCentered}>
                    <span style={{
                      backgroundColor: '#c29c5e',
                      color: 'white',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}>
                      {producto.tipo?.tipo}
                    </span>
                  </td>
                  <td style={estilos.tdCentered}>
                    <span style={{
                      color: '#578661',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}>
                      ${producto.precioProducto.toFixed(2)}
                    </span>
                  </td>
                  <td style={estilos.tdCentered}>
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombreProducto}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #e0ddd0",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>
                        Sin imagen
                      </span>
                    )}
                  </td>
                  <td style={estilos.tdCentered}>
                    <button
                      style={estilos.btnEdit}
                      onClick={() => actualizarProducto(producto.id_producto)}
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
                      onClick={() => eliminarProducto(producto.id_producto)}
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
            ) : (
              <tr>
                <td colSpan="7" style={estilos.emptyMessage}>
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                    <div>No hay productos que coincidan con el filtro seleccionado</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};