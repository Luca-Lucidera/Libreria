import ILibro from "@/interfaces/ILibro";

export type TableCellProps = {
  value: ILibro;
};

export default function TableCell({ value: libro }: TableCellProps) {
  const values = Object.values(libro)
  let c = 0;
  return (
    <>
      {values.map((value) =>
        typeof value === "string" && value.toString().charAt(0) === "#" ? (
          <td style={{ backgroundColor: value }} key={`key-${c++}`}></td>
        ) : (
          <td className="text-white text-xl" key={`key-${c++}`}>{value}</td>
        )
      )}
    </>
  );
}
