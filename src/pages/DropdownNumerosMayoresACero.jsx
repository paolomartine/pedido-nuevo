import React, { useState } from 'react';

function DropdownNumerosMayoresACero({ numeros }) {
  const [seleccionado, setSeleccionado] = useState(null);
  
  const handleSeleccionar = (numero) => {
    setSeleccionado(numero);
  };

  return (
    <div>
      <label>Selecciona cantidad:</label>
      <select value={seleccionado} onChange={(e) => handleSeleccionar(parseInt(e.target.value))}>
        <option value="">Seleccionar...</option>
        {numeros.filter(numero => numero > 0).map(numero => (
          <option key={numero} value={numero}>{numero}</option>
        ))}
      </select>
      {seleccionado && <p>Cantidad: {seleccionado}</p>}
    </div>
  );
}

export default DropdownNumerosMayoresACero;
