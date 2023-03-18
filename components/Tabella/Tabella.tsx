import Libro from "@/model/Libro";
import TableRow from "./Riga";

type TabellaProps = {
  libri: Libro[];
  setLibroDaSelezionare: Function;
  setUpdateModalClick: Function;
};

export default function Tabella({
  libri: value,
  setLibroDaSelezionare,
  setUpdateModalClick,
}: TabellaProps) {
  return (
    <table className="border-white border-2 ml-auto mr-auto mt-10">
      <thead>
        <TableRow libri={value} isHeader={true} key={"headers"} />
      </thead>
      <tbody>
        <TableRow
          libri={value}
          isHeader={false}
          key={"body"}
          setLibroDaSelezionare={setLibroDaSelezionare}
          setUpdateModalClick={setUpdateModalClick}
        />
      </tbody>
    </table>
  );
}
