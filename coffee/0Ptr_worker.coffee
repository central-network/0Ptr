addEventListener "message", (e) ->
    console.warn self.buffer = e.data

    { Display, Viewport } = await `import("./0Ptr_gl2.js")`
