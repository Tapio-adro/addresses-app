import { ReasonObject } from "../shared/lib/types";

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

let reasonsData: ReasonObject[] = reasons.map((reason) => {
  return {value: reason, isChecked: false};
});

export default reasonsData;
