import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const NUMBERED_RE = /\d/
const IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif|avif)$/i

function getDescription(filename: string): string | undefined {
  const lower = filename.toLowerCase()
  if (/sf/.test(lower))                       return 'SF Life'
  if (/picnic/.test(lower))                   return 'I love picnic!!'
  if (/travel/.test(lower))                   return 'Traveling is the meaning of life'
  if (/homedesign|home_design/.test(lower))   return 'I love home design'
  return undefined
}

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public')
    const files = fs.readdirSync(publicDir)

    const photos = files
      .filter(f => IMAGE_EXT.test(f) && NUMBERED_RE.test(f))
      .sort()
      .map(f => ({ src: `/${f}`, description: getDescription(f) }))

    return NextResponse.json(photos)
  } catch {
    return NextResponse.json([])
  }
}
