<template>
  <div class="payment">
        <div class="pay-price">
              ¥ <span class="price">{{ payPrice}}</span>
        </div>
        <ul class="order-list">
           <li class="list-item">
             <p class="item-title">商品名称:</p>
             <span class="item-desc goodsName">{{ goodsName}}</span>
            </li>
        </ul>
       <div class="pay-confirm">继续支付</div>
       
  </div>
</template>

<script>
import orderApi from "../../api/order" 
export default { // this.$toast.error('服务器开小差啦~~')
 async asyncData({ params,query,$axios}){
     
      let code = query.code
      let orderNo = query.orderNo
      let platformCode = query.platformCode
      let host = query.host
       console.log('asyncData:',query.orderNo)
      let result = await $axios.$post(orderApi.status,{
         orderNo: orderNo
      })
      console.log('result:',JSON.stringify(result))
      return {payPrice:result.data.payPrice,goodsName:result.data.goodsName}
  },
  data() {
    return {
      payPrice: 0.01,
      goodsName: "合同",
    };
  },
  head() {
    return {
      title: "订单详情",
    };
  },
};
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
