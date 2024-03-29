import './globals.css'
import { AtomicState } from 'atomic-state'
import { FetchConfig } from 'http-react'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
	title: 'Home',
	description: 'Home page '
}

function MainLayout({ children }) {
	return (
		<html suppressHydrationWarning>
			<head>
				<title>Next.js starter</title>
				<meta name='description' content='A Starter with Next.js' />
			</head>

			<body className={GeistSans.className}>
					<main className='min-h-screen'>
						<AtomicState>
							<FetchConfig baseUrl='/api'>
								<Navbar />
								<div className='max-w-7xl mx-auto p-4'>{children}</div>
							</FetchConfig>
						</AtomicState>
					</main>
			</body>
		</html>
	)
}

export default MainLayout
