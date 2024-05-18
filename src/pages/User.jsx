import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function User() {
    const [id, setId] = useState();
    const [nombre, setNombre] = useState("");
    const [contacto, setContacto] = useState("");
    const [direccion, setDireccion] = useState("");
    const [editar, setEditar] = useState(false);
    const [clientesList, setClientes] = useState([]);



    useEffect(() => {
        getClientes();
    }, []);



    const add = () => {
        if (nombre == "" || contacto == "" || direccion == "") {
            MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "No puede enviar campos vacios!",
                footer: '<a href="#">Intente de nuevo?</a>'
            });
            limpiarCampos();
        } else

            axios
                .post("http://localhost:8085/api/v1/clientes", {
                    nombre,
                    contacto,
                    direccion,

                })
                .then(() => {
                    getClientes();
                    limpiarCampos();
                    MySwal.fire({
                        title: "<strong>Registro exitoso!!!</strong> ",
                        html: "<i> <strong> El cliente " + nombre + " fue creado con éxito! </i>",
                        icon: "success"
                    });
                });
    };

    const update = () => {
        axios.put("http://localhost:8085/api/v1/clientes", {
            id,
            nombre,
            contacto,
            direccion,
        })
            .then(() => {
                getClientes();
                MySwal.fire({
                    title: "<strong>Actualización exitosa!!!</strong> ",
                    html: "<i> <strong> El cliente  " + nombre + " fue actualizado con éxito! </i>",
                    icon: "success"
                });
                limpiarCampos();
            });
    };

    const eliminar = (cliente) => {

        MySwal.fire({
            title: "Estas seguro de eliminar?",
            html: "<i> <strong> Desea eliminar el cliente  " + cliente.nombre + " </i>",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminarlo!"
        }).then((result) => {
            if (result.isConfirmed) {

                axios.delete(`http://localhost:8085/api/v1/clientes/${cliente.id}`).then(() => {
                    getClientes();
                    limpiarCampos();
                    MySwal.fire({
                        title: "Eliminado!",
                        text: "El cliente" + cliente.nombre + "ha sido eliminado!",
                        icon: "success"
                    })
                });

            }
        });

    }

    const limpiarCampos = () => {
        setId("");
        setNombre("");
        setContacto("");
        setDireccion("");
    }


    const editarCliente = (val) => {
        setEditar(true);
        setId(val.id);
        setNombre(val.nombre);
        setContacto(val.contacto);
        setDireccion(val.direccion);
    };

    const getClientes = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/clientes");
            setClientes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        {
            if (name === "nombre") setNombre(value);
            if (name === "contacto") setContacto(value);
            if (name === "direccion") setDireccion(value);
        }
    };



    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">Gestión de Clientes</div>
            </div>
            <div className="card-body">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Nombre:</span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="nombre"
                        className="form-control"
                        value={nombre}
                        placeholder="Nombre de cliente"
                        aria-label="Nombre"
                        aria-describedby="basic-addon1"
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Contacto:</span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="contacto"
                        className="form-control"
                        value={contacto}
                        placeholder="Contacto"
                        aria-label="Contacto"
                        aria-describedby="basic-addon1"
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Dirección:</span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="direccion"
                        value={direccion}
                        className="form control"
                        placeholder="Dirección"
                        aria-label="Dirección"
                        aria-describedby="basic-addon1"
                    />
                </div>
                <div className="card-footer text-muted">
                    {editar ? (
                        <div>
                            <Button className="btn btn-warning m-2" onClick={update}>Actualizar</Button>
                            <Button className="btn btn-info m-2" onClick={() => setEditar(false)}>Cancelar</Button>
                        </div>
                    ) : (
                        <Button className="btn btn-primary" onClick={add}>Registrar</Button>
                    )}
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Contacto</th>
                        <th scope="col">Dirección</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {clientesList.map((cliente, index) => (
                        <tr key={cliente.id}>
                            <th scope="row">{cliente.id}</th>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.contacto}</td>
                            <td>{cliente.direccion}</td>
                            <td>
                                <ButtonGroup>
                                    <Button variant="secondary" onClick={() => editarCliente(cliente)}>Editar</Button>
                                    <Button onClick={() => {
                                        eliminar(cliente)
                                    }} variant="danger">Eliminar</Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default User;
