import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function Edit() {
    const [id, setId] = useState();
    const [nombre, setNombre] = useState("");
    const [url, setUrl] = useState("");

    const [precio, setPrecio] = useState();
    const [descripcion, setDescripcion] = useState("");
    const [editar, setEditar] = useState(false);
    const [productosList, setProductos] = useState([]);
    const [precioError, setPrecioError] = useState(false);


    useEffect(() => {
        getProductos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "precio") {
            setPrecio(value);
            if (isNaN(value) || parseFloat(value) <= 0) {
                setPrecioError(true);
            } else {
                setPrecioError(false);
            }

        } else {
            if (name === "nombre") setNombre(value);
            if (name === "url") setUrl(value);
            if (name === "descripcion") setDescripcion(value);
        }
    };

    const add = () => {

        if (nombre == "" || url == "" || precio == "" || descripcion == "") {
            MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "No puede enviar campos vacios!",
                footer: '<a href="#">Intente de nuevo?</a>'
            });
            limpiarCampos();
        } else

            axios
                .post("http://localhost:8085/api/v1/productos", {
                    nombre,
                    url,
                    precio,
                   descripcion,
                })
                .then(() => {
                    getProductos();
                    limpiarCampos();
                    MySwal.fire({
                        title: "<strong>Registro exitoso!!!</strong> ",
                        html: "<i> <strong> El producto " + nombre + " fue creado con éxito! </i>",
                        icon: "success"
                    });
                });
    };

    const update = () => {
        axios.put("http://localhost:8085/api/v1/productos", {
            id,
            nombre,
            url,
            precio,
            descripcion,
        })
            .then(() => {
                getProductos();
                MySwal.fire({
                    title: "<strong>Actualización exitosa!!!</strong> ",
                    html: "<i> <strong> El producto  " + nombre + " fue actualizado con éxito! </i>",
                    icon: "success"
                });
                limpiarCampos();
            });
    };

    const eliminar = (producto) => {

        MySwal.fire({
            title: "Estas seguro de eliminar?",
            html: "<i> <strong> Desea eliminar el producto  " + producto.nombre + " </i>",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminarlo!"
        }).then((result) => {
            if (result.isConfirmed) {

                axios.delete(`http://localhost:8085/api/v1/productos/${producto.id}`).then(() => {
                    getProductos();
                    limpiarCampos();
                    MySwal.fire({
                        title: "Eliminado!",
                        text: "El producto: " + producto.nombre + ", ha sido eliminado!",
                        icon: "success"
                    })
                });

            }
        });

    }

    const limpiarCampos = () => {
        setNombre("");
        setId("");
        setDescripcion("");
        setPrecio("");

        setUrl("");

    }

    const editarProducto = (val) => {
        setEditar(true);
        setId(val.id);
        setNombre(val.nombre);
        setUrl(val.url);

        setDescripcion(val.descripcion);
        setPrecio(val.precio);
    };

    const getProductos = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/productos");
            setProductos(response.data);
        } catch (error) {
            console.error(error);
        }
    };




    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">Gestión de Productos</div>
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
                        placeholder="Nombre de producto"
                        aria-label="Nombre"
                        aria-describedby="basic-addon1"
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Url:</span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="url"
                        className="form-control"
                        value={url}
                        placeholder="Imagen de producto"
                        aria-label="Url"
                        aria-describedby="basic-addon1"
                    />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Precio:</span>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="precio"
                        className={`form-control ${precioError ? "is-invalid" : ""}`}
                        value={precio}
                        placeholder="Precio de producto"
                        aria-label="Precio"
                        aria-describedby="basic-addon1"
                    />
                    {precioError && (
                        <div className="invalid-feedback">El precio debe ser un número mayor a 0.</div>
                    )}
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Descripción:</span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="descripcion"
                        className="form-control"
                        value={descripcion}
                        placeholder="Descripción de producto"
                        aria-label="Descripción"
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
                        <th scope="col">Descripción</th>
                        <th scope="col">Precio</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {productosList.map((producto, index) => (
                        <tr key={producto.id}>
                            <th scope="row">{producto.id}</th>
                            <td>{producto.nombre}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.precio}</td>
                            <td>
                                <ButtonGroup>
                                    <Button variant="secondary" onClick={() => editarProducto(producto)}>Editar</Button>
                                    <Button onClick={() => {
                                        eliminar(producto)
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

export default Edit;
