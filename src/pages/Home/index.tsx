import { useState, useEffect } from "react"
import type { FormEvent } from "react"
import "./Home.module.css"
import { BsSearch } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom"

export interface CoinProps {
  id: string,
  name: string,
  symbol: string,
  priceUsd: string,
  vwap24Hr: string,
  changePercent24Hr: string,
  rank: string,
  supply: string,
  maxSupply: string,
  marketCapUsd: string,
  volumeUsd24Hr: string,
  explore: string,
  formatedPrice?: string,
  formatedMarket?: string,
  formatedVolume?: string
}

interface DataProps {
  data: CoinProps[]
}

export function Home() {
  const [input, setInput] = useState("")
  const [coins, setCoins] = useState<CoinProps[]>([])
  const [offset, setOffset] = useState(0)

  const filteredCoins = coins.filter((coin) =>
    `${coin.name} ${coin.symbol}`.toLowerCase().includes(input.toLowerCase())
  );


  const navigate = useNavigate()

  useEffect(() => {
    getData()
  }, [offset])

  async function getData() {
    fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=866e9c41e5f711c697e5b66e45bf0b0c91ebe635c34c72efcb0a644e74ab6d9b`)
    .then(response => response.json())
    .then((data: DataProps) => {
      const coinsData = data.data

      const price = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      })

      const priceCompact = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact"
      })

      const formatedResult = coinsData.map((item) => {
        const formated = {
          ...item,
          formatedPrice: price.format(Number(item.priceUsd)),
          formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
        }

        return formated
      })

      const listCoins = [...coins, ...formatedResult]
      setCoins(listCoins)
    })
  }

  function hadleSubmit(e: FormEvent) {
    e.preventDefault()

    if(input === "") return 

    navigate(`/detail/${input.toLowerCase()}`)
  }

  function handleGetMore () {
    if(offset === 0) {
      setOffset(10)
      return
    }

    setOffset(offset + 10)
  }

  return (
    <main className="my-0 px-4">
      <form className="flex w-full gap-4 overflow-hidden" onSubmit={hadleSubmit} >
        <input
          type="text"
          placeholder="Digite o nome de uma Moeda...  Exp: Bitcoin"
          className="w-full h-[44px] px-2 rounded-md bg-white border-0 outline-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        <button type="submit" className="p-2">
          <BsSearch size={24} color="#FFF" />
        </button>
      </form>
      <div>
        <table className="border-separate border-spacing-y-8 sm:border-spacing-y-4 w-full table-fixed -mt-6 sm:mt-4">
          <thead>
            <tr className="text-white">
              <th scope="col">Moeda</th>
              <th scope="col">Valor de Mercado</th>
              <th scope="col">Preço</th>
              <th scope="col">Volume</th>
              <th scope="col">Mudança 24h</th>
            </tr>
          </thead>

          <tbody className="text-center">
            
            {filteredCoins.length > 0 && filteredCoins.map((item) => (
              <tr className="bg-[#1d1c20] text-white font-bold text-lg" key={item.id}>

              <td data-label="Moeda" className="first:rounded-l-md last:rounded-r-md px-2 py-2 ">
                <div className="flex items-center justify-end sm:justify-start gap-2">
                  <img 
                    src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} 
                    alt="Logo name" 
                    className="w-[30px] h-[30px] hover:scale-110 duration-300 z-10000"
                  />

                  <Link to={`/detail/${item.id}`}>
                    <span className="hover:text-zinc-400 duration-300">{item.name} | {item.symbol}</span>
                  </Link>
                </div>
              </td>

              <td data-label="Valor de Mercado">
                <span>{item.formatedMarket}</span>
              </td>

              <td data-label="Preço">
                <span>{item.formatedPrice}</span>
              </td>

              <td data-label="Volume">
                <span>{item.formatedVolume}</span>
              </td>

              <td data-label="Mudança 24h" className={`first:rounded-l-md last:rounded-r-md px-2 py-2 ${Number(item.changePercent24Hr) < 0 ? "tdloss" : "tdprofit" }`}>
                <span>{Number(item.changePercent24Hr).toFixed(3)}%</span>
              </td>

            </tr>
            ))}

            {filteredCoins.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-4">
                  Nenhuma moeda encontrada.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
      
      
      <div className="flex justify-center">
        <button className="bg-purple-700 text-white text-lg py-2 px-6 my-4 rounded-full" onClick={handleGetMore}>
          Ver mais
        </button>
      </div>

    </main>
  )
}
