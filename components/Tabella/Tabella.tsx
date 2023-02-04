import ILibro from "@/interfaces/ILibro";
import TableRow from "./Riga";

type TabellaProps = {
    value: ILibro[]
}

export default function Tabella({value}: TabellaProps) {
    return <table>
        <thead>
            <TableRow value={value} isHeader={true}/>
        </thead>
        <tbody>
            <TableRow value={value} isHeader={false} />
        </tbody>
    </table>
}