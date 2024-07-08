import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Detail() {
    const [id_pedido, setIdPedido] = useState("");
    const [id_producto, setIdProducto] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [observacion, setObservacion] = useState("");
    const [estadoDetalle, setEstadoDetalle] = useState("");
    const [detallepedido, setDetallePedido]=useState("");

    const[id_cliente, setIdCliente]=useState("");
    const[id_mesa, setIdMesa]=useState("");
    const[estado, setEstado]=useState("");
    const[pedidoList, setPedidoList]=useState([]);
    const[pedido, setPedido]=useState([]);

    const [editar, setEditar] = useState(false);
    const [detallepedidosList, setDetallePedidos] = useState([]);
    const [cantidadError, setCantidadError] = useState(false);

    useEffect(() => {
        getDetallePedidos();
    }, []);

    const getDetallePedidos = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/detallepedidos");
            setDetallePedidos(response.data);
        } catch (error) {
            console.error("Error al obtener detalles de pedidos:", error);
        }
    };
    

    useEffect(() => {
        getPedidos();
    }, []);

    const getPedidos = async () => {
        try {
            const response = await axios.get("http://localhost:8085/api/v1/pedidos");
            setPedido(response.data);
        } catch (error) {
            console.error("Error al obtener detalles de pedidos:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "cantidad") {
            setCantidad(value);
            setCantidadError(isNaN(value) || parseFloat(value) <= 0);
        } else {
            switch (name) {
                case "id_pedido":
                    setIdPedido(value);
                    break;
                case "id_producto":
                    setIdProducto(value);
                    break;
                case "observacion":
                    setObservacion(value);
                    break;
                case "estadoDetalle":
                    setEstadoDetalle(value);
                    break;
                default:
                    break;
            }
        }
    };

    const add = () => {
        if (id_pedido === "" || id_producto === "" || cantidad === "" || observacion === "" || estadoDetalle === "") {
            MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "No puedes enviar campos vacíos!",
                footer: '<a href="#">Intenta de nuevo?</a>'
            });
            limpiarCampos();
        } else {
            axios
                .post("http://localhost:8085/api/v1/detallepedidos", {
                    id_pedido,
                    id_producto,
                    cantidad,
                    observacion,
                    estadoDetalle,
                })
                .then(() => {
                    getDetallePedidos();
                    limpiarCampos();
                    MySwal.fire({
                        title: "<strong>Registro exitoso!!!</strong>",
                        html: `<i><strong>El detalle del pedido: ${id_pedido} fue creado con éxito!</i>`,
                        icon: "success"
                    });
                })
                .catch(error => {
                    console.error("Error al agregar detalle del pedido:", error);
                });
        }
    };

    const update = () => {
        axios.put("http://localhost:8085/api/v1/detallepedidos", {
            //id: id,
            id_pedido: id_pedido,
            id_producto: id_producto,
            cantidad: cantidad,
            observacion: observacion,
            estadoDetalle: estadoDetalle,
        })
            .then(() => {
                getDetallePedidos();
                MySwal.fire({
                    title: "<strong>Actualización exitosa!!!</strong>",
                    html: `<i><strong>El detalle del pedido ${id_pedido} fue actualizado con éxito!</i>`,
                    icon: "success"
                });
                limpiarCampos();
            })
            .catch(error => {
                console.error("Error al actualizar detalle del pedido:", error);
            });
    };

    const eliminar = (detallepedido) => {
        MySwal.fire({
            title: "¿Estás seguro de eliminar?",
            html: `<i><strong>Desea eliminar el detalle del pedido ${detallepedido.id_pedido}?</strong></i>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminarlo!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8085/api/v1/detallepedidos/${detallepedido.id}`)
                    .then(() => {
                        getDetallePedidos();
                        limpiarCampos();
                        MySwal.fire({
                            title: "Eliminado!",
                            text: `El detalle del pedido ${detallepedido.id} ha sido eliminado!`,
                            icon: "success"
                        });
                    })
                    .catch(error => {
                        console.error("Error al eliminar detalle del pedido:", error);
                    });
            }
        });
    };

    const limpiarCampos = () => {
        setIdPedido("");
        setIdProducto("");
        setCantidad("");
        setObservacion("");
        setEstadoDetalle("");
    };

    const editarDetallePedido = (val) => {
        setEditar(true);
        //setId(val.id);
        setIdPedido(val.id_pedido);
        setIdProducto(val.id_producto);
        setCantidad(val.cantidad);
        setObservacion(val.observacion);
        setEstadoDetalle(val.estadoDetalle);
    };

    

    return (
        <div className="container">
            <div className="card text-center">
                <div className="card-header">Gestión de detalles de los pedidos</div>
            </div>
            <div className="card-body">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Id_pedido:</span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="id_pedido"
                        className="form-control"
                        value={id_pedido}
                        placeholder="Id de pedido"
                        aria-label="Id_pedido"
                        aria-describedby="basic-addon1"
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">id_producto:</span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="id_producto"
                        className="form-control"
                        value={id_producto}
                        placeholder="id_producto"
                        aria-label="Id_producto"
                        aria-describedby="basic-addon1"
                    />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Cantidad:</span>
                    <input
                        type="number"
                        onChange={handleChange}
                        name="cantidad"
                        className={`form-control ${cantidadError ? "is-invalid" : ""}`}
                        value={cantidad}
                        placeholder="Cantidad de producto"
                        aria-label="Cantidad"
                        aria-describedby="basic-addon1"
                    />
                    {cantidadError && (
                        <div className="invalid-feedback">La cantidad debe ser un número mayor a 0.</div>
                    )}
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Observación: </span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="observacion"
                        className="form-control"
                        value={observacion}
                        placeholder="Observaciones o gustos particulares del producto"
                        aria-label="Observación"
                        aria-describedby="basic-addon1"
                    />
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Estado </span>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="estadoDetalle"
                        className="form-control"
                        value={estadoDetalle}
                        placeholder="estado en el que se encuentra el producto"
                        aria-label="Estado"
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
                        <th scope="col">IdPedidos</th>
                        <th scope="col">IdProducto</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Observacion</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Acciones</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {detallepedidosList.map((detallepedido, index) => (
                        <tr key={detallepedido.id}>
                            <td>{detallepedido.id}</td>
                            <td>{detallepedido.id_mesa}</td>
                            <td>{detallepedido.id_cliente}</td>
                            <td>{detallepedido.estado}</td>
                            
                            <td>
                                {/* Add your action buttons here */}
                            </td>
                        </tr>
                    ))}
                </tbody>
                console.log(detallepedido.id_cliente);

            </table>
        </div>
    );
}

export default Detail;
