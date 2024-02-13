import { prisma } from '@/server'

const email = "wow@gmail.com"

export default async function Result() {
	const users = (await prisma.user.findMany({})).reverse()

	const index = users.findIndex(user => user.email === email)

	return (
		<main>
		</main>
	)
}
