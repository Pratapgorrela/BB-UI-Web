import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { Badge, Card } from '../../../components/ui';
import { addressToLine } from '../utils/addressToLine';
import type { Address } from '../types/address';

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
  /** Id of an address with a mutation in flight — disables its row actions. */
  busyId?: string | null;
}

function AddressList({ addresses, onEdit, onDelete, onSetDefault, busyId }: AddressListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {addresses.map((address) => {
        const busy = busyId === address.id;
        return (
          <li key={address.id}>
            <Card variant="default" padding="md">
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600"
                >
                  <MapPin size={18} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-heading text-body font-semibold text-neutral-900">
                      {address.label}
                    </h3>
                    {address.isDefault && <Badge variant="primary">Default</Badge>}
                  </div>
                  <p className="mt-0.5 text-body-sm text-neutral-500">{addressToLine(address)}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={() => onSetDefault(address)}
                        disabled={busy}
                        className="text-body-sm font-semibold text-primary-600 transition-colors duration-fast hover:text-primary-700 focus-visible:shadow-focus focus-visible:outline-none disabled:opacity-50"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onEdit(address)}
                      disabled={busy}
                      className="inline-flex items-center gap-1 text-body-sm font-medium text-neutral-600 transition-colors duration-fast hover:text-neutral-900 focus-visible:shadow-focus focus-visible:outline-none disabled:opacity-50"
                    >
                      <Pencil size={14} aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(address)}
                      disabled={busy}
                      className="inline-flex items-center gap-1 text-body-sm font-medium text-danger-600 transition-colors duration-fast hover:text-danger-700 focus-visible:shadow-focus focus-visible:outline-none disabled:opacity-50"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

export { AddressList };
export type { AddressListProps };
