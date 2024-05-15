import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Clientes({ nombre, contacto, direccion }) {
  const [clientesList, setClientesList] = useState([]);
  const [nombreCliente, setNombreCliente] = useState("");
  const [contactoCliente, setContactoCliente] = useState("");
  const [direccionCliente, setDireccionCliente] = useState("");
  const [editando, setEditando] = useState(false);
  const [clienteEditandoId, setClienteEditandoId] = useState(null);

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const response = await axios.get("http://localhost:8085/api/v1/clientes");
      setClientesList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "nombre") {
      setNombreCliente(value);
    } else if (name === "contacto") {
      setContactoCliente(value);
    } else if (name === "direccion") {
      setDireccionCliente(value);
    }
  };

  const agregarCliente = () => {
    axios
      .post("http://localhost:8085/api/v1/clientes", {
        nombre: nombreCliente,
        contacto: contactoCliente,
        direccion: direccionCliente,
      })
      .then(() => {
        obtenerClientes();
        limpiarCampos();
        alert("Cliente agregado exitosamente");
      })
      .catch((error) => {
        console.error("Error al agregar cliente: ", error);
      });
  };

  const eliminarCliente = (id) => {
    axios
      .delete("http://localhost:8085/api/v1/clientes/${id}")
      .then(() => {
        obtenerClientes();
        alert("Cliente eliminado exitosamente");
      })
      .catch((error) => {
        console.error("Error al eliminar cliente: ", error);
      });
  };

  const editarCliente = (cliente) => {
    setEditando(true);
    setClienteEditandoId(cliente.id);
    setNombreCliente(cliente.nombre);
    setContactoCliente(cliente.contacto);
    setDireccionCliente(cliente.direccion);
  };

  const actualizarCliente = () => {
    axios
      .put("http://localhost:8085/api/v1/clientes/${clienteEditandoId}", {
        nombre: nombreCliente,
        contacto: contactoCliente,
        direccion: direccionCliente,
      })
      .then(() => {
        obtenerClientes();
        setEditando(false);
        limpiarCampos();
        alert("Cliente actualizado exitosamente");
      })
      .catch((error) => {
        console.error("Error al actualizar cliente: ", error);
      });
  };

  const limpiarCampos = () => {
    setNombreCliente("");
    setContactoCliente("");
    setDireccionCliente("");
    setClienteEditandoId(null);
  };

  return (
    <div className="container">
      <h1>Gestión de Clientes</h1>
      <div>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nombreCliente}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contacto"
          placeholder="Contacto"
          value={contactoCliente}
          onChange={handleChange}
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={direccionCliente}
          onChange={handleChange}
        />
        {editando ? (
          <Button onClick={actualizarCliente}>Actualizar Cliente</Button>
        ) : (
          <Button onClick={agregarCliente}>Agregar Cliente</Button>
        )}
        <Button onClick={limpiarCampos}>Limpiar</Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesList.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nombre}</td>
              <td>{cliente.contacto}</td>
              <td>{cliente.direccion}</td>
              <td>
                <ButtonGroup>
                  <Button onClick={() => editarCliente(cliente)}>Editar</Button>
                  <Button onClick={() => eliminarCliente(cliente.id)}>Eliminar</Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;