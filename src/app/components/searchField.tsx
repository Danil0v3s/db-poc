import { FormEventHandler } from "react";
import { Recommendation, TableType } from "../types";
import { HiViewList, HiTrendingUp, HiHeart } from 'react-icons/hi';

export type SuggestionProps = {
    recommendations: Recommendation[];
    query: string;
    selectedTabIndex: number;
    onTabSelected: (type: TableType) => void;
    onSubmit: FormEventHandler<HTMLFormElement> | undefined;
    onInputChange: (value: string) => void;
    onRecommendationSelected: (rec: Recommendation) => void;
    onQuantityChange: (value: number) => void;
}

type InputProps = {
    query: string;
    onInputChange: (value: string) => void;
    recommendations: Recommendation[];
    onRecommendationSelected: (rec: Recommendation) => void;
}

type TabGroupProps = {
    selectedIndex: number,
    onTabChange: (index: number) => void
}

function Input(props: InputProps) {
    return (
        <div className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input value={props.query}
                    placeholder="Search"
                    onChange={e => props.onInputChange(e.target.value)}
                    type="text" id="simple-search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required={true} />
                {
                    props.recommendations.length > 0 && (
                        <div className="absolute w-full block w-full p-2 my-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 max-h-80 overflow-y-auto">
                            {
                                props.recommendations.map((it, index) => {
                                    return (
                                        <div className="flex px-2 py-2 gap-2" key={index} onClick={() => props.onRecommendationSelected(it)}>
                                            <img src={`https://roleta.ragna4th.com/db/i/ic/${it.id}`} height={24} width={24} alt={it.name} />
                                            {it.id} - {it.name}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

function TabGroup({ selectedIndex = 1, onTabChange }: TabGroupProps) {
    const selectedClasses = "text-blue-600 border-blue-600"
    const tabClasses = "inline-flex items-center gap-1 p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
    return (
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li className="me-2">
                <a href="#" className={`${tabClasses} ${selectedIndex == 0 ? selectedClasses : ''}`} onClick={() => onTabChange(TableType.Results)}>
                    <HiViewList />
                    Resultados
                </a>
            </li>
            <li className="me-2">
                <a href="#" className={`${tabClasses} ${selectedIndex == 1 ? selectedClasses : ''}`} onClick={() => onTabChange(TableType.PriceHistory)}>
                    <HiTrendingUp />
                    Histórico de Preços
                </a>
            </li>
            <li className="me-2">
                <a href="#" className={`${tabClasses} ${selectedIndex == 2 ? selectedClasses : ''}`} onClick={() => onTabChange(TableType.Favorites)}>
                    <HiHeart />
                    Favoritos
                </a>
            </li>
        </ul>
    )
}

export default function SuggestionsComponent(props: SuggestionProps) {
    return (
        <form onSubmit={props.onSubmit}>
            <div className="relative bg-white shadow-md dark:bg-gray-800">
                <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row">
                    <div className="w-full md:w-1/2">
                        <Input onInputChange={props.onInputChange} query={props.query} recommendations={props.recommendations} onRecommendationSelected={props.onRecommendationSelected} />
                    </div>
                    <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                        <div className="flex items-center w-full space-x-3 md:w-auto">
                            <button id="filterDropdownButton" data-dropdown-toggle="filterDropdown" className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:w-auto focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700" type="button">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-4 h-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                </svg>
                                Filter
                                <svg className="-mr-1 ml-1.5 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </button>
                            {/* <!-- Dropdown menu --> */}
                            <div id="filterDropdown" className="z-10 hidden w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
                                <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                                    Category
                                </h6>
                                <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
                                    <li className="flex items-center">
                                        <input id="apple" type="checkbox" value=""
                                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                        <label htmlFor="apple" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Apple (56)
                                        </label>
                                    </li>
                                    <li className="flex items-center">
                                        <input id="fitbit" type="checkbox" value=""
                                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                        <label htmlFor="fitbit" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Fitbit (56)
                                        </label>
                                    </li>
                                    <li className="flex items-center">
                                        <input id="dell" type="checkbox" value=""
                                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                        <label htmlFor="dell" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Dell (56)
                                        </label>
                                    </li>
                                    <li className="flex items-center">
                                        <input id="asus" type="checkbox" value=""
                                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                                        <label htmlFor="asus" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Asus (97)
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                <div className="flex flex-col items-center justify-between md:flex-row">
                    <div className="border-b border-gray-200 px-4 dark:border-gray-700">
                        <TabGroup selectedIndex={props.selectedTabIndex} onTabChange={props.onTabSelected} />
                    </div>
                </div>
            </div>
        </form>
    )
}
