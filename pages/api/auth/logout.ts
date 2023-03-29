import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<null>) {
  res.setHeader('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`)
  res.status(200).end()
}
