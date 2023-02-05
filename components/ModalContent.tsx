import ILibro from "@/interfaces/ILibro";
import { ChangeEvent, useEffect } from "react";

interface ModalProps {
  libro: ILibro;
  setLibroSelezionato: Function;
}

export default function ModalContent({
  libro,
  setLibroSelezionato,
}: ModalProps) {
  console.log(libro);
  const entries = Object.entries(libro);
  const statusList = [
    "Da leggere",
    "In lettura",
    "In pari",
    "Finito",
    "In rilettura",
  ];
  const typeList = ["manga", "light novel", "novel"];

  return (
    <div>
      {entries.map((map: [string, string | number], index) => (
        <div className="mb-4" key={"index-" + index}>
          <label className="text-white text-2xl mr-2" htmlFor={map[0]}>
            {map[0].charAt(0).toUpperCase() + map[0].slice(1)}
          </label>
          {typeof map[1] === "number" ? (
            <input
              type="number"
              className="p-1 rounded-md w-14"
              id={map[0]}
              value={map[1] as number}
              onChange={(e) =>
                setLibroSelezionato({
                  ...libro,
                  [map[0]]: parseInt(e.target.value),
                })
              }
            />
          ) : map[0] == "tipo" || map[0] == "status" ? (
            <select
              className="p-1 w-1/4 rounded-md"
              id={map[0]}
              value={map[1]}
              onChange={(e) =>
                setLibroSelezionato({ ...libro, [map[0]]: e.target.value })
              }
            >
              {map[0] === "tipo"
                ? typeList.map((tipo) => <option value={tipo}>{tipo}</option>)
                : statusList.map((status) => (
                    <option value={status}>{status}</option>
                  ))}
            </select>
          ) : map[0] === "colore" ? (
            <input
              type="color"
              className="p-1 rounded-md w-1/4"
              id={map[0]}
              value={map[1]}
              onChange={(e) =>
                setLibroSelezionato({
                  ...libro,
                  [map[0]]: e.target.value,
                })
              }
            />
          ) : (
            <input
              type="text"
              className="p-1 rounded-md w-1/2"
              id={map[0]}
              value={map[1]}
              onChange={(e) =>
                setLibroSelezionato({
                  ...libro,
                  [map[0]]: e.target.value,
                })
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
