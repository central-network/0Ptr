addEventListener("message", async function(e) {
  var Display, Viewport;
  console.warn(self.buffer = e.data);
  return ({Display, Viewport} = (await import("./0Ptr_gl2.js")));
});
