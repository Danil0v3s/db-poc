'use client'

import { FormEventHandler, useEffect, useState } from "react"
import { useDebounce } from "@uidotdev/usehooks"
import itemNames, { ItemNameSlot } from "./id_name_slots"

type Query = {
  value: string
  isManual: boolean
}

type Recommendation = {
  id: number
  name: string
}

type Item = {
  vending_id: number
  amount: number
  price: number
  vending: Vending
  cart: Cart
}

type Cart = {
  nameid: number
  refine: number
  card0: number
  card1: number
  card2: number
  card3: number
}

type Vending = {
  id: number
  map: string
  x: number
  y: number
  char: {
    name: string
    shopCode: number
  }
}


async function getSuggestions(query: string): Promise<any> {
  var res = await fetch(`https://roleta.ragna4th.com/db/i/q/in/${query}`);
  var data = await res.json();

  return data;
}

async function search(nameIds: string, items: number, offset: number = 0): Promise<any> {
  const filters = []
  if (nameIds.length > 0) {
    filters.push({
      field: "nameid",
      operator: "in",
      value: `[${nameIds}]`
    });
  }

  var res = await fetch(`https://api.ragna4th.com/db/market`, {
    method: 'post',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      limit: items,
      offset: offset * items,
      filters,
      order: {
        by: "price",
        direction: "asc"
      }
    })
  })
  var data = await res.json()

  return data.result.items;
}

export default function Home() {
  const _: Recommendation = { id: 0, name: '' };

  const [query, setQuery] = useState<Query>({ isManual: false, value: '' })
  const [isLoading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Recommendation[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<Recommendation>(_)
  const [data, setData] = useState<Item[]>([])
  const [quantity, setQuantity] = useState<number>(10)
  const [copy, setCopy] = useState<boolean>(true)

  const debouncedSearchTerm = useDebounce(query, 300)

  useEffect(() => {
    const fn = async () => {
      if (debouncedSearchTerm.value.length < 3 || !debouncedSearchTerm.isManual) return;
      const suggestions: Recommendation[] = await getSuggestions(debouncedSearchTerm.value);
      setSuggestions(suggestions.slice(0, 20));

      setLoading(true);
      const result = await search(suggestions.map(it => it.id).slice(0, 20).join(","), quantity);
      setLoading(false);
      setData(result);
    };

    fn();
  }, [debouncedSearchTerm, quantity])

  useEffect(() => {
    const fn = async () => {
      if (selectedSuggestion.id > 0) {
        setSuggestions([]);
        setQuery({ value: selectedSuggestion.name, isManual: false });
        setLoading(true);
        const result = await search(`${selectedSuggestion.id}`, quantity);
        setLoading(false);
        setData(result);
      }
    };

    fn();
  }, [selectedSuggestion, quantity])


  useEffect(() => {
    const fn = async () => {
      setLoading(true);
      var items = await search("", 10);
      setLoading(false);
      setData(items);
    };

    fn();
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <div className="card w-full">
          <div className="flex-row w-full pb-2">
            <SuggestionsComponent
              onSubmit={e => {
                e.preventDefault()
                setSuggestions([])
              }}
              query={query.value}
              onInputChange={(e) => setQuery({ value: e, isManual: true })}
              onRecommendationSelected={setSelectedSuggestion}
              recommendations={suggestions}
              onQuantityChange={(e) => setQuantity(e)}
            />
          </div>

          <div className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <th scope="col" className="px-6 py-3">ITEM</th>
                <th scope="col" className="px-6 py-3">CARTAS</th>
                <th scope="col" className="px-6 py-3">PREÇO</th>
                <th scope="col" className="px-6 py-3">QUANTIDADE</th>
                <th scope="col" className="px-6 py-3">LINK DA LOJA</th>
                <th scope="col" className="px-6 py-3">VENDEDOR</th>
              </thead>
              <tbody >
                {
                  isLoading && (
                    <tr className="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" colSpan={6} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white justify-center">
                        <div role="status">
                          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      </th>
                    </tr>
                  )
                }
                {
                  data.length == 0 && !isLoading && (
                    <tr className="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th scope="row" colSpan={6} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Sua pesquisa não retornou resultados</th>
                    </tr>
                  )
                }
                {
                  data.length > 0 && !isLoading && data.map((it, index) => {
                    const item = itemNames[it.cart.nameid.toString()];
                    const card0 = itemNames[it.cart.card0.toString()];
                    const card1 = itemNames[it.cart.card1.toString()];
                    const card2 = itemNames[it.cart.card2.toString()];
                    const card3 = itemNames[it.cart.card3.toString()];

                    return (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex gap-3">
                            <img src={`https://roleta.ragna4th.com/db/i/ic/${it.cart.nameid}`} height={24} width={24} alt={item.name} />
                            <p className="text-left">{it.cart.refine > 0 ? `+${it.cart.refine}` : ""} {item.name} {parseInt(item.slots) > 0 ? `[${item.slots}]` : ""}</p>
                          </div>
                        </th>

                        <td className="px-6 py-4">
                          <div className="flex flex-row">
                            <CardElement item={card0} id={it.cart.card0} />
                            <CardElement item={card1} id={it.cart.card1} />
                            <CardElement item={card2} id={it.cart.card2} />
                            <CardElement item={card3} id={it.cart.card3} />
                          </div>
                        </td>

                        <td className="px-6 py-4">{new Intl.NumberFormat('pt-BR').format(it.price)}ƶ</td>
                        <td className="px-6 py-4">{it.amount}</td>
                        <td className="flex px-6 py-4 justify-between">
                          <div className="w-full">
                            <button onClick={(e) => { navigator.clipboard.writeText(`@loja ${it.vending.char.shopCode}`) }}
                              type="button"
                              className="w-full px-3 py-2 text-xs font-xs text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-white me-2">
                                <path fillRule="evenodd" d="M10.986 3H12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1.014A2.25 2.25 0 0 1 7.25 1h1.5a2.25 2.25 0 0 1 2.236 2ZM9.5 4v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75V4h3Z" clipRule="evenodd" />
                              </svg>
                              {it.vending.char.shopCode}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">{it.vending.char.name}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}

type SuggestionProps = {
  recommendations: Recommendation[];
  query: string;
  onSubmit: FormEventHandler<HTMLFormElement> | undefined;
  onInputChange: (value: string) => void;
  onRecommendationSelected: (rec: Recommendation) => void;
  onQuantityChange: (value: number) => void;
}

function SuggestionsComponent(props: SuggestionProps) {
  return (
    <form onSubmit={props.onSubmit} className="relative">
      <div className="mb-2 flex">
        <input value={props.query}
          placeholder="Search"
          onChange={e => props.onInputChange(e.target.value)}
          type="text"
          id="default-input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <select
          id="select-quantity"
          name="select-quantity"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => props.onQuantityChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      {
        props.recommendations.length > 0 && (
          <div className="absolute w-full bg-gray-600 border border-gray-300 text-white-900 text-sm rounded-lg flex group flex-col bg-opacity-90">
            {
              props.recommendations.map((it, index) => {
                return (
                  <div className="px-2 py-2" key={index} onClick={() => props.onRecommendationSelected(it)}>{it.name}</div>
                )
              })
            }
          </div>
        )
      }
    </form>
  )
}

type CardProps = {
  id: number
  item: ItemNameSlot
}
function CardElement(props: CardProps) {
  return props.item && (
    <div className="group relative flex justify-center">
      <button type="button">
        <img src={`https://roleta.ragna4th.com/db/i/ic/${props.id}`} height={24} width={24} alt={props.item.name} />
      </button>
      <span className="absolute top-8 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">{props.item.name}</span>
    </div>
  )
}