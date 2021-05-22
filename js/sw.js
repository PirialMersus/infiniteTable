self.addEventListener("install", (event) => {
  function onInstall() {
    return caches
      .open("static")
      .then((cache) =>
        cache.addAll(["/images/table.png", "/js/main.js", "/css/main.css", "/"])
      );
  }
  // console.log("installing");

  event.waitUntil(onInstall(event));
});

self.addEventListener("activate", (event) => {
  console.log("Активирован");
});

self.addEventListener("fetch", (event) => {
  console.log("Происходит запрос на сервер");
});
