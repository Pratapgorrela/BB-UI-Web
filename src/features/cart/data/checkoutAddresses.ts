/**
 * Interim saved addresses for the checkout address selector.
 *
 * F9 (Profile & Addresses) owns the real Address entity + `/addresses` endpoints,
 * which are still DRAFT. Until F9 lands, checkout reads from this small static
 * list so the flow is testable end-to-end. When F9 ships, replace this with the
 * `useFetchAddresses` hook — `CheckoutAddress.id` maps to the real `Address.id`.
 */
interface CheckoutAddress {
  id: string;
  label: string;
  line: string;
}

const checkoutAddresses: CheckoutAddress[] = [
  {
    id: 'a1e7c9d2-4b6f-4a1e-9c3d-7f2b8e5a1c40',
    label: 'Home',
    line: '12 Jubilee Hills, Road No. 4, Hyderabad 500033',
  },
  {
    id: 'b2f8d0e3-5c7a-4b2f-8d4e-9a3c7f6b2d51',
    label: 'Office',
    line: 'Tower B, Cyber Gateway, HITEC City, Hyderabad 500081',
  },
];

export { checkoutAddresses };
export type { CheckoutAddress };
