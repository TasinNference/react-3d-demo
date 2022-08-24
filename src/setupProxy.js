const { createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app) {
  console.log("proxy")
    const filter = function (pathname, req) {
        return pathname.match('^/panorama_backend') || pathname.match('^/wsi_data') ;
    };
  const panorama_backend_proxy = createProxyMiddleware(filter,{
    target: 'https://pramana.nferx.com/',
    changeOrigin: true,
    secure:true,
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      // add custom header to request
        proxyReq.setHeader('Cookie', `sessionid=hpm5xz8mnwlj9bzndkhoflp8ntiak5e1; csrftoken=aZ2ZHRCEFPMSVAfSsiJqA6btSO3adCZh3InPTNWdgvWFk2jmgIlItP3DoAGTm2UJ; email=tahmed%40nference.net; username=Tasin; id=66; role=GUEST; orgId=nferX; defaultRoute=%2Fhts%2Fslides; imageIds=62d12184dcf9f32e7a098a09__grid_1-62d11e20dcf9f32e7a098a07; orgtype=internal; sails.sid=s%3AW4_urGRIjgsCSb-ekDTRVpW6PZI1SKpa.%2F8fJpkv0FEY9O1ibUSdHFWtBfZHelHlr58iyXjatBdQ`)
        //console.log(proxyReq)
    },
    logLevel: 'debug',
  })


    
  app.use(panorama_backend_proxy);
};