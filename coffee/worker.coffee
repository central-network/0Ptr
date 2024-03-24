#? use autoimport with top of your extends:
#* Pointer.importMetaUrl( `import.meta.url` )
#! Becomes ready when SharedArrayBuffer arrives

console.assert Pointer?, "pointer is not imported"

addEventListener 'ready', ->

    console.log "from worker:", new Pointer 36
    console.log "from worker:", new Pointer 0
