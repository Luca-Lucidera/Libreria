import ILibro from "@/interfaces/ILibro";
import TableCell from "./Cella";

type TableRowPops = {
  libri: ILibro[];
  isHeader: boolean;
  setLibroDaSelezionare?: Function;
  setUpdateModalClick?: Function;
};
export default function TableRow({
  libri: libri,
  isHeader,
  setLibroDaSelezionare,
  setUpdateModalClick,
}: TableRowPops) {
  if (isHeader) {
    const { id, ...libro } = libri!.at(0)!;
    const headers = Object.keys(libro);
    return (
      <tr className="border-2 border-white">
        {headers.map((value, index) => (
          <th className="text-white text-xl text-center pl-8 pr-8 border-solid border-green-500 border-2" key={index}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </th>
        ))}
        <th  className="text-white text-xl border-solid text-center border-green-500 border-2 pl-8 pr-8">Modifica</th>
      </tr>
    );
  }

  return (
    <>
      {libri?.map((libro, index) => (
        <tr className="border-2 border-white" key={index}>
          <TableCell
            value={libro}
            key={libro.titolo}
            setLibroDaSelezionare={setLibroDaSelezionare!}
            setUpdateModalClick={setUpdateModalClick!}
          />
        </tr>
      ))}
    </>
  );
}
