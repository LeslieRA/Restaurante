import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { listaProductos } from "../services/ProductoService";

export const HomeComponent = () => {
  const [productos, setProductos] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('todos');

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

  const colores = {
    azulOscuro: '#2f4858',
    dorado: '#c29c5e',
    beige: '#f5f5dc',
    verdeOliva: '#899458',
    verde: '#578661',
    beigeClaro: '#f4f1ea'
  };

  const categorias = [
    { id: 'todos', nombre: '☕ Todos', icono: '🍽️' },
    { id: 'bebidas', nombre: 'Bebidas Calientes', icono: '☕' },
    { id: 'frias', nombre: 'Bebidas Frías', icono: '🥤' },
    { id: 'postres', nombre: 'Postres', icono: '🍰' },
    { id: 'snacks', nombre: 'Snacks', icono: '🥐' }
  ];

  return (
    <div style={{ backgroundColor: colores.beige, minHeight: '100vh' }}>
      
      {/* BANNER PRINCIPAL CON DEGRADADO (NO CAMBIO A NEGRO porque el fondo es oscuro) */}
      <div 
        style={{
          background: `linear-gradient(135deg, ${colores.azulOscuro} 0%, ${colores.verdeOliva} 100%)`,
          padding: '80px 20px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.3
        }}></div>
        
        <div className="container text-center position-relative" style={{ zIndex: 1 }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: colores.dorado,
            padding: '8px 24px',
            borderRadius: '25px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '1px'
          }}>
            ✨ CAFETERÍA PREMIUM
          </div>
          
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            El Café Elegante
          </h1>
          
          <p style={{
            fontSize: '1.3rem',
            color: 'white',
            maxWidth: '600px',
            margin: '0 auto 30px',
            lineHeight: '1.6'
          }}>
            Donde cada taza cuenta una historia de sabor y tradición
          </p>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              backgroundColor: colores.dorado,
              color: 'black',
              border: 'none',
              padding: '15px 35px',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}>
              Ver Menú 📖
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid white',
              padding: '15px 35px',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Hacer Pedido 🛒
            </button>
          </div>
        </div>
      </div>

      {/* CARACTERÍSTICAS PRINCIPALES */}
      <div style={{ backgroundColor: 'white', padding: '60px 20px', color: '#000' }}>
        <div className="container">
          <div className="row g-4">
            {[
              { icono: '☕', titulo: 'Café Premium', desc: 'Granos seleccionados de las mejores regiones' },
              { icono: '🍰', titulo: 'Repostería Artesanal', desc: 'Postres frescos hechos diariamente' },
              { icono: '🌿', titulo: '100% Natural', desc: 'Ingredientes orgánicos y de temporada' },
              { icono: '⚡', titulo: 'Servicio Rápido', desc: 'Tu pedido listo en minutos' }
            ].map((item, idx) => (
              <div key={idx} className="col-md-3 col-sm-6">
                <div style={{
                  textAlign: 'center',
                  padding: '30px 20px',
                  borderRadius: '15px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  backgroundColor: hoveredCard === `feature-${idx}` ? colores.beigeClaro : 'transparent'
                }}
                onMouseEnter={() => setHoveredCard(`feature-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '15px'
                  }}>
                    {item.icono}
                  </div>
                  <h5 style={{
                    color: '#000',
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    fontFamily: 'Georgia, serif'
                  }}>
                    {item.titulo}
                  </h5>
                  <p style={{
                    color: '#000',
                    fontSize: '14px',
                    margin: 0
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORÍAS Y PRODUCTOS */}
      <div style={{ backgroundColor: colores.beige, padding: '80px 20px', color: '#000' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '2.8rem',
              color: '#000',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              Nuestro Menú Especial
            </h2>
            <div style={{
              width: '80px',
              height: '4px',
              backgroundColor: colores.dorado,
              margin: '0 auto 20px',
              borderRadius: '2px'
            }}></div>
            <p style={{
              color: '#000',
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Explora nuestra selección de bebidas y delicias preparadas con amor
            </p>
          </div>

          {/* Filtros de categorías */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}>
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  backgroundColor: selectedCategory === cat.id ? colores.dorado : 'white',
                  color: selectedCategory === cat.id ? 'white' : '#000',
                  border: `2px solid ${selectedCategory === cat.id ? colores.dorado : '#ddd'}`,
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(194,156,94,0.3)' : 'none'
                }}
              >
                {cat.icono} {cat.nombre}
              </button>
            ))}
          </div>

          {/* Grid de Productos */}
          <div className="row g-4">
            {productos.length > 0 ? (
              productos.map((producto, index) => (
                <div key={producto.id_producto} className="col-lg-3 col-md-4 col-sm-6">
                  <div
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: hoveredCard === index ? '0 12px 30px rgba(0,0,0,0.15)' : '0 4px 15px rgba(0,0,0,0.08)',
                      transition: 'all 0.4s ease',
                      transform: hoveredCard === index ? 'translateY(-10px)' : 'translateY(0)',
                      cursor: 'pointer',
                      border: `3px solid ${hoveredCard === index ? colores.dorado : 'transparent'}`
                    }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      {producto.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombreProducto}
                          style={{
                            width: '100%',
                            height: '220px',
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease',
                            transform: hoveredCard === index ? 'scale(1.1)' : 'scale(1)'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '220px',
                          backgroundColor: colores.beigeClaro,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem'
                        }}>
                          ☕
                        </div>
                      )}
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: colores.verde,
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        Disponible
                      </div>
                    </div>

                    <div style={{ padding: '20px', color: '#000' }}>
                      <h5 style={{
                        fontFamily: 'Georgia, serif',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        marginBottom: '8px'
                      }}>
                        {producto.nombreProducto}
                      </h5>
                      
                      <p style={{
                        color: '#000',
                        fontSize: '14px',
                        marginBottom: '15px',
                        lineHeight: '1.5',
                        minHeight: '40px'
                      }}>
                        {producto.descripcionProducto}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          color: colores.verde,
                          fontFamily: 'Georgia, serif'
                        }}>
                          ${producto.precioProducto.toFixed(2)}
                        </span>
                        <button style={{
                          backgroundColor: colores.dorado,
                          color: '#000',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          opacity: hoveredCard === index ? 1 : 0.8
                        }}>
                          Ordenar +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center" style={{ padding: '60px 20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>☕</div>
                <p style={{ color: '#999', fontSize: '1.1rem' }}>
                  No hay productos disponibles en este momento
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN SOBRE NOSOTROS CON IMAGEN (texto principal en negro para fondo claro y en blanco cuando fondo oscuro) */}
      <div style={{
        background: `linear-gradient(to right, ${colores.verdeOliva}, ${colores.verde})`,
        padding: '80px 20px',
        color: 'white'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div style={{
                backgroundColor: colores.dorado,
                padding: '8px 20px',
                borderRadius: '20px',
                display: 'inline-block',
                fontSize: '13px',
                fontWeight: 'bold',
                marginBottom: '20px',
                letterSpacing: '1px',
                color: '#000'
              }}>
                🌿 NUESTRA HISTORIA
              </div>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '25px',
                color: 'white'
              }}>
                Pasión por el Café Perfecto
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                marginBottom: '20px',
                opacity: 0.95,
                color: 'white'
              }}>
                En <strong>El Café Elegante</strong>, cada taza es una obra de arte. 
                Desde 1995, hemos perfeccionado el arte de crear experiencias 
                inolvidables a través del café y la repostería artesanal.
              </p>
            </div>
            <div className="col-md-6">
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '40px',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{
                  fontSize: '6rem',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  ☕
                </div>
                <p style={{
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  fontStyle: 'italic',
                  opacity: 0.9,
                  color: 'white'
                }}>
                  "El café es el abrazo líquido para tu alma"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIOS MODERNOS */}
      <div style={{ backgroundColor: 'white', padding: '80px 20px', color: '#000' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '2.5rem',
              color: '#000',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              Voces de Nuestros Clientes
            </h2>
            <div style={{
              width: '80px',
              height: '4px',
              backgroundColor: colores.dorado,
              margin: '0 auto',
              borderRadius: '2px'
            }}></div>
          </div>

          <div className="row g-4">
            {[
              {
                nombre: 'María Gómez',
                rol: 'Cliente VIP',
                texto: 'El mejor café que he probado en mi vida. El ambiente es acogedor y el personal siempre amable.',
                avatar: '👩'
              },
              {
                nombre: 'José Ramírez',
                rol: 'Visitante Frecuente',
                texto: 'Sus postres son espectaculares. Cada visita es una experiencia única que vale totalmente la pena.',
                avatar: '👨'
              },
              {
                nombre: 'Ana Torres',
                rol: 'Cliente Nueva',
                texto: 'Quedé fascinada con la calidad. Sin duda mi nueva cafetería favorita en la ciudad.',
                avatar: '👩‍🦰'
              }
            ].map((testimonio, idx) => (
              <div key={idx} className="col-md-4">
                <div style={{
                  backgroundColor: colores.beigeClaro,
                  padding: '30px',
                  borderRadius: '20px',
                  border: `3px solid ${colores.dorado}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  transform: hoveredCard === `test-${idx}` ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: hoveredCard === `test-${idx}` ? '0 8px 25px rgba(0,0,0,0.1)' : '0 4px 10px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={() => setHoveredCard(`test-${idx}`)}
                onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '15px'
                  }}>
                    {testimonio.avatar}
                  </div>
                  <p style={{
                    fontStyle: 'italic',
                    color: '#000',
                    lineHeight: '1.7',
                    marginBottom: '20px',
                    fontSize: '15px'
                  }}>
                    "{testimonio.texto}"
                  </p>
                  <div style={{
                    borderTop: `2px solid ${colores.dorado}`,
                    paddingTop: '15px'
                  }}>
                    <h6 style={{
                      color: '#000',
                      fontWeight: 'bold',
                      marginBottom: '5px'
                    }}>
                      {testimonio.nombre}
                    </h6>
                    <p style={{
                      color: '#666',
                      fontSize: '13px',
                      margin: 0
                    }}>
                      {testimonio.rol}
                    </p>
                    <div style={{
                      color: colores.dorado,
                      fontSize: '1rem',
                      marginTop: '8px'
                    }}>
                      ⭐⭐⭐⭐⭐
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LLAMADO A LA ACCIÓN FINAL */}
      <div style={{
        background: `linear-gradient(135deg, ${colores.azulOscuro} 0%, ${colores.verdeOliva} 100%)`,
        padding: '60px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div className="container">
          <h3 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '2.2rem',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: 'white'
          }}>
            ¿Listo para tu próxima experiencia?
          </h3>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '30px',
            opacity: 0.9,
            color: 'white'
          }}>
            Visítanos hoy y descubre por qué somos la cafetería favorita de la ciudad
          </p>
          <button style={{
            backgroundColor: colores.dorado,
            color: 'black',
            border: 'none',
            padding: '18px 45px',
            borderRadius: '30px',
            fontSize: '17px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}>
            📍 Hacer mi Pedido Ahora
          </button>
        </div>
      </div>

      {/* FOOTER (mantuve texto blanco por contraste con fondo oscuro) */}
      <div style={{
        backgroundColor: colores.azulOscuro,
        color: 'white',
        padding: '40px 20px 20px',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{
            fontSize: '2.5rem',
            marginBottom: '15px'
          }}>
            ☕
          </div>
          <h4 style={{
            fontFamily: 'Georgia, serif',
            marginBottom: '10px',
            color: 'white'
          }}>
            El Café Elegante
          </h4>
          <p style={{
            color: 'white',
            opacity: 0.9,
            fontSize: '14px',
            marginBottom: '20px'
          }}>
            Tradición, sabor y elegancia en cada taza
          </p>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '20px',
            marginTop: '20px'
          }}>
            <p style={{
              fontSize: '13px',
              opacity: 0.6,
              margin: 0,
              color: 'white'
            }}>
              © 2024 El Café Elegante. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
