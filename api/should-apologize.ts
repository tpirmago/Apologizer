import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { situation } = req.body as { situation: string }
  if (!situation) {
    return res.status(400).json({ error: 'Missing required field: situation' })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You decide whether someone should apologize for a situation.

CRITICAL: Read the situation EXACTLY as written. Pay close attention to negations like "don't", "didn't", "not", "never" — they completely change the meaning.
Examples:
- "I forgot the cake" → they messed up → should apologize
- "I didn't forget the cake" → they did fine → probably no apology needed
- "I didn't call her back" → they ignored someone → should apologize

Respond ONLY with raw JSON (no markdown, no code fences):
{ "should": true or false, "reason": "your verdict" }

For the "reason" field:
- Be brief (1–2 sentences max)
- Sound like a witty but honest friend, not a therapist
- Vary your phrasing every time — never use the same opener twice
- If YES: briefly explain why they messed up, with a touch of dry humor (e.g. "Yeah, that one's on you.", "You kind of dropped the ball here.", "Yep, no getting around it.", "Oh absolutely. No debate.")
- If NO: explain why they don't owe anyone an apology (e.g. "Honestly? Not your fault.", "You're fine — you did nothing wrong.", "Nah, you're good.", "Bold of them to expect an apology for that.")`
        },
        { role: 'user', content: `Situation: ${situation}` }
      ],
      max_tokens: 100,
      temperature: 0.9
    })

    const raw = completion.choices[0]?.message?.content?.trim()
    if (!raw) return res.status(500).json({ error: 'No response from AI model' })

    try {
      const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
      return res.json(JSON.parse(cleaned))
    } catch {
      return res.json({ should: /true/i.test(raw), reason: raw.slice(0, 150) })
    }
  } catch (err) {
    console.error('Error evaluating situation:', err)
    return res.status(500).json({ error: 'Failed to evaluate situation' })
  }
}
