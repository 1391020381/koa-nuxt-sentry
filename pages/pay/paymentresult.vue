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
import orderApi from "../../api/order" 
export default {
  data() {
    return {
        orderInfo:{
            orderStatus:'',
            payType:'',
            payPrice:'',
            orderTime:'',
            payNo:'',
            goodsName:''
        },
    eventNameList :{
      payFileResult:{
        loginstatus:0,
        userid:'',
        pageid:'PC-M-FD',
        pagename:'',
        payresult:'',
        orderid:'',
        orderpaytype:'',
        orderpayprice:'',
        fileid:'',
        filename:'',
        fileprice:'',
        filecategoryname:'',
        fileformat:'',
        filecootype:'',
        fileuploaderid:''
    },
    payVipResult:{
        loginstatus:0,
        userid:'',
        pageid:'PC-M-FD',
        pagename:'',
        payresult:'',
        orderid:'',
        orderpaytype:'',
        orderpayprice:'',
        fileid:'',
        filename:'',
        fileprice:'',
        filecategoryname:'',
        fileformat:'',
        filecootype:'',
        fileuploaderid:''
    }
  }
    };
  },
  head() {
    return {
      title: "订单结果页",
          script: [
           {
          src:  process.env.static_url + '/ishare-payment/baidu-statistics/index.js'
         }
    ]
    };
  },
  mounted(){
      this.getOrderInfo()
  },
  methods:{
     async getOrderInfo(){
      try{
           const {code,data,message} = await this.$axios.$post(process.env.browserBaseURL + orderApi.status,{orderNo: this.orderNo})
           console.log(code,data,message)
           if(code==0){
              
              this.orderInfo = Object.assign({},{
                   orderStatus:data.orderStatus,
                   payType:data.payType,
                   payPrice:data.payPrice / 100,
                   orderTime:data.orderTime?this.formatDate(new Date(data.orderTime)):'',
                  payNo:data.payNo,
                  goodsName:data.goodsName
              })
               if (data.goodsType == 1) {
                        this.handleBaiduStatisticsPush('payFileResult', { payresult: 1, orderid: this.orderNo, orderpaytype: data.payType })
                    }
                    if (data.goodsType == 2) {
                        this.handleBaiduStatisticsPush('payVipResult', { payresult: 1, orderid: this.orderNo, orderpaytype: data.payType })
                    }
           }else{
             console.log(code,data,message)
            this.$toast.error(message)
           }
      }catch(err){  
           console.log(err)
           this.$toast.error(err.message)
      }
      
    },
   formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
 
    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);//想要什么格式都可以随便自己拼
  },
  handleBaiduStatisticsPush(eventName,params){  // 需要添加 全局百度统计
   console.log(eventName,params)
    var temp = this.eventNameList[eventName]
  
    if(eventName == 'payFileResult'){
        params = Object.assign(temp, {payresult:params.payresult,orderid:params.orderNo,orderpaytype:params.orderpaytype});
    }

    if(eventName == 'payVipResult'){
        params =  Object.assign(temp, {payresult:params.payresult,orderid:params.orderNo,orderpaytype:params.orderpaytype});
    }
    _hmt.push(['_trackCustomEvent',eventName,params]);
    console.log('百度统计:',eventName,params)
  }
  },
  computed:{
    orderNo:function(){
      return this.$route.query.orderNo
    }
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
