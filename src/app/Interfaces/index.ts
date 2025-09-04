export interface INemocnica {
  id: number;
  nazov: string;
}

export interface IZamestnanec {
  id: number;
  meno: string;
  priezvisko: string;
  nazovOddelenia: string;
  rodneCislo: string;
  pocetPodanychLiekov: number;
}

export interface ILiek {
  id: number;
  nazov: string;
  dosage: string;
  kategoria: string;      
  podkategoria: string;   
}

export interface IPobyt {
  id: number;
  cisloIzby: string;
  zaciatok: string;
  ukoncene: string;
}

export interface IPacient {
  id: number;
  meno: string;
  priezvisko: string;
  rodneCislo: string;
  oddelenie: string;  
  medicines: ILiek[],
  events: IAktivita[],
  pobyt: IPobyt[]
}

export interface IAktivita {
  id: number;
  nazovAktivity: string;
  casOpakovania: string;
}

export interface IOddelenie {
  id: number;
  nazov: string;
}

export interface IPodanie {
  idPodanie: number;
  pacientId: number;
  liekId: number;
  zaciatokPodania: string; // "YYYY-MM-DDTHH:mm" pre <input type="datetime-local">
  ukoncene: string;        // prázdny string = prebieha
}


