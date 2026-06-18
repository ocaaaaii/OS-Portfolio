import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Matches filenames that contain at least one digit, e.g. travel01.jpg, SF02.png
const NUMBERED_RE = /\d/
const IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif|avif)$/i

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public')
    const files = fs.readdirSync(publicDir)

    const photos = files
      .filter(f => IMAGE_EXT.test(f) && NUMBERED_RE.test(f))
      .sort()
      .map(f => ({ src: `/${f}` }))

    return NextResponse.json(photos)
  } catch {
    return NextResponse.json([])
  }
}
