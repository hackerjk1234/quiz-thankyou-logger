export default async function handler(req, res) {
  if (req.method === "POST") {
    const payload = req.body;
    const webhookURL = "https://discord.com/api/webhooks/1371388865969131530/J0bKmBpm7JNXypCbwmTWWAGh35BFga6yAJ9xUEMBF_uTRizYHxtuJ6IeWBdj_P_gqdAG";

    // Log the payload to check its structure
    console.log("Payload received:", payload);

    // Validate that the fields are correctly structured
    const fields = payload.embeds[0].fields.map(field => {
      if (!field.name || !field.value) {
        console.log("Invalid field detected:", field);
        return null; // Return null if any field is invalid
      }
      return {
        name: field.name,
        value: field.value,
        inline: field.inline !== undefined ? field.inline : false, // Set inline to false by default
      };
    }).filter(field => field !== null); // Remove any invalid fields

    if (fields.length === 0) {
      // If all fields are invalid, return an error
      return res.status(400).json({ error: "Invalid fields in embed." });
    }

    // Structure the final payload with validated fields
    const embedPayload = {
      username: "Quiz Logger",
      embeds: [
        {
          title: "📥 Quiz Submission Logged",
          color: 7506394,
          fields: fields,
          footer: {
            text: "Logger by RedTeamOps",
          },
          timestamp: new Date().toISOString(),
        }
      ]
    };

    try {
      const response = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embedPayload),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Discord API responded with error:", errorMessage);
        throw new Error(`Discord webhook failed: ${errorMessage}`);
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("Webhook POST failed:", err);
      res.status(500).json({ error: err.toString() });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
