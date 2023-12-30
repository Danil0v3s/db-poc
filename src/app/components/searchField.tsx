import { FormEventHandler } from "react";
import { Recommendation } from "../types";

export type SuggestionProps = {
    recommendations: Recommendation[];
    query: string;
    onSubmit: FormEventHandler<HTMLFormElement> | undefined;
    onInputChange: (value: string) => void;
    onRecommendationSelected: (rec: Recommendation) => void;
    onQuantityChange: (value: number) => void;
}

export default function SuggestionsComponent(props: SuggestionProps) {
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
                    <div className="absolute w-full border border-gray-300 text-white-900 text-sm rounded-lg flex group flex-col backdrop-blur-sm bg-black/80 max-h-80 overflow-y-auto">
                        {
                            props.recommendations.map((it, index) => {
                                return (
                                    <div className="flex px-2 py-2 gap-2" key={index} onClick={() => props.onRecommendationSelected(it)}>
                                        <img src={`https://roleta.ragna4th.com/db/i/ic/${it.id}`} height={24} width={24} alt={it.name} />
                                        {it.name}
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </form>
    )
}
