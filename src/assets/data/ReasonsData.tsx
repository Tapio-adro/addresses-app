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

export let reasonsData: ReasonObject[] = reasons.map((reason) => {
  return {value: reason, isChecked: false};
});

let canceledAddressesData: ReasonWithAddressesObject[] = [];
let localCanceledAddressesData = window.localStorage.getItem('canceledAddressesData');
if (localCanceledAddressesData !== null) {
  canceledAddressesData = JSON.parse(localCanceledAddressesData);
} else {
  canceledAddressesData = reasons.map((reason) => {
    return {name: reason, isOpen: false, addresses: []}
  });
}
export {canceledAddressesData};


