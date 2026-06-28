import { useToast } from '../../components/ui';
import { Button } from '../../components/ui';

export function ToastDemo() {
  const { addToast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button size="sm" variant="secondary" onClick={() => addToast('Booking confirmed!', 'success')}>
        Success toast
      </Button>
      <Button size="sm" variant="secondary" onClick={() => addToast('Failed to cancel booking', 'error')}>
        Error toast
      </Button>
      <Button size="sm" variant="secondary" onClick={() => addToast('Your Beauty Bus arrives in 10 min', 'info')}>
        Info toast
      </Button>
      <Button size="sm" variant="secondary" onClick={() => addToast('Slot almost full — book now!', 'warning')}>
        Warning toast
      </Button>
    </div>
  );
}
