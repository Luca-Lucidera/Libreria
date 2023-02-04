import ILibro from "@/interfaces/ILibro";
import TableCell from "./Cella";

type TableRowPops = {
  value: ILibro[],
  isHeader: boolean
}
export default function TableRow({ value: libri, isHeader }: TableRowPops) {
  let c = 0;
  if (isHeader)
  {
    const headers = Object.keys(libri!.at(0)!)
    return (
      <tr className="border-2 border-white" key={`key-${c++}`}>
        {headers.map((value) => (
          <th className="text-white text-xl" key={value}>{value}</th>
        ))}
      </tr>
    );
  }

  return (
    <>
      {libri?.map((libro) => (
        <tr className="border-2 border-white"  key={`key-${c++}`}>
          <TableCell value={libro} key={libro.titolo} />
        </tr>
      ))}
    </>
  );
}
