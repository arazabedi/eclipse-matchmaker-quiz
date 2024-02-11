import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
	// Secret for Next-auth, without this JWT encryption/decryption won't work
	secret: process.env.NEXTAUTH_SECRET,

	// Configure one or more authentication providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_APP_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET as string
		}),
		CredentialsProvider({
			// The name to display on the sign-in form
			name: 'Email and Password',
			// Specify the credentials fields
			credentials: {
				email: { label: 'Email', type: 'text', placeholder: 'example@example.com' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials, req) {
				// Your authentication logic here
				// Example: Check if the credentials match a user in your database
				const user = await yourAuthenticationFunction(credentials.email, credentials.password);

				if (user) {
					return user; // Return the user object if authentication succeeds
				} else {
					return null; // Return null if authentication fails
				}
			}
		})
	],
}
