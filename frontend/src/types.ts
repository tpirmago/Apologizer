export type Category = 'relationship' | 'friends' | 'work' | 'family'
export type Tone = 'sincere' | 'formal' | 'casual' | 'light-funny'
export type Severity = 1 | 2 | 3 | 4 | 5

export type ApologySession = {
  situation: string
  category: Category
  severity: Severity
  tone: Tone
  generatedApology?: string
}

export type RewriteInstruction =
  | 'more-sincere'
  | 'shorter'
  | 'more-formal'
  | 'less-awkward'
  | 'funnier'

export type GenerateApologyRequest = {
  situation: string
  category: Category
  severity: Severity
  tone: Tone
  rewriteInstruction?: RewriteInstruction
  previousApology?: string
}

export type GenerateApologyResponse = {
  apology: string
}
