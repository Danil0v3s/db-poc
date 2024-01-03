'use client'

import { useEffect, useState } from "react"
import { useDebounce } from "@uidotdev/usehooks"
import { load } from 'cheerio';
import { ItemHistory, Item, Query, Recommendation, TableType } from "./types";
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

function getUniqueIds(result: Item[]): number[] {
  let uniqueIds: number[] = [];
  result.reduce((result, item, index, array) => {
    if (!result.includes(item.cart.nameid)) {
      result.push(item.cart.nameid);
    }

    return result;
  }, uniqueIds);

  return uniqueIds;
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
  const [tableType, setTableType] = useState(TableType.Results);

  const debouncedSearchTerm = useDebounce(query, 300)

  useEffect(() => {
    const fn = async () => {
      if (debouncedSearchTerm.value.length < 3 || !debouncedSearchTerm.isManual) return;
      const suggestions: Recommendation[] = await getSuggestions(debouncedSearchTerm.value);
      setSuggestions(suggestions);

      setLoading(true);
      const result = await search(suggestions.map(it => it.id).join(","), quantity);
      setUniqueIds(getUniqueIds(result));
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
        setUniqueIds(getUniqueIds(result));
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
    <main className="dark flex min-h-screen flex-col items-center justify-between p-24 dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
      <div className="w-full items-center justify-between text-sm lg:flex">
        <div className="w-full">
          <div className="flex-row">
            <SuggestionsComponent
              onSubmit={e => {
                e.preventDefault()
                setSuggestions([])
              }}
              selectedTabIndex={tableType}
              onTabSelected={(type) => setTableType(type)}
              query={query.value}
              onInputChange={(e) => setQuery({ value: e, isManual: true })}
              onRecommendationSelected={setSelectedSuggestion}
              recommendations={suggestions}
              onQuantityChange={(e) => setQuantity(e)}

            />
          </div>

          {tableType == TableType.Results && <ItemsTable data={data} isLoading={isLoading} />}
          {tableType == TableType.PriceHistory && <ItemHistoryTable itemHistory={itemHistory} isLoadingHistory={isLoadingHistory} />}
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://github.com/Danil0v3s" className="hover:underline">Danil0v3s</a>
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="https://github.com/Danil0v3s" target="_blank" className="hover:underline me-4 md:me-6">GitHub</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/daniloleemes/" target="_blank" className="hover:underline me-4 md:me-6">LinkedIn</a>
          </li>
        </ul>
      </footer>
    </main>
  )
}


