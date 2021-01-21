<template>
<div  class="payment">
       <div class="payment-title">
            <template v-if="orderInfo.orderStatus == 2">
                 <span class="payment-title-icon success"></span>
                <span class="payment-title-desc">支付成功</span>
                <span class="payment-title-info">请在电脑网站完成后续操作</span>
            </template>
         <template v-if="orderInfo.orderStatus == 3">
             <span class="payment-title-icon error"></span>
             <span class="payment-title-desc">支付失败</span>
         </template>
     </div>
<ul class="order-list">
    <li class="list-item">
        <span class="item-title">支付方式:</span>
        <span class="item-desc" v-if="orderInfo.payType == 'wechat'">微信支付</span>
       <span class="item-desc" v-if="orderInfo.payType == 'alipay'">支付宝支付</span>
       
    </li>
    <li class="list-item">
        <span class="item-title">订单金额:</span>
        <span class="item-desc">¥ {{orderInfo.payPrice}}</span>
    </li>
    <li class="list-item orderTime">
        <span class="item-title">创建时间:</span>
        <span class="item-desc">{{orderInfo.orderTime}}</span>
    </li>
    <li class="list-item">
        <span class="item-title">商户单号:</span>
        <span class="item-desc">{{orderInfo.payNo}}</span>
    </li>
    <li class="list-item">
        <span class="item-title">商品名称:</span>
        <span class="item-desc">{{orderInfo.goodsName}}</span>
    </li>
</ul> 
<div class="payment-info">
    请截图保存订单详情，以便查询使用
</div>

    <div class="btn-wrap" v-if="orderInfo.orderStatus == 3">
        <div class="payment-btn">重新支付</div>
    </div>

</div>
</template>

<script>
// http://open-ishare.iask.com.cn/pay/qr?orderNo=B20210121112552M0C175&isAutoRenew=1
export default {
     data() {
    return {
        orderInfo:{
            orderStatus:2,
            payType:'wechat',
            payPrice:0.01,
            orderTime:'2020.10.10',
            payNo:'xxxxxxxxxxxxxxx',
            goodsName:'合同'
        }
    };
  },
  head() {
    return {
      title: "订单结果页",
    };
  }
}
</script>

<style lang="less" scoped>
@import "~/assets/css/less_mixin.less";
.payment {
  width: 100%;
  height: 100%;
  position: relative;

  .pay-price {
    padding-top: 1.78rem;
    text-align: center;
  }

  .payment-title {
    padding-top: 42px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .payment-title-icon {
      display: block;
      width: 0.8rem;
      height: 0.8rem;
    }

    .success {
      background: url("~assets/images/pay/pay-success.png") no-repeat center;
      background-size: 100%;
    }

    .error {
      background: url("~assets/images/pay/pay-fail.png") no-repeat center;
      background-size: 100%;
    }

    .payment-title-desc {
      flex: 1;
      margin-top: 0.28rem;
      font-size: 0.48rem;
      color: #222222;
      font-weight: bold;
    }

    .payment-title-info {
      flex: 1;
      margin-top: 0.24rem;
      height: 0.26rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: #666666;
    }
  }

  .btn-wrap {
    position: relative;
    text-align: center;

    .payment-btn {
      display: inline-block;
      width: 6.3rem;
      height: 0.9rem;
      background: #f25125;
      border-radius: 0.45rem;
      font-size: 0.32rem;
      font-weight: 500;
      color: #ffffff;
      line-height: 0.9rem;
      text-align: center;
      margin: 0 auto;
      cursor: pointer;
    }
  }

  .payment-info {
    height: 0.3rem;
    font-size: 0.3rem;
    font-weight: 400;
    color: #666666;
    line-height: 0.45rem;
    text-align: center;
  }

  .order-list {
    margin-top: 0.66rem;
    display: flex;
    flex-direction: column;
    font-size: 0.3rem;
    font-weight: 500;
    padding-left: 0.6rem;
    padding-right: 0.53rem;

    .list-item {
      margin-top: 0.46rem;
      display: flex;
      flex: 1;
      list-style: none;
      align-items: center;

      .item-title {
        display: block;
        width: 1.7rem;
      }

      .item-desc {
        flex: 1;
        text-align: right;
        color: #222222;
        font-weight: bold;
        .text-ellipsis();
      }
    }

    .orderTime {
      margin-top: 0.96rem;
    }
  }

  .pay-confirm {
    position: fixed;
    left: 50%;
    bottom: 2rem;
    transform: translate(-50%, 0);
    width: 6.3rem;
    height: 0.9rem;
    line-height: 0.9rem;
    text-align: center;
    background: rgba(242, 81, 37, 1);
    border-radius: 0.45rem;
    font-size: 0.32rem;
    color: #ffffff;
  }

}
</style>
