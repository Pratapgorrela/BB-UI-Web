import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { Button, DataState, Modal } from '../components/ui';
import { PageHeader } from '../components/layout';
import {
  AddressFormSheet,
  AddressList,
  useCreateAddress,
  useDeleteAddress,
  useFetchAddresses,
  useUpdateAddress,
} from '../features/profile';
import { addressToLine } from '../features/profile';
import type { Address, CreateAddressRequest } from '../features/profile';

export function Component() {
  const addresses = useFetchAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (address: Address) => {
    setEditing(address);
    setFormOpen(true);
  };

  const handleSubmit = (payload: CreateAddressRequest) => {
    const onDone = { onSuccess: () => setFormOpen(false) };
    if (editing) updateAddress.mutate({ id: editing.id, ...payload }, onDone);
    else createAddress.mutate(payload, onDone);
  };

  const busyId = updateAddress.isPending
    ? updateAddress.variables?.id
    : deleteAddress.isPending
      ? deleteAddress.variables
      : null;

  return (
    <div className="pb-10">
      <PageHeader
        title="Saved addresses"
        backTo="/profile"
        actions={
          <Button
            size="sm"
            leftIcon={<Plus size={16} aria-hidden="true" />}
            onClick={openAdd}
          >
            Add
          </Button>
        }
      />

      <div className="max-w-xl">
        <DataState
          data={addresses.data}
          isLoading={addresses.isLoading}
          error={addresses.error}
          onRetry={() => void addresses.refetch()}
          isEmpty={(list) => list.length === 0}
          emptyIcon={<MapPin size={48} className="text-neutral-300" aria-hidden="true" />}
          emptyMessage="No saved addresses yet"
          emptyCta={{ label: 'Add an address', onClick: openAdd }}
        >
          {(list) => (
            <AddressList
              addresses={list}
              busyId={busyId}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onSetDefault={(address) =>
                updateAddress.mutate({ id: address.id, isDefault: true })
              }
            />
          )}
        </DataState>
      </div>

      <AddressFormSheet
        open={formOpen}
        onClose={() => setFormOpen(false)}
        address={editing}
        isPending={createAddress.isPending || updateAddress.isPending}
        onSubmit={handleSubmit}
      />

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete address?"
      >
        <div className="flex flex-col gap-4">
          <p className="text-body-sm text-neutral-600">
            {deleteTarget && (
              <>
                <span className="font-semibold text-neutral-900">{deleteTarget.label}</span> —{' '}
                {addressToLine(deleteTarget)} will be removed.
              </>
            )}
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteAddress.isPending}
            >
              Keep address
            </Button>
            <Button
              type="button"
              variant="danger"
              loading={deleteAddress.isPending}
              onClick={() =>
                deleteTarget &&
                deleteAddress.mutate(deleteTarget.id, { onSettled: () => setDeleteTarget(null) })
              }
            >
              Delete address
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
