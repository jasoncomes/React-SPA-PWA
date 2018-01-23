// Firebase Scripts
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// Firebase Initialize
firebase.initializeApp({
  'messagingSenderId': '1049796406298'
});

// Service Worker - Web Cache API
const CACHE_NAME = 'v1'

// Cache on Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      fetch('asset-manifest.json').then(response => {
        if (response.ok) {
          response.json().then(manifest => {
            let urls = Object.keys(manifest).map(key => manifest[key])
            urls.push('/')
            urls.push('/assets/icon.png')
            cache.addAll(urls)
          })
        }
      })
    })
  )
})

// Fetch Cache or Server Repsonse on URL Request
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})

// Cache Cleanup of old versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    })
  )
})