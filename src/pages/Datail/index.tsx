import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import type {CoinProps}  from "../Home"
import "./Datail.module.css"

interface ResponseData {
  data: CoinProps
}

interface ErrorData {
  error: string
}

type DataProps = ResponseData | ErrorData

export function Datail() {
  const { cripto } = useParams()
  const navigate = useNavigate()

  const [coin, setCoin] = useState<CoinProps>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=866e9c41e5f711c697e5b66e45bf0b0c91ebe635c34c72efcb0a644e74ab6d9b`)
        .then(response => response.json())
        .then((data: DataProps) => {
          if ("error" in data ) {
            navigate("/")
            return
          }

          const coinData = data.data

          const price = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          })

          const priceCompact = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact"
          })

          const formatedResult = {
            ...coinData,
            formatedPrice: price.format(Number(coinData.priceUsd)),
            formatedMarket: priceCompact.format(Number(coinData.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(coinData.volumeUsd24Hr))
          }

          setCoin(formatedResult)
          setLoading(false)

        })

      } catch (error) {
        console.log(error)
        navigate("/")
      }
    }

    getCoin()
  }, [cripto])

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center">
        <h1 className="mt-16 text-3xl text-white font-bold">
          Carregando <span className="text-purple-500">{cripto}...</span>
        </h1>
      </div>
    )
  }

  return (

   <div className="flex justify-center">
      <div className="bg-black w-full flex items-center max-w-[500px] h-[350px] mx-4 mt-24 py-6 px-10 rounded-2xl border-t-2 border-purple-600/60">
        <div className="text-white">
          <img 
            src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} 
            alt="Logo name" 
            className="w-[60px] h-[60px] mb-2 hover:scale-115 hover:rotate-360 duration-700 ease-in-out z-10000"
          />

          <h1 className="text-3xl font-bold mb-4">
            {coin?.name} | <span className="text-purple-600">{coin?.symbol}</span>
          </h1>

          <h2 className="mb-2 text-xl">
            <span className="font-bold">Preço:</span> {coin?.formatedPrice}
          </h2>

          <h2 className="mb-2 text-xl">
            <span className="font-bold">Mercado:</span> {coin?.formatedMarket}
          </h2>

          <h2 className="mb-2 text-xl">
            <span className="font-bold">Volume:</span> {coin?.formatedVolume}
          </h2>
          
          <div className="flex gap-2 text-xl">
            <h2 className="mb-2 font-bold">
              Mudança 24h:
            </h2>

            <span className={`text-xl ${Number(coin?.changePercent24Hr) < 0 ? "tdloss" : "tdprofit" } font-light`}>
              {Number(coin?.changePercent24Hr).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
   </div>
  )
}
