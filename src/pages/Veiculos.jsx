import { useEffect } from "react"

export default function Veiculos() {
    useEffect(() => {
        document.title = "SITREV - Veículos";
    }, [])

    return (
        <>
            <h2>Veiculos</h2>
        </>
    )
}