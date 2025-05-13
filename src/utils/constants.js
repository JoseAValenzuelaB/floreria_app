// export const API_URL = 'http://142.93.113.77:8000';
export const API_URL = 'http://127.0.0.1:8000';
// export const API_URL = 'http://143.198.100.227';
// export const WS_URL = "ws://143.198.100.227/ws";
export const WS_URL = "ws://127.0.0.1:8000/ws";
export const PAYMENT_TYPE_DICT = {
    "CASH": "Efectivo",
    "CARD": "Tarjeta",
    "TRANSFER": "Transferencia",
    "OPENING_CASH": "Fonda de Caja",
    "OTHER": "Otro"
}

export const ORDER_STATUS = {
    "SUBMITTED": "Enviada",
    "PAID": "Pagado",
    "IN_DEBT": "Crédito",
    "PARTIALLY_PAID": "Abonado",
    "CANCELLED": "Cancelado"

}

export const DELIVERY_TYPE_DICT = {
    "HOME_DELIVERY": "Entrega a Domicilio",
    "STORE_PICKUP": "Recoger en Sucursal",
    "DIRECT_DELIVERY": "Entrega Directa",
}

export const PAYMENT_TYPE_VALUES = [
    "CASH",
    "CARD",
    "TRANSFER",
    "OTHER"
];