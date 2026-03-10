import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function buildSystemPrompt(tone: string): string {
  const toneGuidance: Record<string, string> = {
    'sincere':     'Be genuinely heartfelt and honest. No deflection.',
    'formal':      'Use professional, measured language. Respectful and clear.',
    'casual':      'Write like a natural, relaxed text message between friends.',
    'light-funny': 'Add gentle, self-deprecating humor. Still acknowledge the issue.'
  }
  return `You write apology messages for people.
Rules:
- Maximum 3 sentences, under 50 words total
- Write like a real text message, not a formal letter
- NEVER start with "I'm sorry if you felt" or "I'm sorry but"
- NEVER use hollow phrases like "I apologize for any inconvenience"
- Be direct and own the mistake without over-explaining
- Tone: ${toneGuidance[tone] ?? 'Be honest and genuine.'}`
}

function buildApologyPrompt(
  situation: string,
  category: string,
  severity: number,
  tone: string,
  rewriteInstruction?: string,
  previousApology?: string
): string {
  const severityLabels: Record<number, string> = {
    1: 'minor (tiny oops)',
    2: 'small (a bit awkward)',
    3: 'moderate (I messed up)',
    4: 'serious (pretty bad)',
    5: 'severe (nuclear disaster)'
  }
  let prompt = `Write an apology for this situation:
Situation: ${situation}
Context: ${category} relationship
Severity: ${severityLabels[severity] ?? 'moderate'}
Tone: ${tone}`

  if (rewriteInstruction && previousApology) {
    const instructions: Record<string, string> = {
      'more-sincere':  'Make it more heartfelt and genuine',
      'shorter':       'Make it significantly shorter while keeping the core message',
      'more-formal':   'Make it more professional and formal',
      'less-awkward':  'Make it flow more naturally, remove any stiff or weird phrasing',
      'funnier':       'Add light, self-deprecating humor while still apologizing'
    }
    prompt += `\n\nPrevious version:\n"${previousApology}"\n\nRewrite instruction: ${instructions[rewriteInstruction] ?? rewriteInstruction}`
  }
  return prompt
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { situation, category, severity, tone, rewriteInstruction, previousApology } =
    req.body as {
      situation: string
      category: string
      severity: number
      tone: string
      rewriteInstruction?: string
      previousApology?: string
    }

  if (!situation || !category || !severity || !tone) {
    return res.status(400).json({ error: 'Missing required fields: situation, category, severity, tone' })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: buildSystemPrompt(tone) },
        { role: 'user',   content: buildApologyPrompt(situation, category, severity, tone, rewriteInstruction, previousApology) }
      ],
      max_tokens: 120
    })

    const text = completion.choices[0]?.message?.content?.trim()
    if (!text) return res.status(500).json({ error: 'No response from AI model' })

    return res.json({ apology: text })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Error generating apology:', message)
    return res.status(500).json({ error: message })
  }
}
