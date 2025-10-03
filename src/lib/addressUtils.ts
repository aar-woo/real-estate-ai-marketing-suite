interface AddressComponents {
  state?: string;
  zipCode?: string;
  city?: string;
}

// @ts-expect-error - parse-address doesn't have TypeScript definitions
import * as parseAddress from "parse-address";

export function getParsedAddress(address: string): AddressComponents {
  const parsed = parseAddress.parseLocation(address);

  return {
    state: parsed?.state || undefined,
    zipCode: parsed?.zip || undefined,
    city: parsed?.city || undefined,
  };
}

export function validAddress(address: string): boolean {
  const parsed = parseAddress.parseLocation(address);
  if (!parsed?.state || !parsed?.zip || !parsed?.city || !parsed?.street) {
    return false;
  }
  return true;
}
