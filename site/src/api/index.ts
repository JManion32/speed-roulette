import * as realApi from './api';
import * as mockApi from './mock-api';

const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';

export default MOCK_MODE ? mockApi : realApi;
