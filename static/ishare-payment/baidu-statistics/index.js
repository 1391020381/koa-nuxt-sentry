var _hmt = _hmt || [];//此变量百度统计需要

function handle(id) {
    if (id){
        try {
            (function () {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?" + id;
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
            })();
        } catch (e) {
            console.error(id,e);
        }
    }
}
// 支付中间页
if(location.pathname == "/pay/qr"){
    handle('17cdd3f409f282dc0eeb3785fcf78a66');
}

// 支付结果页
if(location.pathname == "/pay/paymentresult"){
    handle('17cdd3f409f282dc0eeb3785fcf78a66');
}


