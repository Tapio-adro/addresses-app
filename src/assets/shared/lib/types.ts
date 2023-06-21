type AddressObject = {
  value: string;
  index: number;
  isDefault: boolean;
}
export type StreetObject = {
  name: string;
  index: number;
  isEnabled: boolean;
  isEnabledByDefault: boolean;
  lastAddressIndex: number,
  addresses: AddressObject[];
}
