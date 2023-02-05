import ILibro from "@/interfaces/ILibro";
import TableCell from "./Cella";

type TableRowPops = {
  libri: ILibro[];
  isHeader: boolean;
  setLibroDaSelezionare?: Function;
  setOpenModal?: Function;
};
export default function TableRow({
  libri: libri,
  isHeader,
  setLibroDaSelezionare,
  setOpenModal,
}: TableRowPops) {
  let c = 0;
  if (isHeader) {
    const headers = Object.keys(libri!.at(0)!);
    return (
      <tr className="border-2 border-white" key={`key-${c++}`}>
        {headers.map((value) => (
          <th className="text-white text-xl pl-2" key={value}>
            {value}
          </th>
        ))}
      </tr>
    );
  }

  return (
    <>
      {libri?.map((libro) => (
        <tr className="border-2 border-white" key={`key-${c++}`}>
          <TableCell
            value={libro}
            key={libro.titolo}
            setLibroDaSelezionare={setLibroDaSelezionare!}
            setOpenModal={setOpenModal!}
          />
        </tr>
      ))}
    </>
  );
}
