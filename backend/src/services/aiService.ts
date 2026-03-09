import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

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
    prompt += `

Previous version:
"${previousApology}"

Rewrite instruction: ${instructions[rewriteInstruction] ?? rewriteInstruction}`
  }

  return prompt
}

export async function generateApologyText(
  situation: string,
  category: string,
  severity: number,
  tone: string,
  rewriteInstruction?: string,
  previousApology?: string
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: buildSystemPrompt(tone) },
      { role: 'user',   content: buildApologyPrompt(situation, category, severity, tone, rewriteInstruction, previousApology) }
    ],
    max_tokens: 120
  })

  const text = completion.choices[0]?.message?.content?.trim()
  if (!text) throw new Error('No response from AI model')
  return text
}

export async function evaluateShouldApologize(
  situation: string
): Promise<{ should: boolean; reason: string }> {
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
      {
        role: 'user',
        content: `Situation: ${situation}`
      }
    ],
    max_tokens: 100,
    temperature: 0.9
  })

  const raw = completion.choices[0]?.message?.content?.trim()
  if (!raw) throw new Error('No response from AI model')

  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim()
    return JSON.parse(cleaned) as { should: boolean; reason: string }
  } catch {
    return { should: /true/i.test(raw), reason: raw.slice(0, 150) }
  }
}
