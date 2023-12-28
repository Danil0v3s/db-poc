'use client'

import { FormEventHandler, useEffect, useState } from "react"
import { useDebounce } from "@uidotdev/usehooks"

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
        setQuery({ value: selectedSuggestion.name, isManual: false });
        const result = await search(`${selectedSuggestion.id}`);
        setData(result);
      }
    };

    fn();
  }, [selectedSuggestion])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
          <hr />
          <div className="flex-row pt-2">
            <table className="w-full">
              <thead>
                <th>ITEM</th>
                <th>PREÇO</th>
                <th>QUANTIDADE</th>
                <th>LOCALIZAÇÃO</th>
                <th>VENDEDOR</th>
              </thead>
              <tbody>
                {
                  data.map((it, index) => {
                    return (
                      <tr key={index}>
                        <td><img src={`https://roleta.ragna4th.com/db/i/ic/${it.cart.nameid}`} /> {it.cart.nameid}</td>
                        <td>{it.price}ƶ</td>
                        <td>{it.amount}</td>
                        <td>
                          <p>{it.vending.map} {it.vending.x}, {it.vending.y}</p>
                          <span>{it.vending.char.shopCode}</span>
                        </td>
                        <td>{it.vending.char.name}</td>
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
      <input className="w-full" value={props.query} placeholder="Search" onChange={e => props.onInputChange(e.target.value)} />
      {
        props.recommendations && props.recommendations.map((it, index) => {
          return (<p key={index} onClick={() => props.onRecommendationSelected(it)}>{it.name}</p>)
        })
      }
    </form>
  )
}
