import ILibro from "@/interfaces/ILibro";
import TableRow from "./Riga";

type TabellaProps = {
  value: ILibro[];
  setLibroDaSelezionare: Function;
  setOpenModal: Function;
};

export default function Tabella({
  value,
  setLibroDaSelezionare,
  setOpenModal,
}: TabellaProps) {
  return (
    <table className="border-white border-2 ml-auto mr-auto mt-10">
      <thead>
        <TableRow value={value} isHeader={true} key={"headers"} />
      </thead>
      <tbody>
        <TableRow
          value={value}
          isHeader={false}
          key={"body"}
          setLibroDaSelezionare={setLibroDaSelezionare}
          setOpenModal={setOpenModal}
        />
      </tbody>
    </table>
  );
}
