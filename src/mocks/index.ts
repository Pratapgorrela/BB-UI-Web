import type { AxiosInstance } from 'axios';
import { mockAdapter } from './lib/mockEngine';

// Handler modules register their routes as an import side effect.
import './handlers/auth.mock';
import './handlers/catalog.mock';

function installMocks(client: AxiosInstance): void {
  client.defaults.adapter = mockAdapter;
  console.log('[MockAPI] Mock adapter installed — all requests are served in-memory');
}

export { installMocks };
