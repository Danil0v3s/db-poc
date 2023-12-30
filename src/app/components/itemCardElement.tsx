import { ItemNameSlot } from "../id_name_slots"

export type CardProps = {
    id: number
    item: ItemNameSlot
}

export default function CardElement(props: CardProps) {
    return props.item && (
        <div className="group relative flex justify-center">
            <button type="button">
                <img src={`https://roleta.ragna4th.com/db/i/ic/${props.id}`} height={24} width={24} alt={props.item.name} />
            </button>
            <span className="absolute top-8 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">{props.item.name}</span>
        </div>
    )
}