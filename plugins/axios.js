export default function ({ $axios}) {
    $axios.onRequest(config => {
        console.log('onRequest:',config.url);
      });
      $axios.onResponse(response => {
       // console.log('onResponse:',response.data);
        if(response.data.code!=0){
            return Promise.reject(response);
        }else{
            return Promise.resolve(response);
        }
      });
  }