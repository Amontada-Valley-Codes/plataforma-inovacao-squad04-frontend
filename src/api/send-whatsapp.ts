import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, message } = req.body;
  if (!to || !message) return res.status(400).json({ error: "to and message required" });

  const PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID;
  const ACCESS_TOKEN = process.env.WA_ACCESS_TOKEN;

  try {
    const resp = await fetch(`https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message },
      }),
    });

    const body = await resp.json();
    if (!resp.ok) return res.status(resp.status).json(body);
    return res.status(200).json(body);
  } catch (err) {
    console.error("WA send error:", err);
    return res.status(500).json({ error: "internal" });
  }
}
