export default function ({ $axios,$winstonLog}) {
    $axios.defaults.baseURL = process.server?process.env.API_URL:'/openapi';
    $axios.onRequest(config => {
       // console.log('onRequest:',config);
        if ($winstonLog) {
            $winstonLog.info({
                url:config.url,
                method:config.method,
                params:config.params,
                data:config.data
            });
          }
      });
      $axios.onResponse(response => {
      // console.log('onResponse:',response);
        if(response.data.code!=0){
            if ($winstonLog) {
                $winstonLog.error(
                {   
                    config:response.config,
                    data:response.data,
                    status:response.status,
                    statusText:response.statusText
                });
              }
            return Promise.reject(response);
        }else{
            if ($winstonLog) {
                $winstonLog.info({
                    config:response.config,
                    data:response.data,
                    status:response.status,
                    statusText:response.statusText
                });
              }
            return Promise.resolve(response);
        }
      });
  }