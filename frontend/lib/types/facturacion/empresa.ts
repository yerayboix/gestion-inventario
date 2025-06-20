export interface Empresa {
  id: number;
  nombre: string;
  direccion: string;
  nif: string;
  gif: string;
  iban: string;
  created_on: string;
  updated_on: string;
}

export interface UpdateEmpresaData {
  nombre: string;
  direccion: string;
  nif: string;
  gif: string;
  iban: string;
} 