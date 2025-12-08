import React, { useEffect, useState } from 'react';
import {
    listaReservas,
    deleteReserva,
    updateReserva,
    buscarReservaPorFecha,
} from '../services/ReservaService';
import { listaMesas, updateMesa } from '../services/MesaService';
import { listaClientes } from '../services/ClienteService';
import { listaVentas } from '../services/VentaService';    
import { useNavigate } from 'react-router-dom';
import { getUsuarioLogueado } from "../services/AuthService";

export const ListaReservaComponent = () => {
    const [reservas, setReservas] = useState([]);
    const [mesas, setMesas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [fechaBusqueda, setFechaBusqueda] = useState('');
    const [hoveredRow, setHoveredRow] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    
    const navegar = useNavigate();
    const usuario = getUsuarioLogueado();
    const rol = usuario?.perfil;
    const idCliente = usuario?.id;

    // Estilos con paleta azul elegante
    const estilos = {
        container: {
            maxWidth: '1400px',
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
            alignItems: 'center',
            justifyContent: 'center'
        },
        searchInput: {
            padding: '0.8rem 1rem',
            border: '2px solid #e0ddd0',
            borderRadius: '8px',
            fontSize: '1rem',
            fontFamily: 'Arial, sans-serif',
            transition: 'all 0.3s ease',
            outline: 'none',
            backgroundColor: '#ffffff', // ✅ CORREGIDO: Fondo blanco
            color: '#000000',           // ✅ CORREGIDO: Texto negro
            cursor: 'pointer'
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
            transform: 'scale(1.005)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        btnEdit: {
            backgroundColor: '#c29c5e',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.4rem 0.8rem',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginRight: '0.4rem',
            marginBottom: '0.3rem'
        },
        btnSuccess: {
            backgroundColor: '#578661',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.4rem 0.8rem',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginRight: '0.4rem',
            marginBottom: '0.3rem'
        },
        btnInfo: {
            backgroundColor: '#2f4858',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.4rem 0.8rem',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginRight: '0.4rem',
            marginBottom: '0.3rem'
        },
        btnDelete: {
            backgroundColor: '#c0615f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.4rem 0.8rem',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '0.3rem'
        },
        btnDisabled: {
            backgroundColor: '#ccc',
            color: '#666',
            border: 'none',
            borderRadius: '6px',
            padding: '0.4rem 0.8rem',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            cursor: 'not-allowed',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginRight: '0.4rem',
            marginBottom: '0.3rem',
            opacity: 0.6
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
        badgeConfirmada: {
            backgroundColor: '#578661',
            color: 'white',
            padding: '0.4rem 0.9rem',
            borderRadius: '15px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            display: 'inline-block'
        },
        badgeCancelada: {
            backgroundColor: '#c0615f',
            color: 'white',
            padding: '0.4rem 0.9rem',
            borderRadius: '15px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            display: 'inline-block'
        },
        badgePendiente: {
            backgroundColor: '#c29c5e',
            color: 'white',
            padding: '0.4rem 0.9rem',
            borderRadius: '15px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            display: 'inline-block'
        }
    };

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    async function cargarDatosIniciales() {
        await getAllReservas(); 
        await Promise.all([getMesas(), getClientes()]);
    }

    async function getAllReservas() {
        listaReservas()
            .then((response) => {
                let datos = response.data;
                if (rol === "cliente") {
                    datos = datos.filter(r => r.idCliente === idCliente);
                }
                setReservas(datos);
                gestionarEstadoMesas(datos);
            })
            .catch((error) => console.error('Error al cargar reservas:', error));
    }

    async function gestionarEstadoMesas(reservasActuales) {
        const hoy = new Date().toISOString().split("T")[0]; 
        const mesasOcupadasIds = new Set();
        
        reservasActuales.forEach(reserva => {
            if (reserva.estado !== 'Cancelada' && reserva.idMesa) {
                if (reserva.fecha >= hoy) {
                    mesasOcupadasIds.add(reserva.idMesa);
                } 
            }
        });

        const mesasActuales = (await listaMesas()).data;
        const promesasActualizacion = [];

        mesasActuales.forEach(mesa => {
            const debeEstarOcupada = mesasOcupadasIds.has(mesa.idMesa);

            if (debeEstarOcupada && mesa.estado) {
                 console.log(`[Ocupando] Mesa ${mesa.numero} (${mesa.idMesa}). Tiene reserva activa hoy/futuro.`);
                 promesasActualizacion.push(updateMesa(mesa.idMesa, { estado: false }));
            }
            
            if (!debeEstarOcupada && !mesa.estado) {
                console.log(`[Liberando] Mesa ${mesa.numero} (${mesa.idMesa}). No tiene reservas activas hoy/futuro.`);
                promesasActualizacion.push(updateMesa(mesa.idMesa, { estado: true })); 
            }
        });
        
        try {
            await Promise.all(promesasActualizacion);
            console.log(`✔ Proceso de gestión de estado de mesas completado. Mesas actualizadas: ${promesasActualizacion.length}`);
            getMesas(); 
        } catch (error) {
            console.error("❌ Error en el proceso de gestión de estado de mesas:", error);
        }
    }

    function getMesas() {
        listaMesas()
            .then((response) => setMesas(response.data))
            .catch((error) => console.error('Error al cargar mesas:', error));
    }

    function getClientes() {
        listaClientes()
            .then((response) => setClientes(response.data))
            .catch((error) => console.error('Error al cargar clientes:', error));
    }

    function nuevaReserva() {
        navegar('/reserva/crear');
    }

    function actualizarReserva(idReserva) {
        navegar(`/reserva/edita/${idReserva}`);
    }

    function eliminarReserva(idReserva) {
        if (window.confirm('¿Seguro que deseas cancelar esta reserva?')) {
            deleteReserva(idReserva)
                .then(() => {
                    alert('✅ La reserva fue cancelada correctamente.');
                    getAllReservas();
                })
                .catch((error) => {
                    console.error('Error al eliminar reserva:', error);
                    const mensaje = error.response?.data || '❌ Ocurrió un error al cancelar la reserva.';
                    alert(mensaje);
                });
        }
    }

    function cambiarEstado(idReserva, nuevoEstado) {
        const reserva = reservas.find((r) => r.idReserva === idReserva);
        if (!reserva) return;

        const actualizada = { ...reserva, estado: nuevoEstado };

        updateReserva(idReserva, actualizada)
            .then(() => getAllReservas())
            .catch((error) => {
                console.error(error);
                const mensaje = error.response?.data || '❌ No se pudo cambiar el estado.';
                alert(mensaje);
            });
    }

    async function realizarVenta(idReserva) {
        try {
            const { data: ventas } = await listaVentas();
            const ventaExistente = ventas.find(
                v => Number(v.idReserva) === Number(idReserva)
            );

            if (ventaExistente) {
                alert("⚠️ Esta reserva ya tiene una venta registrada. Serás dirigido a actualizarla.");
                navegar(`/venta/edita/${ventaExistente.idVenta}`);
                return;
            }

            navegar(`/venta/crear/${idReserva}`);

        } catch (error) {
            console.error("Error verificando venta existente:", error);
            alert("❌ No se pudo verificar si la reserva ya tenía una venta.");
        }
    }

    function buscarPorFecha(e) {
        e.preventDefault();
        if (!fechaBusqueda) {
            getAllReservas();
            return;
        }
        buscarReservaPorFecha(fechaBusqueda)
            .then((res) => {
                let reservasFiltradas = res.data;
                if (rol === "cliente") {
                    reservasFiltradas = reservasFiltradas.filter(r => r.idCliente === idCliente);
                }
                setReservas(reservasFiltradas);
            })
            .catch((err) => console.error('Error al buscar reservas:', err));
    }

    function limpiarBusqueda() {
        setFechaBusqueda('');
        getAllReservas();
    }

    function puedeRealizarVenta(reserva) {
        const ahora = new Date();
        const limiteDia = new Date(reserva.fecha + 'T23:00:00');
        const esMismoDia = ahora.toISOString().split('T')[0] === reserva.fecha;
        const dentroLimite = ahora <= limiteDia;
        return esMismoDia && dentroLimite;
    }

    function motivoVentaBloqueada(reserva) {
        const hoyISO = new Date().toISOString().split('T')[0];
        const ahora = new Date();
        const limiteDia = new Date(reserva.fecha + 'T23:00:00');

        if (reserva.fecha < hoyISO) {
            return '⚠️ La fecha de la reserva ya ha vencido y no se puede realizar la venta.';
        }
        if (reserva.fecha > hoyISO) {
            return 'Solo puedes realizar la venta el día de la reserva.';
        }
        if (ahora > limiteDia) {
            return '⚠️ Ya pasó el horario límite (23:00) de la reserva.';
        }
        return '⚠️ No se puede realizar la venta en este momento.';
    }

    const getRowStyle = (index) => {
        const baseStyle = index % 2 === 0 ? estilos.rowEven : estilos.rowOdd;
        return hoveredRow === index ? { ...baseStyle, ...estilos.rowHover } : baseStyle;
    };

    const getInputStyle = () => {
        return focusedInput 
            ? { ...estilos.searchInput, ...estilos.searchInputFocus }
            : estilos.searchInput;
    };

    return (
        <div style={estilos.container}>
            <div style={estilos.buttonContainer}>
                <button
                    style={estilos.btnPrimary}
                    onClick={nuevaReserva}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <span>➕</span>
                    Nueva Reserva
                </button>
            </div>

            <h2 style={estilos.title}>
                📅 Lista de Reservas
            </h2>

            {/* Búsqueda por fecha */}
            <div style={estilos.searchContainer}>
                <label style={estilos.filterLabel}>
                    🔍 Buscar por fecha:
                </label>
                <input
                    type="date"
                    style={getInputStyle()}
                    value={fechaBusqueda}
                    onChange={(e) => setFechaBusqueda(e.target.value)}
                    onFocus={() => setFocusedInput(true)}
                    onBlur={() => setFocusedInput(false)}
                />
                <button
                    type="button"
                    style={estilos.btnPrimary}
                    onClick={buscarPorFecha}
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

            {/* Tabla de reservas */}
            <div style={{ overflowX: 'auto' }}>
                <table style={estilos.table}>
                    <thead style={estilos.thead}>
                        <tr>
                            <th style={estilos.th}>ID</th>
                            <th style={estilos.th}>Fecha</th>
                            <th style={estilos.th}>Hora</th>
                            <th style={estilos.th}>Mesa</th>
                            <th style={estilos.th}>Cliente</th>
                            <th style={estilos.th}>Estado</th>
                            <th style={estilos.th}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reservas.length > 0 ? (
                            reservas.map((reserva, index) => {
                                const mesa = mesas.find((m) => m.idMesa === reserva.idMesa);
                                const cliente = clientes.find((c) => c.idCliente === reserva.idCliente);
                                const habilitado = puedeRealizarVenta(reserva);

                                return (
                                    <tr
                                        key={reserva.idReserva}
                                        style={getRowStyle(index)}
                                        onMouseEnter={() => setHoveredRow(index)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td style={estilos.tdCentered}>
                                            <strong>{reserva.idReserva}</strong>
                                        </td>
                                        <td style={estilos.tdCentered}>
                                            <strong style={{ color: '#2f4858' }}>
                                                📆 {reserva.fecha}
                                            </strong>
                                        </td>
                                        <td style={estilos.tdCentered}>
                                            <strong style={{ color: '#899458' }}>
                                                🕐 {reserva.hora}
                                            </strong>
                                        </td>
                                        <td style={estilos.td}>
                                            {mesa ? (
                                                <div>
                                                    <strong>Mesa {mesa.numero}</strong>
                                                    <br />
                                                    <small style={{ color: '#666' }}>📍 {mesa.ubicacion}</small>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#999', fontStyle: 'italic' }}>Sin mesa</span>
                                            )}
                                        </td>
                                        <td style={estilos.td}>
                                            <strong style={{ color: '#2f4858' }}>
                                                {cliente ? cliente.nombreCliente : 'Sin cliente'}
                                            </strong>
                                        </td>
                                        <td style={estilos.tdCentered}>
                                            <span style={
                                                reserva.estado === 'Confirmada'
                                                    ? estilos.badgeConfirmada
                                                    : reserva.estado === 'Cancelada'
                                                    ? estilos.badgeCancelada
                                                    : estilos.badgePendiente
                                            }>
                                                {reserva.estado}
                                            </span>
                                        </td>

                                        <td style={estilos.tdCentered}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                {reserva.estado === 'Pendiente' && (
                                                    <>
                                                        <button
                                                            style={estilos.btnEdit}
                                                            onClick={() => actualizarReserva(reserva.idReserva)}
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

                                                        {rol !== "cliente" && (
                                                            <button
                                                                style={estilos.btnSuccess}
                                                                onClick={() => cambiarEstado(reserva.idReserva, 'Confirmada')}
                                                                onMouseOver={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#467552';
                                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#578661';
                                                                    e.currentTarget.style.transform = 'scale(1)';
                                                                }}
                                                            >
                                                                <span>✅</span>
                                                                Confirmar
                                                            </button>
                                                        )}

                                                        <button
                                                            style={estilos.btnDelete}
                                                            onClick={() => eliminarReserva(reserva.idReserva)}
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
                                                            Cancelar
                                                        </button>
                                                    </>
                                                )}

                                                {reserva.estado === 'Confirmada' && (
                                                    <>
                                                        {habilitado ? (
                                                            <button
                                                                style={estilos.btnInfo}
                                                                onClick={() => realizarVenta(reserva.idReserva)}
                                                                onMouseOver={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#1e2f3a';
                                                                    e.currentTarget.style.transform = 'scale(1.05)';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#2f4858';
                                                                    e.currentTarget.style.transform = 'scale(1)';
                                                                }}
                                                            >
                                                                <span>🛒</span>
                                                                Realizar venta
                                                            </button>
                                                        ) : (
                                                            <button
                                                                style={estilos.btnDisabled}
                                                                onClick={() => alert(motivoVentaBloqueada(reserva))}
                                                                title={motivoVentaBloqueada(reserva)}
                                                            >
                                                                <span>🛒</span>
                                                                Realizar venta
                                                            </button>
                                                        )}

                                                        <button
                                                            style={estilos.btnDelete}
                                                            onClick={() => eliminarReserva(reserva.idReserva)}
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
                                                            Cancelar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" style={estilos.emptyMessage}>
                                    <div>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                                        <div>
                                            {fechaBusqueda
                                                ? `No hay reservas registradas para el ${fechaBusqueda}`
                                                : 'No hay reservas registradas'}
                                        </div>
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