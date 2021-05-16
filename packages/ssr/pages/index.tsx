import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { DeviceType, getDeviceType } from '../utils/getDeviceType'

const ThreeD = dynamic(() => import('../components/ThreeD'), { ssr: false })

export interface CustomServerSideProps {
	deviceType: DeviceType
}

type Props = CustomServerSideProps

export default function Home({ deviceType }: Props) {
	const isMobile = deviceType === DeviceType.MOBILE


	return (
		<div className={styles.container}>
			<Head>
				<title>tzach.dev</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<h1 className={styles.title}>
				Welcome to <a href="/">tzach.dev!</a>
			</h1>

			{
				!isMobile && (
					<p className={styles.description}>
						Try to use the keyboard
					</p>
				)
			}


			<ThreeD isMobile={isMobile} className={styles.main} />

			{
				!isMobile && (
					<footer className={styles.footer}>
						tzach.dev
					</footer>
				)
			}

		</div>
	)
}


export const getServerSideProps: GetServerSideProps<CustomServerSideProps> = async ({ req }) => {
	const userAgent = req.headers['user-agent']

	return {
		props: {
			deviceType: getDeviceType(userAgent)
		}
	}
}