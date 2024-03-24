//? use autoimport with top of your extends:
//* Pointer.importMetaUrl( `import.meta.url` )
//! Becomes ready when SharedArrayBuffer arrives
console.assert(typeof Pointer !== "undefined" && Pointer !== null, "pointer is not imported");

addEventListener('ready', function() {
  console.log("from worker:", new Pointer(36));
  return console.log("from worker:", new Pointer(0));
});
