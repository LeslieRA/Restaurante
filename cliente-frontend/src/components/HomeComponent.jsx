import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HeroSlider } from "./HeroSlider";
import { listaProductos } from "../services/ProductoService";

export const HomeComponent = () => {

  const [productos, setProductos] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = "#f5f5dc";
    return () => {
      document.body.style.backgroundColor = "#f5f5dc";
    };
  }, []);

  useEffect(() => {
    listaProductos()
      .then((res) => {
        const activos = res.data.filter((p) => p.estado === true);
        setProductos(activos);
      })
      .catch(console.error);
  }, []);

  const estilos = {
    heroSection: {
      backgroundColor: '#2f4858',
      color: 'white'
    },
    welcomeSection: {
      backgroundColor: '#c29c5e',
      color: 'white'
    },
    menuSection: {
      backgroundColor: '#f5f5dc'
    },
    aboutSection: {
      backgroundColor: '#899458',
      color: 'white'
    },
    testimonialSection: {
      backgroundColor: '#f5f5dc'
    },
    productCard: {
      backgroundColor: 'white',
      transition: 'all 0.3s ease',
      border: '2px solid #e0ddd0',
      cursor: 'pointer'
    },
    productCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
      borderColor: '#c29c5e'
    },
    testimonialCard: {
      backgroundColor: 'white',
      border: '2px solid #c29c5e'
    },
    titlePrimary: {
      color: '#2f4858',
      fontFamily: 'Georgia, serif'
    },
    priceTag: {
      color: '#578661',
      fontSize: '1.2rem'
    }
  };

  const getCardStyle = (index) => {
    const baseStyle = estilos.productCard;
    return hoveredCard === index 
      ? { ...baseStyle, ...estilos.productCardHover }
      : baseStyle;
  };

  return (
    <div className="w-100" style={{ overflowX: "hidden", padding: 0, margin: 0 }}>

      {/* 🎞️ HERO SLIDER */}
      <HeroSlider />

      {/* 🟦 SECCIÓN AZUL ELEGANTE DE BIENVENIDA */}
      <section
        className="text-white py-5 w-100"
        style={estilos.welcomeSection}
      >
        <div className="container-fluid text-center">
          <h1 className="fw-bold display-5" style={{ fontFamily: 'Georgia, serif' }}>
            Bienvenido a El Café Elegante
          </h1>
          <p className="lead mt-3 mx-auto" style={{ maxWidth: "800px" }}>
            El sabor auténtico que conquista desde el primer sorbo.
          </p>
          <p className="lead mt-3 mx-auto" style={{ maxWidth: "800px" }}>
            Tradición, sazón y amor en cada plato 🍽️✨
          </p>
        </div>
      </section>

      {/* 📌 EXPLORA EL MENÚ */}
      <section className="py-5 w-100" style={estilos.menuSection}>
        <div className="container-fluid text-center">
          <h2 className="fw-bold mb-3" style={estilos.titlePrimary}>
            Explora Nuestro Menú
          </h2>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "600px" }}>
            Descubre nuestros platillos especiales preparados con ingredientes frescos
            y un toque único que nos distingue.
          </p>
        </div>

        <div className="container-fluid mt-4">
          <div className="row justify-content-center g-4">

            {productos.length > 0 ? (
              productos.map((producto, index) => (
                <div
                  key={producto.id_producto}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                >
                  <div
                    className="shadow-sm h-100 p-3 rounded"
                    style={getCardStyle(index)}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >

                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        className="card-img-top rounded"
                        alt={producto.nombreProducto}
                        style={{ 
                          height: "200px", 
                          objectFit: "cover",
                          border: '2px solid #e0ddd0'
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center rounded"
                        style={{ 
                          height: "200px",
                          backgroundColor: '#f4f1ea',
                          border: '2px solid #e0ddd0'
                        }}
                      >
                        <span className="text-muted">Sin imagen</span>
                      </div>
                    )}

                    <div className="text-center mt-3">
                      <h5 
                        className="card-title" 
                        style={{ 
                          color: '#2f4858',
                          fontFamily: 'Georgia, serif',
                          fontWeight: 'bold'
                        }}
                      >
                        {producto.nombreProducto}
                      </h5>
                      <p className="card-text text-muted small">
                        {producto.descripcionProducto}
                      </p>
                      <p className="fw-bold" style={estilos.priceTag}>
                        ${producto.precioProducto.toFixed(2)}
                      </p>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No hay productos disponibles.</p>
            )}

          </div>
        </div>
      </section>

      {/* 🌿 SOBRE NOSOTROS */}
      <section className="py-5 w-100" style={estilos.aboutSection}>
        <div className="container-fluid text-center">
          <h2 className="fw-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Sobre Nosotros
          </h2>
          <p
            className="mx-auto"
            style={{ 
              maxWidth: "800px", 
              lineHeight: "1.7",
              fontSize: '1.1rem'
            }}
          >
            En <strong style={{ color: '#f5f5dc' }}>El Café Elegante</strong> nos apasiona brindar un sabor único lleno de tradición.
            Cocinamos nuestros platillos con dedicación, siguiendo recetas familiares de generaciones.
          </p>
          <p
            className="mx-auto mt-3"
            style={{ 
              maxWidth: "800px", 
              lineHeight: "1.7"
            }}
          >
            Cada plato es preparado con amor y los mejores ingredientes para ofrecerte una experiencia gastronómica inolvidable.
          </p>
        </div>
      </section>

      {/* ⭐ TESTIMONIOS */}
      <section className="py-5 w-100" style={estilos.testimonialSection}>
        <div className="container-fluid text-center">
          <h2 className="fw-bold mb-4" style={estilos.titlePrimary}>
            Lo que Dicen Nuestros Clientes
          </h2>
        </div>

        <div className="container-fluid">
          <div className="row g-4 justify-content-center">

            {/* Testimonio 1 */}
            <div className="col-md-4 col-lg-3">
              <div
                className="p-4 rounded shadow-sm h-100"
                style={estilos.testimonialCard}
              >
                <h5 className="fw-bold" style={{ color: '#2f4858' }}>
                  María Gómez
                </h5>
                <p className="text-muted small">Cliente frecuente</p>
                <p className="fst-italic" style={{ color: '#555' }}>
                  "La mejor experiencia gastronómica. Los sabores están en otro nivel."
                </p>
                <div style={{ color: '#c29c5e', fontSize: '1.2rem' }}>
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="col-md-4 col-lg-3">
              <div
                className="p-4 rounded shadow-sm h-100"
                style={estilos.testimonialCard}
              >
                <h5 className="fw-bold" style={{ color: '#2f4858' }}>
                  José Ramírez
                </h5>
                <p className="text-muted small">Visitante</p>
                <p className="fst-italic" style={{ color: '#555' }}>
                  "Los platillos tienen un sabor único. El servicio es excepcional."
                </p>
                <div style={{ color: '#c29c5e', fontSize: '1.2rem' }}>
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="col-md-4 col-lg-3">
              <div
                className="p-4 rounded shadow-sm h-100"
                style={estilos.testimonialCard}
              >
                <h5 className="fw-bold" style={{ color: '#2f4858' }}>
                  Ana Torres
                </h5>
                <p className="text-muted small">Cliente nueva</p>
                <p className="fst-italic" style={{ color: '#555' }}>
                  "Ambiente elegante y servicio impecable. Altamente recomendado."
                </p>
                <div style={{ color: '#c29c5e', fontSize: '1.2rem' }}>
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 📍 FOOTER / LLAMADO A LA ACCIÓN */}
      <section 
        className="py-4 w-100 text-center text-white"
        style={{ backgroundColor: '#2f4858' }}
      >
        <div className="container-fluid">
          <p className="mb-2" style={{ fontSize: '1.1rem' }}>
            📍 Visítanos o haz tu pedido en línea
          </p>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            © 2024 El Café Elegante. Todos los derechos reservados.
          </p>
        </div>
      </section>

    </div>
  );
};