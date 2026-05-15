self.addEventListener('push', function (event) {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'NamThu Education', body: event.data.text() };
  }

  const title = data.title || 'NamThu Education';
  const options = {
    body: data.body || '',
    icon: data.icon || '/favicon.png',
    badge: data.badge || '/favicon.png',
    data: data.data || {},
    vibrate: [200, 100, 200],
    requireInteraction: false,
    tag: data.tag || 'namthu-notification',
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options).catch(function (err) {
        console.warn('[SW] showNotification failed:', err);
      }),
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
        clientList.forEach(function (client) {
          client.postMessage({ type: 'NEW_NOTIFICATION' });
        });
      }),
    ])
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const url = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
