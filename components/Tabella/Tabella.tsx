import ILibro from "@/interfaces/ILibro";
import TableRow from "./Riga";

type TabellaProps = {
  libri: ILibro[];
  setLibroDaSelezionare: Function;
  setOpenModal: Function;
};

export default function Tabella({
  libri: value,
  setLibroDaSelezionare,
  setOpenModal,
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
          setOpenModal={setOpenModal}
        />
      </tbody>
    </table>
  );
}
