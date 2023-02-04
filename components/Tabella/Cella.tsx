import ILibro from "@/interfaces/ILibro";

export type TableCellProps = {
  value: ILibro;
};

export default function TableCell({ value: libro }: TableCellProps) {
  return (
    <>
      {Object.values(libro).map((value) => (
        <td>{value}</td>
      ))}
    </>
  );
}
