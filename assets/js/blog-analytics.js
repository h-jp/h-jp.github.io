(() => {
  const config = document.currentScript?.dataset;
  // Previews must never contribute visits to the production dashboard.
  if (!config || location.protocol !== 'https:' || location.hostname !== config.cfHostname) return;
  if (!/^[a-f0-9]{32}$/i.test(config.cfToken || '')) return;
  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.defer = true;
  beacon.setAttribute('data-cf-beacon', JSON.stringify({token: config.cfToken}));
  document.body.append(beacon);
})();
