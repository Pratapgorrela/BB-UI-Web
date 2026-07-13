import { MapPin } from 'lucide-react';

/** Minimal display shape — the page maps its real Address records to this. */
interface AddressOption {
  id: string;
  label: string;
  line: string;
}

interface AddressSelectProps {
  addresses: AddressOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** Radio-select over the user's saved addresses (F9 real data via useFetchAddresses). */
function AddressSelect({ addresses, selectedId, onSelect }: AddressSelectProps) {
  return (
    <section aria-labelledby="address-heading" className="flex flex-col gap-3">
      <h2 id="address-heading" className="font-heading text-body font-semibold text-neutral-900">
        Service address
      </h2>

      <ul role="radiogroup" aria-labelledby="address-heading" className="flex flex-col gap-2">
        {addresses.map((address) => {
          const checked = address.id === selectedId;
          return (
            <li key={address.id}>
              <button
                type="button"
                role="radio"
                aria-checked={checked}
                onClick={() => onSelect(address.id)}
                className={[
                  'flex w-full items-start gap-3 rounded-lg border px-3 py-3 text-left transition-colors duration-fast ease-fast focus-visible:shadow-focus focus-visible:outline-none',
                  checked ? 'border-primary-500 bg-primary-100/40' : 'border-neutral-200',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                    checked ? 'border-primary-500' : 'border-neutral-300',
                  ].join(' ')}
                >
                  {checked && <span className="size-2.5 rounded-full bg-primary-500" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-heading text-body-sm font-semibold text-neutral-900">
                    <MapPin size={14} className="text-primary-500" aria-hidden="true" />
                    {address.label}
                  </span>
                  <span className="mt-0.5 block text-caption text-neutral-500">{address.line}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { AddressSelect };
export type { AddressOption, AddressSelectProps };
