let { Server: S, createWebSocketStream: F } = require("ws")

new S({port:9090}).on("connection", (s, {url: u}) => this[u] = F(s) )
new S({port:9091}).on("connection", (s, {url: u}) => this[u] ?.pipe(F(s)).pipe(this[u]) )
