import { beforeAll, vi, afterEach } from 'vitest';
import { mockElectronAPIs } from './electron';

beforeAll(() => {
  mockElectronAPIs();
});

afterEach(() => {
  vi.clearAllMocks();
});
