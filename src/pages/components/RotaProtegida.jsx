
import { Navigate } from 'react-router-dom';
import { sessionUtils } from '../../utils/sessionUtils';

export default function RotaProtegida({ children }) {

    if (!sessionUtils.isSessionValid()) {
        sessionUtils.clearSession();
        return <Navigate to="/" state={{ abrirLogin: true }} replace />;
    }

    return children;
}