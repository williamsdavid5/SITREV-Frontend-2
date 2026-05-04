import { useEffect } from "react"

export default function Registros() {
    useEffect(() => {
        document.title = "SITREV - Registros";
    }, [])

    return (
        <>
            <p>Registros</p>
        </>
    )
}