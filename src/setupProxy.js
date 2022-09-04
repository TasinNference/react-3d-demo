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
        `orgtype=internal; csrftoken=GeniWWBg5yQWlBjiz896XPoew6bYtgyr3c1UP9refaiWNHNxudp5HRrm2J4KhHi3; sessionid=4zn2jasede96u8o9sxfvib03vvh0bj97; email=guest%40gmail.com; username=Guest; id=6; role=GUEST; orgId=nferX; defaultRoute=%2Fhts%2Fslides; imageIds=62d015052d97a02bcc0cd5bd-62d019292d97a02bcc0cd5ec-62d017932d97a02bcc0cd5d0; sails.sid=s%3AqBCFc826Ut_Vrju798uIipY9e4CydZiD.mIvqdlvcRzOkepIWHzZ6XxzcEBLhG4nBSGEAL%2B6rFJQ`
      );
      //console.log(proxyReq)
    },
    logLevel: "debug",
  });

  app.use(panorama_backend_proxy);
};
