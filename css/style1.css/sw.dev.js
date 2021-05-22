"use strict";

self.addEventListener("install", function (event) {
  function onInstall() {
    return caches.open("static").then(function (cache) {
      return cache.addAll(["/images/table.png", "/js/main.js", "/css/main.css", "/"]);
    });
  } // console.log("installing");


  event.waitUntil(onInstall(event));
});
self.addEventListener("activate", function (event) {
  console.log("Активирован");
});
self.addEventListener("fetch", function (event) {
  console.log("Происходит запрос на сервер");
});