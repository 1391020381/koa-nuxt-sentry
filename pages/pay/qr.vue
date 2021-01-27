<template>
  <div class="payment">
    <div class="pay-price">
      ¥ <span class="price">{{ payPrice }}</span>
    </div>
    <ul class="order-list">
      <li class="list-item">
        <p class="item-title">
          商品名称:
        </p>
        <span class="item-desc goodsName">{{ goodsName }}</span>
      </li>
    </ul>
    <div class="pay-confirm" @click="confirmPayment">
      继续支付
    </div>
  </div>
</template>

<script>
import orderApi from "../../api/order"; 
export default {
 async asyncData({req,query,$axios,$sentry,error,redirect}){
     try{
         let source = req&&req.headers['user-agent'];
        let isWeChat = source.indexOf("MicroMessenger") != -1;
        var isAliPay = source.indexOf("AlipayClient") !== -1;
        if(!isWeChat&&!isAliPay){
          error({ statusCode: 500,message:"请使用微信或支付宝支付" });
        }
         const { code,data,message } = await $axios.$post(process.env.API_URL + orderApi.scanOrderInfo,{
           orderNo: query.orderNo,
           code: query.code,
           payType: isWeChat == true ? 'wechat' : 'alipay',
           host: process.env.host
         });
     
      console.log('scanOrderInfo:',code,data,message);
         if(code == 0){
            if(data.needRedirect){
              console.log('重定向');
              redirect(data.returnUrl);
            }
            return {
              isWeChat:isWeChat,
              appId:data.appId, 
              timeStamp:data.timeStamp, 
              nonceStr:data.nonceStr, 
              prepayId:data.prepayId, 
              paySign:data.paySign,
              aliPayUrl:data.aliPayUrl
            };
         }else{ // 上报
           $sentry.captureException(new Error({code,message}));
           error({ statusCode: 500, code,message });
         }
     }catch(err){
      $sentry.captureException(error);
      error({ statusCode: 500, code:err.code,message:err.message });
     }
  },
  data() {
    return {
      payPrice: '',
      goodsName: "",
      aliPayUrl:''
    };
  },
  head() {
    console.log('isWechat:',this.isWeChat);
    if(this.isWeChat){
       return {
          title: "订单详情",
          script: [
           {
          src: process.env.static_url + '/ishare-payment/baidu-statistics/index.js'
         }
    ]
       };
    }else{
        return {
         title: "订单详情",
         script: [
           {
          src: '//gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.inc.min.js'
         },
          {
          src: process.env.static_url + '/ishare-payment/baidu-statistics/index.js'
         }
    ]
    };
    }
  },
  computed:{
    orderNo:function(){
      return this.$route.query.orderNo;
    },
    platformCode:function(){
      return this.$route.query.platformCode;
    },
     host:function(){
      return this.$route.query.host;
    },
    isAutoRenew:function(){
      return this.$route.query.isAutoRenew;
    }
  },
  mounted(){
     this.getOrderInfo();    
     this.confirmPayment();
  },
  methods:{
    async getOrderInfo(){
     console.log('getOrderInfo:',process.env.browserBaseURL);
      try{
           const {code,data,message} = await this.$axios.$post(process.env.browserBaseURL + orderApi.status,{orderNo: this.orderNo});
           if(code==0){
             this.payPrice = data.payPrice/100;
             this.goodsName = data.goodsName;
           }else{
             console.log(code,data,message);
             this.$toast.error(message);
           }
      }catch(err){  
         this.$toast.error(err.message);
      }
      
    },
    confirmPayment(){
        console.log('confirmPayment',{appId:this.appId,timeStamp:this.timeStamp,nonceStr:this.nonceStr,prepayId:this.prepayId,paySign:this.paySign});
        if(this.isWeChat){
            this.wechatPay({appId:this.appId,timeStamp:this.timeStamp,nonceStr:this.nonceStr,prepayId:this.prepayId,paySign:this.paySign});
        }else{
          this.aliPay();
        }
    },
   wechatPay({appId, timeStamp, nonceStr, prepayId, paySign}){
     console.log('wechatPay:', appId, timeStamp, nonceStr, prepayId, paySign);
     let that = this;
       function onBridgeReady() {
           try{
              WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                "appId": appId,     //公众号名称，由商户传入     
                "timeStamp": timeStamp,         //时间戳，自1970年以来的秒数     
                "nonceStr": nonceStr, //随机串     
                "package": "prepay_id=" + prepayId,
                "signType": "MD5",         //微信签名方式：     
                "paySign": paySign //微信签名 
            },
                function (res) {
                    console.log('wechatPay:', res);
                    if (res.err_msg == "get_brand_wcpay_request:ok") { // 支付成功
                     console.log('get_brand_wcpay_request:ok');
                      that.getOrderStatus();
                    } else if (res.err_msg == "get_brand_wcpay_request:fail") { // 支付失败
                        console.log('get_brand_wcpay_request:fail', res);
                      //  this.$toast.error('支付失败')
                      that.getOrderStatus();
                    }
                });
           }catch(err){
              console.log('onBridgeReady',JSON.stringify(err));
              that.$sentry.captureException(JSON.stringify({tag:'onBridgeReady',err}));
           }
        }
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
   },
   aliPay() { 
     if(this.isAutoRenew == '1'){ // 续费
         this.alipayRenewalPayment(this.aliPayUrl);
     }else{
       const div = document.createElement('div');
                 div.innerHTML = this.aliPayUrl;
                 document.body.appendChild(div);
                 document.forms [0].submit();
     }
      
    },
    alipayRenewalPayment(orderStr){
        console.log('ap:',ap);
        let that = this;
        ap.tradePay({
            orderStr: orderStr
          }, function(res){
            console.log('alipay:',res);
            if(res.resultCode == '9000'){
              that.getOrderStatus();
            }
          });
    },
    getOrderStatus() {
      console.log('getOrderStatus:',window.history,this.$router);
        if (this.platformCode == 'm') { //m端跳转公共的支付空白页 然后跳相关的页面(m端付费文档微信浏览器)
            let redirectUrl = this.host + "/node/payInfo?orderNo=" + this.orderNo + "&mark=wx";
            window.location.replace(redirectUrl);
        } else { //直接跳结果 urlConfig
           let url = '/pay/paymentresult?orderNo=' + this.orderNo;
            window.location.replace(url);
        }

    }
  }
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
