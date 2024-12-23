import React from 'react';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import myLogo from './logoempacadora.png';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'yellow', padding: '20px' }}>     
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Columna 1 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <img src={myLogo} alt="Logo" style={{ width: '100px', marginBottom: '10px' }} />
          <p style={{ fontFamily: 'Arial', fontSize: '14px', textAlign: 'center', margin: 0 }}>Todo en comidas rápidas</p>
        </div>
        {/* Columna 2 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <PhoneIcon style={{ marginRight: '10px' }} />
            <p style={{ fontFamily: 'Arial', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Telefono: 8282619</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <WhatsAppIcon style={{ marginRight: '10px' }} />
            <p style={{ fontFamily: 'Arial', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>WhatsApp: 3113939122</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
