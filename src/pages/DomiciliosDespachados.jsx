import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Button, Stack, Box, Modal, List, ListItem, ListItemText, Checkbox } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'domiclios',
    headerName: 'Domicilios',
    width: 300,
    renderCell: ({ row }) => (
      <div>{row.domicilios.map((domicilio, index) => (
        <Typography key={index} noWrap>{`${domicilio.producto} (Cantidad: ${domicilio.cantidad})`}</Typography>
      ))}</div>
    ),
  },
  { field: 'destino', headerName: 'Destino', width: 210 },
  { field: 'estado', headerName: 'Estado', width: 210 },
  { field: 'total', headerName: 'Total', type: 'number', width: 120 },
];

const DomiciliosDespachados = () => {
  const [isAnyRowSelected, setIsAnyRowSelected] = useState(false);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [selectedDomicilio, setSelectedDomicilio] = useState([]);
  const [checkedProductos, setCheckedProductos] = useState([]);
  const [domicilios, setDomicilios] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDomicilios = async () => {
      try {
        const { data } = await axios.get("http://localhost:8085/api/v1/domicilios");
        const filteredDomicilios = data.filter(domicilio => domicilio.estado === "DESPACHADO");
        setDomicilios(filteredDomicilios);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchDomicilios();
  }, []);

  useEffect(() => {
    const generateRows = async () => {
      const rowsData = await Promise.all(domicilios.map(async (domicilio) => {
        const productosData = await fetchProductos(domicilio.id);
        const domicilios = productosData.map(({ nombre, cantidad }) => ({ producto: nombre, cantidad }));
        const total = productosData.reduce((sum, { precio, cantidad }) => sum + (precio * cantidad), 0);
        return { 
            id: domicilio.id, 
            domicilios, 
            destino:  domicilio.id_cliente.direccion, 
            estado: domicilio.estado, 
            total };
      }));
      setRows(rowsData);
    };
    if (domicilios.length) generateRows();
  }, [domicilios]);

  const fetchProductos = async (domicilioId) => {
    try {
      const { data } = await axios.get(`http://localhost:8085/api/v1/detallepedidosdom/${domicilioId}/productos`);
      return data;
    } catch (error) {
      setError(error);
      return [];
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setCheckedProductos([]);
  };

  const handleClose = () => {
    setOpen(false);
    setCheckedProductos([]);
    localStorage.removeItem('selectedProductos');
  };

  const onRowsSelectionHandler = (ids) => {
    const selectedData = ids.map(id => rows.find(row => row.id === id)).filter(Boolean);
    setIsAnyRowSelected(ids.length > 0);
    setSelectedRowsData(selectedData);
  };

  const handlePagar = async () => {
    if (selectedRowsData.length) {
      const productos = await fetchProductos(selectedRowsData[0].id);
      setSelectedDomicilio(productos);
      handleOpen();
    }
  };

  const handleModalPagar = async () => {
    const domicilioId = selectedRowsData[0].id;
    try {
      const { data } = await axios.get(`http://localhost:8085/api/v1/domicilios/${domicilioId}`);
      await axios.put(`http://localhost:8085/api/v1/domicilios`, { ...data.data, estado: 'PAGADO' });
      handleClose();
      navigate("/ventas");
      MySwal.fire({ title: "El domicilio se ha pagado:", text: "Gracias por tu compra!", icon: "success" });
    } catch (error) {
      console.error("Error pagando productos:", error);
    }
  };

  if (loading) return <div>Cargando domicilios...</div>;
  if (error) return <div>Error cargando domicilios: {error.message}</div>;

  return (
    <div style={{ height: 400, width: '80%', margin: '5% auto' }}>
      <Typography variant="h6" gutterBottom>Domicilios</Typography>
      <DataGrid rows={rows} columns={columns} checkboxSelection onRowSelectionModelChange={onRowsSelectionHandler} />
      <Stack direction="row" spacing={2} style={{ marginTop: '5%', justifyContent: 'center' }}>
        <Button variant="contained" disabled={!isAnyRowSelected} onClick={handlePagar}>Pagar</Button>
      </Stack>
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h6">Detalles del Domicilio</Typography>
          <List>
            {selectedDomicilio.map((producto, index) => (
              <ListItem key={index} button onClick={() => setCheckedProductos((prev) => {
                const newChecked = [...prev];
                const idx = newChecked.indexOf(producto);
                idx === -1 ? newChecked.push(producto) : newChecked.splice(idx, 1);
                return newChecked;
              })}>
                <Checkbox checked={checkedProductos.includes(producto)} />
                <ListItemText primary={`${producto.nombre} (Cantidad: ${producto.cantidad})`} secondary={`Total: $${producto.precio * producto.cantidad}`} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="primary" onClick={handleModalPagar} disabled={checkedProductos.length !== selectedDomicilio.length}>Pagar</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default DomiciliosDespachados;
