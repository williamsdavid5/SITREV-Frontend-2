// components/RotaProtegida.jsx
import { Navigate } from 'react-router-dom';

export default function RotaProtegida({ children }) {
    const token = localStorage.getItem('access_token');

    if (!token) {
        return <Navigate to="/" state={{ abrirLogin: true, forcarLogin: true }} replace />;
    }

    return children;
}