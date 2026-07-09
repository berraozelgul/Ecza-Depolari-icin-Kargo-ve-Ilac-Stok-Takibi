import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';

function GerekliGiris({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/giris" replace />;
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default GerekliGiris;
