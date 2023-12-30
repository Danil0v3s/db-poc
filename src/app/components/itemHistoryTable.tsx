import itemNames, { ItemNameSlot } from "../id_name_slots"
import { ItemHistory } from "../types";
import LoadingSpinner from "./loadingSpinner";
import { Row, Table, TableBody, TableHead } from "./table";

export type ItemHistoryTableProps = {
    itemHistory: ItemHistory[]
    isLoadingHistory: boolean
}

export default function ItemHistoryTable({ isLoadingHistory, itemHistory }: ItemHistoryTableProps) {
    return (
        <>
            <p className="text-4xl text-gray-900 dark:text-white pb-4 pt-8">Histórico de vendas</p>
            <Table>
                <TableHead>
                    <th scope="col" className="px-6 py-3">ITEM</th>
                    <th scope="col" className="px-6 py-3">MENOR PREÇO DISP.</th>
                    <th scope="col" className="px-6 py-3">MENOR PREÇO VENDIDO</th>
                    <th scope="col" className="px-6 py-3">MAIOR PREÇO VENDIDO</th>
                    <th scope="col" className="px-6 py-3">NUM. VENDAS</th>
                </TableHead>
                <TableBody>
                    {
                        isLoadingHistory && (
                            <Row>
                                <th scope="row" colSpan={6} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <LoadingSpinner />
                                </th>
                            </Row>
                        )
                    }
                    {
                        itemHistory.length == 0 && !isLoadingHistory && (
                            <Row>
                                <th scope="row" colSpan={6} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Sua pesquisa não retornou resultados</th>
                            </Row>
                        )
                    }
                    {
                        itemHistory.length > 0 && !isLoadingHistory && itemHistory.map((it, index) => {
                            const item = itemNames[it.nameid.toString()];

                            return (
                                <Row key={index}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <div className="flex gap-3">
                                            <img src={`https://roleta.ragna4th.com/db/i/ic/${it.nameid}`} height={24} width={24} alt={item.name} />
                                            <p className="text-left">{item.name} {parseInt(item.slots) > 0 ? `[${item.slots}]` : ""}</p>
                                        </div>
                                    </th>

                                    <td className="px-6 py-4">{new Intl.NumberFormat('pt-BR').format(it.cheapestAvailable)}ƶ</td>
                                    <td className="px-6 py-4">{new Intl.NumberFormat('pt-BR').format(it.cheapestSold)}ƶ</td>
                                    <td className="px-6 py-4">{new Intl.NumberFormat('pt-BR').format(it.highestSold)}ƶ</td>
                                    <td className="px-6 py-4">{new Intl.NumberFormat('pt-BR').format(it.quantitySold)}</td>
                                </Row>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </>
    )
}