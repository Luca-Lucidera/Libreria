import ILibro from "@/interfaces/ILibro";

export type TableCellProps = {
  value: ILibro;
  setLibroDaSelezionare: Function;
  setOpenModal: Function
};

export default function TableCell({ value: libro, setLibroDaSelezionare, setOpenModal }: TableCellProps) {
  const values = Object.values(libro)
  let c = 0;

  function handleClick() {
    setLibroDaSelezionare!(libro!)
    setOpenModal(true)
  }
  return (
    <>
      {values.map((value) =>
        typeof value === "string" && value.toString().charAt(0) === "#" ? (
          <td style={{ backgroundColor: value }} key={`key-${c++}`} onClick={handleClick}></td>
        ) : (
          <td className="text-white text-xl ml-auto mr-auto pl-6" key={`key-${c++}`}>{value}</td>
        )
      )}
    </>
  );
}
