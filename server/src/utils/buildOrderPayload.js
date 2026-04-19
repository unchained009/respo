import { serializeOrder } from './serializers.js';

export const buildOrderSocketPayload = (order) => serializeOrder(order);
