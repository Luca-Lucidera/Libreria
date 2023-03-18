import Libro from "@/model/Libro";

export type TableCellProps = {
  value: Libro;
  setLibroDaSelezionare: Function;
  setUpdateModalClick: Function;
};

export default function TableCell({
  value: libro,
  setLibroDaSelezionare,
  setUpdateModalClick,
}: TableCellProps) {
  const { id, ...noId } = libro;
  const mapped = Object.entries(noId);

  function handleClick() {
    setLibroDaSelezionare!(libro!);
    setUpdateModalClick(true);
  }
  return (
    <>
      {mapped.map((map, index) => (
        <td className="text-white text-xl text-center border-purple-500 border-2 border-solid" key={index}>
          {map[1]}
        </td>
      ))}
      <td className="text-center border-2 border-solid- border-purple-500">
        <button className="text-white text-xl text-center" onClick={handleClick}>Modifica</button>
      </td>
    </>
  );
}
