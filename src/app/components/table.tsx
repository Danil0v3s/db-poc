import { ScriptProps } from "next/script"

export function Table({ children }: ScriptProps) {
    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {children}
        </table>
    )
}

export function TableHead({ children }: ScriptProps) {
    return (
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {children}
        </thead>
    )
}

export function TableBody({ children }: ScriptProps) {
    return (
        <tbody>
            {children}
        </tbody>
    )
}

export function Row({ children }: ScriptProps) {
    return (
        <tr className="w-full bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            {children}
        </tr>
    )
}

export function Head({ children }: ScriptProps) {
    return (
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {children}
        </th>
    )
}