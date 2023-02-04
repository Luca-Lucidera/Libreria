import ILibro from "@/interfaces/ILibro";
import TableCell from "./Cella";

type TableRowPops = {
  value: ILibro[],
  isHeader: boolean
}
export default function TableRow({ value: libri, isHeader }: TableRowPops) {
  if (isHeader)
    return (
      <tr>
        {Object.keys(libri!.at(0)!).map((key) => (
          <th>{key}</th>
        ))}
      </tr>
    );

  return (
    <>
      {libri?.map((libro) => (
        <tr>
          <TableCell value={libro} key={libro.titolo} />
        </tr>
      ))}
    </>
  );
}
