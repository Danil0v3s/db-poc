import { Item } from "../types"
import itemNames, { ItemNameSlot } from "../id_name_slots"
import CardElement from "./itemCardElement"
import { Row, Table, TableBody, TableHead } from "./table"
import LoadingSpinner from "./loadingSpinner"

export type ItemTableProps = {
    data: Item[]
    isLoading: boolean
}

export default function ItemsTable({ data, isLoading }: ItemTableProps) {
    return (
        <Table>
            <TableHead>
                <th scope="col" className="px-6 py-3">ITEM</th>
                <th scope="col" className="px-6 py-3">CARTAS</th>
                <th scope="col" className="px-6 py-3">PREÇO</th>
                <th scope="col" className="px-6 py-3">QUANTIDADE</th>
                <th scope="col" className="px-6 py-3">LINK DA LOJA</th>
                <th scope="col" className="px-6 py-3">VENDEDOR</th>
            </TableHead>
            <TableBody >
                {
                    isLoading && (
                        <Row>
                            <th scope="row" colSpan={6} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <LoadingSpinner />
                            </th>
                        </Row>
                    )
                }
                {
                    data.length == 0 && !isLoading && (
                        <Row>
                            <th scope="row" colSpan={6} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Sua pesquisa não retornou resultados</th>
                        </Row>
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
                            <Row key={index}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="flex gap-3">
                                        <img src={`https://roleta.ragna4th.com/db/i/ic/${it.cart.nameid}`} height={24} width={24} alt={item.name} />
                                        <a href={`https://www.divine-pride.net/database/item/${it.cart.nameid}`} target="_blank">{it.cart.refine > 0 ? `+${it.cart.refine}` : ""} {item.name} {parseInt(item.slots) > 0 ? `[${item.slots}]` : ""}</a>
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
                            </Row>
                        )
                    })
                }
            </TableBody>
        </Table>
    )
}