import { Navigate, useLocation } from 'react-router-dom';
import { sessionUtils } from '../../utils/sessionUtils';

export default function RotaProtegida({ children }) {
    const location = useLocation();

    const isValid = sessionUtils.isSessionValid();

    if (!isValid) {
        if (location.pathname !== '/') {
            sessionUtils.clearSession();
        }
        return <Navigate to="/" state={{ from: location.pathname, abrirLogin: true }} replace />;
    }

    return children;
}