import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardImg, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';

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
    <div style={{ backgroundColor: 'red', padding: '16px' }}>
      <Row>
        {productos.map((producto) => (
          <Col key={producto.id} md={4} className="mb-4">
            <Card>
              <CardImg
                top
                src={producto.url}
                alt={producto.nombre}
                style={{ height: 'auto', objectFit: 'cover' }}
              />
              <CardBody style={{ padding: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                <CardTitle tag="h5">{producto.nombre}</CardTitle>
                <CardText>
                  <span style={{ fontFamily: 'Arial, sans-serif', color: 'black' }}>
                    {producto.descripcion}
                  </span>
                  <br />
                  Precio: <strong>${producto.precio}</strong>
                </CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
