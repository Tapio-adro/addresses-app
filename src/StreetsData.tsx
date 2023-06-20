let streets: string[] = [
  "Pusta",
  "Handlowa",
  "Molerowa",
  "Wiejska",
  "3 Szyb",
  "Wiosenna",
  "Zimowa",
  "Staropogońska",
  "Robotnicza",
  "Gdańska",
  "Jesienna",
  "Norwida",
  "Piaskowa",
  "Prosta",
  "Daleka",
  "Skorupki",
  "Zamiejska",
  "Letnia",
  "Słowackiego",
  "Klonowa",
  "27 Stycznia",
  "Lipowa",
  "Krasickiego",
  "Spacerowa",
  "Krótka",
  "Wyspiańskiego",
  "Orzeszkowej",
  "Zapolskiej",
  "Asnyka",
  "Sienkiewicza",
  "os. Dziekana",
  "Betonowa",
  "Konopnickiej",
  "Nowopogońska",
  "Grota-Roweckiego",
  "Prusa",
  "Stawowa",
  "Matejki",
  "Rzemieślnicza",
  "Kopernika",
  "Promyka",
  "Akacjowa",
  "Kasztanowa",
  "Mysłowicka",
  "Batorego",
  "Cyprysowa",
  "Wiśniowa",
];
let defaultStreets: string[] = [
  "Staropogońska",
  "Robotnicza",
  "Gdańska",
  "Jesienna",
  "Norwida",
  "Piaskowa",
  "Prosta",
  "Daleka",
  "Stawowa",
  "Matejki",
  "Rzemieślnicza",
  "Kopernika",
];

import { StreetObject } from './assets/shared/lib/types'

let streetsData: StreetObject[] = [];

for (const [index, street] of streets.entries()) {
  let isEnabledByDefault = defaultStreets.includes(street);
  let streetObject: StreetObject = {
    name: street,
    index: index,
    isEnabled: isEnabledByDefault,
    isEnabledByDefault: isEnabledByDefault,
    adresses: []
  }
  streetsData.push(streetObject);
}

export default streetsData;