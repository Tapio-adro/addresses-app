let streets: string[] = [
  "Będzińska",
  "Gdańska",
  "Handlowa",
  "Wiejska",
  "Wiosenna",
  "Letnia",
  "Spacerowa",
  "Nowopogońska",
  "Norwida",
  "Piaskowa",
  "Prosta",
  "Daleka",
  "27 Stycznia",
  "os. Dziekana",
  "Pusta",
  "Morelowa",
  "3 Szyb",
  "Staropogońska",
  "Robotnicza",
  "Jesienna",
  "Zamiejska",
  "Klonowa",
  "Lipowa",
  "Orzeszkowej",
  "Zapolskiej",
  "Asnyka",
  "Betonowa",
  "Konopnickiej",
  "Stawowa",
  "Promyka",
  "Akacjowa",
  "Kasztanowa",
  "Cyprysowa",
  "Wiśniowa",
];
let defaultStreets: string[] = [
  "Norwida",
  "Piaskowa",
  "Prosta",
  "Daleka",
  "27 Stycznia",
  "os. Dziekana",
  "Gdańska",
  "Handlowa",
  "Wiejska",
  "Wiosenna",
  "Letnia",
  "Spacerowa",
  "Nowopogońska",
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
    lastAddressIndex: 1,
    lastDefaultAddressIndex: 1,
    addresses: [{value: '', index: 0}],
    defaultAddresses: [{value: '', index: 0}]
  }
  streetsData.push(streetObject);
}

export default streetsData;