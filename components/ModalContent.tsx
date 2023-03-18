import Libro from "@/model/Libro";

interface ModalProps {
  libro: Libro;
  setLibroSelezionato: Function;
}

export default function ModalContent({
  libro,
  setLibroSelezionato,
}: ModalProps) {
  const entries = Object.entries(libro);
  const attuali = libro.comprati;
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
        <div className="mb-4" key={"div-" + index}>
          {map[0] !== "id" ? (
            <label className="text-white text-2xl mr-2" htmlFor={map[0]} key={index}>
              {map[0].charAt(0).toUpperCase() + map[0].slice(1)}
            </label>
          ) : null}
          {typeof map[1] === "number" ? (
            <>
              <input
                key={"input-" + index}
                type="number"
                className="p-1 rounded-md w-14"
                max={map[0] === "letti" ? attuali : 999}
                id={map[0]}
                value={map[1] as number}
                onChange={(e) =>
                  setLibroSelezionato({
                    ...libro,
                    [map[0]]: parseFloat(e.target.value),
                  })
                }
              />
              {map[0] == "prezzo" ? (
                <p className="inline-block text-white text-3x pl-2">€</p>
              ) : null}
            </>
          ) : map[0] == "tipo" || map[0] == "status" ? (
            <select
              key={"select-" + index}
              className="p-1 w-1/2 rounded-md"
              id={map[0]}
              value={map[1]}
              onChange={(e) =>
                setLibroSelezionato({ ...libro, [map[0]]: e.target.value })
              }
            >
              {map[0] === "tipo"
                ? typeList.map((tipo, i) => <option value={tipo} key={"option-type-" + i}>{tipo}</option>)
                : statusList.map((status, i) => (
                    <option value={status} key={"option-status-" + i}>{status}</option>
                  ))}
            </select>
          ) : map[0] === "id" ? null : (
            <input
              type="text"
              key={"text-" + index}
              className="p-1 rounded-md"
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
