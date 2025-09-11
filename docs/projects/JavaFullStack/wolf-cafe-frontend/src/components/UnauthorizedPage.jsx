import React from 'react';

function UnauthorizedPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <img 
        src="/src/images/Unauth-Picture.jpg" 
        alt="Unauthorized Access" 
        style={{ width: '25%', height: 'auto', marginTop: '20px' }}
      />
    </div>
  );
}

export default UnauthorizedPage;
