export default async function handler(req, res) {
  if (req.method === "POST") {
    const payload = req.body;
    const webhookURL = "https://discord.com/api/webhooks/1371388865969131530/J0bKmBpm7JNXypCbwmTWWAGh35BFga6yAJ9xUEMBF_uTRizYHxtuJ6IeWBdj_P_gqdAG";

    try {
      const response = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
