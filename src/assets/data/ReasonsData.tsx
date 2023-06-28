import { ReasonObject, ReasonWithAddressesObject } from "../shared/lib/types";

let reasons: string[] = [
  'Odbiorca nieobecny',
  'Umówiono późniejszy termin doręczenia',
  'Błędny adres',
  'Odmowa przyjęcia przez klienta',
  'Odbiorca nie posiada kwoty COD',
  'Umówiono odbiór własny w oddziale',
  'Odbiorca nieobecny - brak możliwości pozostawienia awizo',
  'Brak czasu kuriera',
  'Brak możliwości weryfikacji odbioru',
];

export const reasonsData: ReasonObject[] = reasons.map((reason) => {
  return {value: reason, isChecked: false};
});
export const canceledAddressesData: ReasonWithAddressesObject[] = reasons.map((reason) => {
  return {name: reason, isOpen: false, addresses: [{street: 'street', number: '12', streetIndex: -1, numberIndex: -1, isDefaultAddress: false}]}
});


