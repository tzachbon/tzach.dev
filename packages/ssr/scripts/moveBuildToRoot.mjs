import path from 'path'
import moveFiles from 'mv'

const FILES_DIR = path.resolve('.next')
const TARGET_DIR = path.resolve('..', '..', '.next')

async function run() {
	await new Promise((resolve, reject) => {
		moveFiles(FILES_DIR, TARGET_DIR, { mkdirp: true }, (err) => err ? reject(err) : resolve())
	})
	
	console.log()
	console.log(`Successfully moved files from ${FILES_DIR} to ${TARGET_DIR}`)
	console.log()
}

run()