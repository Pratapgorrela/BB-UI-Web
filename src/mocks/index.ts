import type { AxiosInstance } from 'axios';
import { mockAdapter } from './lib/mockEngine';

// Handler modules register their routes as an import side effect.
import './handlers/auth.mock';
import './handlers/booking.mock';
import './handlers/cart.mock';
import './handlers/catalog.mock';
import './handlers/notifications.mock';
import './handlers/profile.mock';
import './handlers/promotions.mock';
import './handlers/support.mock';
import './handlers/tracking.mock';

function installMocks(client: AxiosInstance): void {
  client.defaults.adapter = mockAdapter;
  console.log('[MockAPI] Mock adapter installed — all requests are served in-memory');
}

export { installMocks };
