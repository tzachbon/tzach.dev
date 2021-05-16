import express, { Request, Response } from 'express'
import { NextServer } from 'next/dist/server/next'
import nextConfig from '../next.config'
import path from 'path'
import next from 'next'

const dev = process.env.NODE_ENV !== 'production'
const nextOptions: NextServer['options'] = {
	dir: path.join('packages', 'ssr'),
	dev,
	conf: nextConfig, 
	customServer: true
}

const app = next(nextOptions)
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

run()

async function run() {
	try {
		await app.prepare()
		const server = express()
		server.all('*', (req: Request, res: Response) => {
			return handle(req, res)
		})
		server.listen(port, (err?: any) => {
			if (err) throw err
			console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`)
		})
	} catch (e) {
		console.error(e)
		process.exit(1)
	}
}