const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  console.log("proxy");
  const filter = function (pathname, req) {
    return pathname.match("^/panorama_backend") || pathname.match("^/wsi_data");
  };
  const panorama_backend_proxy = createProxyMiddleware(filter, {
    target: "https://pramana.nferx.com/",
    changeOrigin: true,
    secure: true,
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      // add custom header to request
      proxyReq.setHeader(
        "Cookie",
        `orgtype=internal; csrftoken=GeniWWBg5yQWlBjiz896XPoew6bYtgyr3c1UP9refaiWNHNxudp5HRrm2J4KhHi3; sessionid=4zn2jasede96u8o9sxfvib03vvh0bj97; email=guest%40gmail.com; username=Guest; id=6; role=GUEST; orgId=nferX; defaultRoute=%2Fhts%2Fslides; imageIds=62d12184dcf9f32e7a098a09__grid_1-62d11e20dcf9f32e7a098a07; sails.sid=s%3A0ScoVtHjgFYn0_SinSapbjipsndm6-io.N4eHoPN4nSmYSNz0HcigiYOJAJxSlOuWz%2B7npdV3R0U`
      );
      //console.log(proxyReq)
    },
    logLevel: "debug",
  });

  if (window.location.host.includes('hz-preview-pramana')) {
    console.log('using the proxy')
    app.use(panorama_backend_proxy);
  }

  console.log('not using the proxy')

};
