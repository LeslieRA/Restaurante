import React, { useState, useEffect } from "react";
import {
  crearUsuario,
  getUsuario,
  updateUsuario,
} from "../services/SecurityService";
import { useNavigate, useParams } from "react-router-dom";
import { getCliente, updateCliente, deleteCliente} from "../services/ClienteService";
import { getEmpleado, updateEmpleado, deleteEmpleado, crearEmpleado } from "../services/EmpleadoService";

// --- ESTILOS DEFINIDOS (Tema Dorado/Elegante) ---
const estilos = {
  container: {
    maxWidth: '600px', // Ancho ideal para formulario de usuario
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
    color: '#2f4858', // ✅ SOLUCIÓN: Letra oscura para que se vea bien
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

export const UsuarioComponent = () => {
  const [nombre, setNombre] = useState("");
  const [perfil, setPerfil] = useState("");
  const [username, setUsername] = useState("");
  const [estatus, setEstatus] = useState(1);
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    nombre: "",
    perfil: "",
    username: "",
  });

  const navegar = useNavigate();
  const { id } = useParams();

  // Obtener usuario logueado
  const loggedUser = JSON.parse(localStorage.getItem("usuario"));

  // ================================
  // PERFILES PERMITIDOS SEGÚN ROL
  // ================================
  function perfilesPermitidos() {
    let list;

    if (!loggedUser) {
      list = ["cliente"];
    } else {
      const rol = loggedUser.perfil;

      switch (rol) {
        case "cajero":
          list = ["cliente"];
          break;
        case "supervisor":
          list = ["cliente", "mesero", "cocinero", "cajero"];
          break;
        case "administrador":
          list = [
            "cliente",
            "mesero",
            "cocinero",
            "cajero",
            "administrador",
            "supervisor",
          ];
          break;
        default:
          list = ["cliente"];
      }
    }

    if (id && perfil && !list.includes(perfil)) {
      list.push(perfil);
    }

    return list;
  }

  // ============================
  // VALIDACIONES
  // ============================
  function validaForm() {
    let valido = true;
    const errorscopy = { ...errors };

    if (nombre.trim()) errorscopy.nombre = "";
    else {
      errorscopy.nombre = "El nombre es requerido";
      valido = false;
    }

    if (perfil.trim()) errorscopy.perfil = "";
    else {
      errorscopy.perfil = "El perfil es requerido";
      valido = false;
    }

    if (username.trim()) errorscopy.username = "";
    else {
      errorscopy.username = "El username es requerido";
      valido = false;
    }

    setErrors(errorscopy);
    return valido;
  }

  // ============================
  // Cargar datos si es edición
  // ============================
  useEffect(() => {
    if (!id) return;

    getUsuario(id)
      .then(({ data }) => {
        setNombre(data.nombre ?? "");
        setPerfil(data.perfil ?? "");
        setUsername(data.username ?? "");
        setEstatus(data.estatus ?? 1);
        setPassword("");
      })
      .catch(console.error);
  }, [id]);

  // ============================
  // CREAR O ACTUALIZAR
  // ============================
  function saveUsuario(e) {
    e.preventDefault();
    if (!validaForm()) return;

    const usuario = {
      nombre,
      perfil,
      username,
      estatus,
      password: password || null,
    };

    // SI ES EDICIÓN
    if (id) {
      getUsuario(id).then(({ data: usuarioAnterior }) => {
        const perfilAnterior = usuarioAnterior.perfil;

        updateUsuario(id, usuario)
          .then(async () => {
            // SI NO CAMBIÓ EL PERFIL
            if (perfilAnterior === perfil) {
              if (perfil === "cliente") {
                const cli = await getCliente(id).catch(() => null);
                if (cli?.data) {
                  await updateCliente(id, {
                    idCliente: id,
                    nombreCliente: nombre,
                    telefonoCliente: cli.data.telefonoCliente,
                    correoCliente: cli.data.correoCliente,
                  });
                }
              }

              if (["cajero","mesero","cocinero","supervisor","administrador"].includes(perfil)) {
                const emp = await getEmpleado(id).catch(() => null);
                if (emp?.data) {
                  await updateEmpleado(id, {
                    idEmpleado: id,
                    nombre,
                    puesto: perfil,
                  });
                }
              }
              return "ok";
            }

            // SI CAMBIÓ DE CLIENTE → EMPLEADO
            if (
              perfilAnterior === "cliente" &&
              ["cajero","mesero","cocinero","supervisor","administrador"].includes(perfil)
            ) {
              await deleteCliente(id).catch(() => null);
              await crearEmpleado({
                idEmpleado: id,
                nombre,
                puesto: perfil,
              });
              return "ok";
            }

            // SI CAMBIÓ DE EMPLEADO → CLIENTE
            if (
              ["cajero","mesero","cocinero","supervisor","administrador"].includes(perfilAnterior) &&
              perfil === "cliente"
            ) {
              await deleteEmpleado(id).catch(() => null);
              navegar(`/cliente/crear?idUsuario=${id}&nombre=${nombre}`);
              return "redirect";
            }

            return "ok";
          })
          .then((estado) => {
            if (estado !== "redirect") {
              navegar("/usuarios/lista");
            }
          })
          .catch((err) => console.error("ERROR AL ACTUALIZAR USUARIO:", err));
      });
      return;
    }

    // SI ES CREACIÓN
    crearUsuario(usuario)
      .then((response) => {
        const nuevo = response.data;
        const idUsuario = nuevo.id;

        if (perfil === "cliente") {
          navegar(`/cliente/crear?idUsuario=${idUsuario}&nombre=${nombre}`);
        } else {
          navegar(`/empleado/crear?idUsuario=${idUsuario}&nombre=${nombre}&puesto=${perfil}`);
        }
      })
      .catch(console.error);
  }

  function cancelar() {
    const logged = JSON.parse(localStorage.getItem("usuario"));

    if (!logged) {
      navegar("/");
      return;
    }
    if (logged.perfil === "cajero") {
      navegar("/cliente/lista");
      return;
    }
    if (logged.perfil === "administrador" || logged.perfil === "supervisor") {
      navegar("/usuarios/lista");
      return;
    }
  }

  function pagTitulo() {
    return id ? "Modificar usuario" : "Agregar usuario";
  }

  return (
    <div style={estilos.container}>
      <h2 style={estilos.title}>{pagTitulo()}</h2>

      <form onSubmit={saveUsuario}>
        {/* Nombre */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Nombre completo</label>
          <input
            type="text"
            style={{
                ...estilos.formInput,
                borderColor: errors.nombre ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre del usuario"
          />
          {errors.nombre && <div style={estilos.errorMsg}>{errors.nombre}</div>}
        </div>

        {/* Perfil */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Perfil</label>
          <select
            style={{
                ...estilos.formInput,
                borderColor: errors.perfil ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
          >
            <option value="">Seleccione un perfil</option>
            {perfilesPermitidos().map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
          {errors.perfil && <div style={estilos.errorMsg}>{errors.perfil}</div>}
        </div>

        {/* Username */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Username</label>
          <input
            type="text"
            style={{
                ...estilos.formInput,
                borderColor: errors.username ? '#c0615f' : estilos.formInput.border.split(' ')[2]
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario (login)"
          />
          {errors.username && <div style={estilos.errorMsg}>{errors.username}</div>}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={estilos.label}>Contraseña</label>
          <input
            type="password"
            style={estilos.formInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Dejar vacío si no desea cambiarla"
          />
        </div>

        {/* Estatus */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={estilos.label}>Estatus</label>
          <select
            style={{
                ...estilos.formInput,
                backgroundColor: !id ? '#f0f0f0' : '#fff', // Gris claro si está deshabilitado
                color: !id ? '#999' : '#2f4858' 
            }}
            value={estatus}
            onChange={(e) => setEstatus(e.target.value)}
            disabled={!id}
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            type="submit"
            style={estilos.btnPrimary}
          >
            {id ? "🔄 Actualizar" : "✅ Guardar"}
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