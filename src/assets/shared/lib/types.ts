export type AddressObject = {
  value: string;
  index: number;
  isVisited: boolean;
}
export type StreetObject = {
  name: string;
  index: number;
  isVisited: boolean;
  isEnabled: boolean;
  isEnabledByDefault: boolean;
  lastAddressIndex: number;
  lastDefaultAddressIndex: number;
  addresses: AddressObject[];
  defaultAddresses: AddressObject[];
}
