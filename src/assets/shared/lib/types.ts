export type AddressObject = {
  value: string;
  index: number;
}
export type StreetObject = {
  name: string;
  index: number;
  isEnabled: boolean;
  isEnabledByDefault: boolean;
  lastAddressIndex: number;
  lastDefaultAddressIndex: number;
  addresses: AddressObject[];
  defaultAddresses: AddressObject[];
}
