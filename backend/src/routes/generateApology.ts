import { Router, type Request, type Response } from 'express'
import { generateApologyText, evaluateShouldApologize } from '../services/aiService.js'

export const generateApologyRouter = Router()

// POST /generate-apology
generateApologyRouter.post('/generate-apology', async (req: Request, res: Response) => {
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
    res.status(400).json({ error: 'Missing required fields: situation, category, severity, tone' })
    return
  }

  try {
    const apology = await generateApologyText(
      situation, category, severity, tone, rewriteInstruction, previousApology
    )
    res.json({ apology })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Error generating apology:', message)
    res.status(500).json({ error: message })
  }
})

// POST /should-apologize
generateApologyRouter.post('/should-apologize', async (req: Request, res: Response) => {
  const { situation } = req.body as { situation: string }

  if (!situation) {
    res.status(400).json({ error: 'Missing required field: situation' })
    return
  }

  try {
    const result = await evaluateShouldApologize(situation)
    res.json(result)
  } catch (err) {
    console.error('Error evaluating situation:', err)
    res.status(500).json({ error: 'Failed to evaluate situation' })
  }
})
