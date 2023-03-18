export default interface Libro {
  id?: string
  titolo: string 
  comprati: number
  letti: number
  tipo: string
  editore: string
  status: string
  prezzo: number
}

export const libroVuoto: Libro = {
  titolo: "",
  comprati: 1,
  letti: 0,
  tipo: "manga",
  editore: "J-POP",
  status: "Da leggere",
  prezzo: 1,
  id: "",
};
