import { useEffect } from "react";

export default function Motoristas() {
    useEffect(() => {
        document.title = "SITREV - Motoristas";
    }, [])

    return (
        <>
            <h3>Motoristas</h3>
        </>
    )
}