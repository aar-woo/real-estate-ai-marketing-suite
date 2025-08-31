interface AddressComponents {
  state?: string;
  zipCode?: string;
  city?: string;
}

// @ts-ignore
import * as parseAddress from "parse-address";

export function getParsedAddress(address: string): AddressComponents {
  const parsed = parseAddress.parseLocation(address);

  return {
    state: parsed?.state || undefined,
    zipCode: parsed?.zip || undefined,
    city: parsed?.city || undefined,
  };
}
