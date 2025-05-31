import "./header.css"
import LogoCoin  from "../../assets/CoinSync (1).png"
import { Link } from "react-router-dom"

export function Header() {
    return(
        <header className="flex items-center justify-center h-[120px] max-w-[1080px]">
            <Link to="/">
                <img 
                    className="w-[470px]"
                    src={LogoCoin} 
                    alt="Logo CoinSync" 
                />
            </Link>

        </header>
    )
}