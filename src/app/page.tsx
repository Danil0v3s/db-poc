'use client'

import { FormEventHandler, useEffect, useState } from "react"
import { useDebounce } from "@uidotdev/usehooks"
import itemNames, { ItemNameSlot } from "./id_name_slots"
import { load } from 'cheerio';
import { ItemHistory, Cart, Item, Query, Recommendation, Vending } from "./types";
import SuggestionsComponent from "./components/searchField";
import ItemsTable from "./components/itemsTable";
import ItemHistoryTable from "./components/itemHistoryTable";



async function getSuggestions(query: string): Promise<any> {
  var res = await fetch(`https://roleta.ragna4th.com/db/i/q/in/${query}`);
  var data = await res.json();

  return data;
}

async function search(nameIds: string, items: number, offset: number = 0): Promise<Item[]> {
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

async function scrap(nameid: number): Promise<ItemHistory> {
  const data = await (await fetch(`https://db.ragna4th.com/item/${nameid}`)).text()
  const $ = load(data);

  const cells = $('div.nk-iv-wg3-sub');
  const values = cells.map((index, child) => {
    const title = $(child).find("center")[0];
    const value = $(child).find("center")[1];
    const subtitle = $(child).find("center")[2];

    return $(value).text()
  }).toArray();

  return {
    nameid,
    cheapestAvailable: parseInt(values[0].replaceAll(".", "").replaceAll("ƶ", "")),
    cheapestSold: parseInt(values[1].replaceAll(".", "").replaceAll("ƶ", "")),
    highestSold: parseInt(values[2].replaceAll(".", "").replaceAll("ƶ", "")),
    quantitySold: parseInt(values[3].replaceAll(".", "").replaceAll("ƶ", ""))
  }
}

export default function Home() {
  const _: Recommendation = { id: 0, name: '' };

  const [query, setQuery] = useState<Query>({ isManual: false, value: '' })
  const [isLoading, setLoading] = useState(false)
  const [isLoadingHistory, setLoadingHistory] = useState(false)
  const [suggestions, setSuggestions] = useState<Recommendation[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<Recommendation>(_)
  const [data, setData] = useState<Item[]>([])
  const [quantity, setQuantity] = useState<number>(10)
  const [uniqueIds, setUniqueIds] = useState<number[]>([])
  const [itemHistory, setItemHistory] = useState<ItemHistory[]>([]);

  const debouncedSearchTerm = useDebounce(query, 300)

  useEffect(() => {
    const fn = async () => {
      if (debouncedSearchTerm.value.length < 3 || !debouncedSearchTerm.isManual) return;
      const suggestions: Recommendation[] = await getSuggestions(debouncedSearchTerm.value);
      setSuggestions(suggestions.slice(0, 20));

      setLoading(true);
      const result = await search(suggestions.map(it => it.id).slice(0, 20).join(","), quantity);
      let uniqueIds: number[] = [];
      result.reduce((result, item, index, array) => {
        if (!result.includes(item.cart.nameid)) {
          result.push(item.cart.nameid);
        }

        return result;
      }, uniqueIds);
      setUniqueIds(uniqueIds);
      setLoading(false);
      setData(result);
    };

    fn();
  }, [debouncedSearchTerm, quantity])

  useEffect(() => {
    const fn = async () => {
      if (selectedSuggestion.id > 0) {
        setSuggestions([]);
        setItemHistory([]);
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

  useEffect(() => {
    const fn = async () => {
      setLoadingHistory(true);
      const itemsSellingHistory = await Promise.all(uniqueIds.map(it => scrap(it)));
      setLoadingHistory(false);
      setItemHistory(itemsSellingHistory);
    }
    fn();
  }, [uniqueIds]);

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

          <ItemsTable data={data} isLoading={isLoading} />
          <ItemHistoryTable itemHistory={itemHistory} isLoadingHistory={isLoadingHistory} />
        </div>
      </div>
    </main>
  )
}


