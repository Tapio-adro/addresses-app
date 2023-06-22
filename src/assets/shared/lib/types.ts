export type AddressObject = {
  value: string;
  index: number;
  isVisited: boolean;
  isCanceled: boolean;
}
export type StreetObject = {
  name: string;
  index: number;
  isVisited: boolean;
  isCanceled: boolean;
  isEnabled: boolean;
  isEnabledByDefault: boolean;
  lastAddressIndex: number;
  lastDefaultAddressIndex: number;
  addresses: AddressObject[];
  defaultAddresses: AddressObject[];
}
