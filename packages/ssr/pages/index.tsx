import Head from 'next/head'
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'

const ThreeD = dynamic(() => import('../components/ThreeD'), { ssr: false })

export default function Home() {

	return (
		<div className={styles.container}>
			<Head>
				<title>tzach.dev</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className={styles.title}>
				Welcome to <a href="/">tzach.dev!</a>
			</h1>

			<p className={styles.description}>
				Try to use the keyboard
			</p>

			<ThreeD className={styles.main} />

			<footer className={styles.footer}>
				tzach.dev
			</footer>
		</div>
	)
}
