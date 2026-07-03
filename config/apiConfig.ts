//https://ezpark-9gnn.onrender.com/api
// Cấu hình API chung cho toàn bộ ứng dụng
import { API_KEY } from '@env';
export const API_CONFIG = {
  BASE_URL: 'https://ezpark-zzzm.onrender.com/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  endpoints: {
    // Auth endpoints
    REFRESH_TOKEN: '/auth/refresh-token',

    // Parking endpoints
    NO_PARKING_ROUTES: '/no-parking-routes',
    PARKING_SPOTS_GET_ALL: '/parking-spots/get-all',
    PARKING_SPOTS_GET_INFO: '/parking-spots/get-info-by-id',
    PARKING_SPOTS_SEARCH: '/parking-spots/search',

    // Device endpoints
    DEVICES_REGISTER: '/devices/register',
  },
};
