const gateway = process.env.API_URL
export default {
    status: gateway + '/order/get/orderInfo',           //订单状态
    scanOrderInfo: gateway + '/order/scan/orderInfo',
}