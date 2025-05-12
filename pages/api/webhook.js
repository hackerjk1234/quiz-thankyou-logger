export default async function handler(req, res) {
  if (req.method === "POST") {
    const payload = req.body;
    const webhookURL = "https://discord.com/api/webhooks/1371388865969131530/J0bKmBpm7JNXypCbwmTWWAGh35BFga6yAJ9xUEMBF_uTRizYHxtuJ6IeWBdj_P_gqdAG";

    try {
      // Log the incoming payload for debugging
      console.log("Payload received:", payload);

      // Send the payload to the Discord webhook
      const response = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Check if the response is not OK and throw an error
      if (!response.ok) {
        const errorMessage = await response.text(); // Get the error message from Discord API
        console.error("Discord API responded with error:", errorMessage);
        throw new Error(`Discord webhook failed: ${errorMessage}`);
      }

      // Respond with success if webhook posting is successful
      res.status(200).json({ success: true });
    } catch (err) {
      // Log the error to the server for debugging
      console.error("Webhook POST failed:", err);

      // Respond with an error message in case of failure
      res.status(500).json({ error: err.toString() });
    }
  } else {
    // If the HTTP method is not POST, respond with a 405 (Method Not Allowed)
    res.status(405).end(); // Method Not Allowed
  }
}
