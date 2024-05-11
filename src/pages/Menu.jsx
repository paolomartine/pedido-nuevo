import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function TitlebarBelowImageList() {
  const [productos, setProductos] = React.useState([]);

  React.useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:8085/api/v1/productos');
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'red', padding: '16px' }}>
      
      <ImageList style={{ width: '100%', maxWidth: 500 }}>
        {productos.map((producto) => (
          <ImageListItem key={producto.id}>
            <img
              src={producto.url}
              alt={producto.nombre}
              loading="lazy"
              style={{ width: '100%', height: 'auto' }}
            />
            <ImageListItemBar
              title={producto.nombre}
              subtitle={<span style={{ fontFamily: 'Arial, sans-serif', color: 'white', textShadow: '2px 2px black' }}>Ingredientes: {producto.ingredientes}</span>}
              style={{ color: 'white' }}
              position="below"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}
