'use client'

import { FormEventHandler, useEffect, useState } from "react"
import { useDebounce } from "@uidotdev/usehooks"
import itemNames from "./id_name_slots"

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

async function search(query: string): Promise<any> {
  var res = await fetch(`https://api.ragna4th.com/db/market`, {
    method: 'post',
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      limit: 10,
      filters: [
        {
          field: "nameid",
          operator: "in",
          value: `[${query}]`
        }
      ],
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

  const debouncedSearchTerm = useDebounce(query, 300)

  useEffect(() => {
    const fn = async () => {
      if (debouncedSearchTerm.value.length < 3 || !debouncedSearchTerm.isManual) return;
      const suggestions: Recommendation[] = await getSuggestions(debouncedSearchTerm.value);
      setSuggestions(suggestions);

      const result = await search(suggestions.map(it => it.id).slice(0, 20).join(","));
      setData(result);
    };

    fn();
  }, [debouncedSearchTerm])

  useEffect(() => {
    const fn = async () => {
      if (selectedSuggestion.id > 0) {
        setSuggestions([])
        setQuery({ value: selectedSuggestion.name, isManual: false });
        const result = await search(`${selectedSuggestion.id}`);
        setData(result);
      }
    };

    fn();
  }, [selectedSuggestion])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <div className="card w-full">
          <div className="flex-row w-full pb-2">
            <SuggestionsComponent
              onSubmit={e => {
                e.preventDefault();
                setSuggestions([]);
              }}
              query={query.value}
              onInputChange={(e) => setQuery({ value: e, isManual: true })}
              onRecommendationSelected={setSelectedSuggestion}
              recommendations={suggestions} />
          </div>

          <div className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <th scope="col" className="px-6 py-3">ITEM</th>
                <th scope="col" className="px-6 py-3">CARTAS</th>
                <th scope="col" className="px-6 py-3">PREÇO</th>
                <th scope="col" className="px-6 py-3">QUANTIDADE</th>
                <th scope="col" className="px-6 py-3">LOCALIZAÇÃO</th>
                <th scope="col" className="px-6 py-3">VENDEDOR</th>
              </thead>
              <tbody >
                {
                  data.map((it, index) => {
                    // ??????
                    const item = itemNames[it.cart.nameid.toString()];
                    const card0 = itemNames[it.cart.card0.toString()];
                    const card1 = itemNames[it.cart.card1.toString()];
                    const card2 = itemNames[it.cart.card2.toString()];
                    const card3 = itemNames[it.cart.card3.toString()];

                    return (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <div className="flex justify-between">
                            <img src={`https://roleta.ragna4th.com/db/i/ic/${it.cart.nameid}`} height={24} width={24} />
                            <p className="text-left">{it.cart.refine > 0 ? `+${it.cart.refine}` : ""} {item.name} {parseInt(item.slots) > 0 ? `[${item.slots}]` : ""}</p>
                          </div>
                        </th>

                        <td className="px-6 py-4">
                          {
                            card0 && (
                              <div className="group relative flex justify-center">
                                <button type="button">
                                  <img src={`https://roleta.ragna4th.com/db/i/ic/${it.cart.card0}`} height={24} width={24} />
                                </button>
                                <span className="absolute top-8 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">{card0.name}</span>
                              </div>
                            )
                          }
                        </td>

                        <td className="px-6 py-4">{new Intl.NumberFormat('pt-BR').format(it.price)}ƶ</td>
                        <td className="px-6 py-4">{it.amount}</td>
                        <td className="px-6 py-4">{it.vending.map} {it.vending.x}, {it.vending.y}</td>
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
}

function SuggestionsComponent(props: SuggestionProps) {
  return (
    <form onSubmit={props.onSubmit}>
      <div className="mb-6">
        <input value={props.query}
          placeholder="Search"
          onChange={e => props.onInputChange(e.target.value)}
          type="text"
          id="default-input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
      </div>
      {
        props.recommendations && props.recommendations.map((it, index) => {
          return (<p key={index} onClick={() => props.onRecommendationSelected(it)}>{it.name}</p>)
        })
      }
    </form>
  )
}
