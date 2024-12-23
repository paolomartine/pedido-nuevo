import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button, Stack, Modal, ListGroup, ListGroupItem, Table } from 'react-bootstrap'; // Usamos Bootstrap en lugar de Material UI
import Swal from 'sweetalert2';
import "bootstrap/dist/css/bootstrap.min.css";

// Definir las columnas del DataGrid
const columns = [
    { field: 'id', headerName: 'ID', width: 70, align: 'left' },
    {
        field: 'pedidos',
        headerName: 'Pedidos',
        width: 300,
        renderCell: (params) => (
            <div>
                {params.row.pedidos.map((pedido, index) => (
                    <span key={index}>
                        <p>{pedido.producto} ({pedido.cantidad})</p> {/* Usamos <p> en lugar de <Typography> */}
                    </span>
                ))}
            </div>
        ),
    },
    { field: 'destino', headerName: 'Destino', width: 210 },
    { field: 'estado', headerName: 'Estado', width: 210 },
    { field: 'total', headerName: 'Total', type: 'number', width: 120 },
];

const Ventas = () => {
    const [pedidos, setPedidos] = useState([]);
    const [rows, setRows] = useState([]);
    const [loadingPedidos, setLoadingPedidos] = useState(true);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [errorPedidos, setErrorPedidos] = useState(null);
    const [errorProductos, setErrorProductos] = useState(null);
    const [ventaTotal, setVentaTotal] = useState(0);
    const [ventasPorProducto, setVentasPorProducto] = useState({});

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get("http://localhost:8085/api/v1/pedidos");
                const filteredPedidos = response.data.filter(pedido => pedido.estado === "PAGADO");
                setPedidos(filteredPedidos);
                setLoadingPedidos(false);
            } catch (error) {
                setErrorPedidos(error);
                setLoadingPedidos(false);
            }
        };
        fetchPedidos();
    }, []);

    const fetchProductos = async (pedidoId) => {
        try {
            const response = await axios.get(`http://localhost:8085/api/v1/detallepedidos/${pedidoId}/productos`);
            return response.data;
        } catch (error) {
            setErrorProductos(error);
            return [];
        }
    };

    useEffect(() => {
        const generateRows = async () => {
            setLoadingProductos(true);
            let ventaTotalTemp = 0;
            const ventasPorProductoTemp = {};

            const rows = await Promise.all(
                pedidos.map(async (pedido) => {
                    const productosData = await fetchProductos(pedido.id);
                    const pedidosFormat = productosData.map((producto) => ({
                        producto: producto.precio,
                        cantidad: producto.cantidad,
                    }));

                    const total = productosData.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
                    ventaTotalTemp += total;

                    productosData.forEach((producto) => {
                        if (ventasPorProductoTemp[producto.nombre]) {
                            ventasPorProductoTemp[producto.nombre] += producto.cantidad;
                        } else {
                            ventasPorProductoTemp[producto.nombre] = producto.cantidad;
                        }
                    });

                    return {
                        id: pedido.id,
                        pedidos: pedidosFormat,
                        destino: `Mesa ${pedido.id_mesa.id}`,
                        estado: pedido.estado,
                        total: total,
                    };
                })
            );

            setRows(rows);
            setVentaTotal(ventaTotalTemp);
            setVentasPorProducto(ventasPorProductoTemp);
            setLoadingProductos(false);
        };

        if (pedidos.length > 0) {
            generateRows();
        }
    }, [pedidos]);

    if (loadingPedidos) return <div>Cargando pedidos...</div>;
    if (errorPedidos) return <div>Error cargando pedidos: {errorPedidos.message}</div>;
    if (loadingProductos) return <div>Cargando productos...</div>;
    if (errorProductos) return <div>Error cargando productos: {errorProductos.message}</div>;

    const generatePDF = () => {
        const doc = new jsPDF();
    
        doc.text("Ventas", 20, 10);
        doc.text(`Total de ventas: ${ventaTotal}`, 20, 20);
        doc.text("Ventas por Producto:", 20, 30);
    
        const data = Object.keys(ventasPorProducto).map((producto, index) => [
          index + 1,
          producto,
          ventasPorProducto[producto],
        ]);
    
        doc.autoTable({
          head: [['#', 'Producto', 'Ventas']],
          body: data,
          startY: 40,
        });
    
        doc.save('reporte_ventas.pdf');
    };

    const generatePDFIndividual = async (pedidoId) => {
        const doc = new jsPDF();
    
        doc.text(`Reporte de Pedido: ${pedidoId}`, 10, 10);
        doc.text(`Total de ventas: ${ventaTotal}`, 10, 20);
    
        const tableColumn = ["Producto", "Ventas"];
        const tableRows = [];
    
        Object.keys(ventasPorProducto).forEach(producto => {
          const rowData = [
            producto,
            ventasPorProducto[producto]
          ];
          tableRows.push(rowData);
        });
    
        doc.autoTable(tableColumn, tableRows, { startY: 30 });
    
        doc.save(`reporte_pedido_${pedidoId}.pdf`);
    };

    return (
        <div style={{ width: '80%', margin: 'auto', marginTop: '2%', marginBottom: '10%' }}>
            <h4>Ventas</h4>
            <h5>Total de ventas: {ventaTotal}</h5>
            <h5>Ventas por Producto:</h5>
            <ListGroup>
                {Object.keys(ventasPorProducto).map((producto) => (
                    <ListGroupItem key={producto}>
                        {producto}: {ventasPorProducto[producto]}
                    </ListGroupItem>
                ))}
            </ListGroup>

            <h5 className="mt-4">Pedidos:</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Pedidos</th>
                        <th>Destino</th>
                        <th>Estado</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>
                                {row.pedidos.map((pedido, index) => (
                                    <p key={index}>{pedido.producto} ({pedido.cantidad})</p>
                                ))}
                            </td>
                            <td>{row.destino}</td>
                            <td>{row.estado}</td>
                            <td>{row.total}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="mt-3">
                <Button variant="primary" onClick={generatePDF} className="me-2">
                    Reporte PDF
                </Button>
                <Button variant="primary" onClick={generatePDFIndividual}>
                    Factura electrónica
                </Button>
            </div>
        </div>
    );
};

export default Ventas;
