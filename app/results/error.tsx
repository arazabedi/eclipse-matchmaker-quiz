'use client' // Error components must be Client Components

// This error page will show given any runtime error on page.tsx within this folder.
// The admin component takes a prop of userEmail, and if the email does not exist in the database
// then the admin component will have a runtime error (see the code which handles indexes - getRankedMatches)

import { useEffect, useState } from 'react'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster";
import { useSearchParams } from 'next/navigation'
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error)
	}, [error])

	const router = useRouter()

	const { toast } = useToast()

	const formSchema = z.string().min(7).email({ message: "Invalid email format" }).max(255)

	const searchParams = useSearchParams()
	const email = searchParams.get('email')

	const [init, setInit] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})


	async function onSubmit() {
		router.refresh()
	}

	useEffect(() => {
		toast({
			title: "Error",
			description: "Email not found",
		})
	}, [])

	useEffect(() => {
		initParticlesEngine(async (engine) => {
			// you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
			// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
			// starting from v2 you can add only the features you need reducing the bundle size
			//await loadAll(engine);
			//await loadFull(engine);
			await loadSlim(engine);
			//await loadBasic(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);

	const particlesLoaded = (container) => {
		// console.log(container);
	};


	return (
		<div>
			<div>
				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-8">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>
										To see your compatible matches
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</div>
			<h2 className='text-red-700 mt-5'>Invalid Email</h2>
			{/* <button
				onClick={
					// Attempt to recover by trying to re-render the segment
					redirect('/results')
				}
			>
				Try again
			</button> */}
			<Toaster />
			{init && <Particles
				id="tsparticles"
				className="absolute inset-0 opacity-50 z-0 pointer-events-none"
				particlesLoaded={particlesLoaded}
				options={{
					background: {
						color: {
							value: "#46344e",
						},
						opacity: 0.1,
					},
					fpsLimit: 120,
					interactivity: {
						events: {
							onClick: {
								enable: true,
								mode: "push",
							},
							onHover: {
								enable: true,
								mode: "repulse",
							},
							resize: true,
						},
						modes: {
							push: {
								quantity: 4,
							},
							repulse: {
								distance: 200,
								duration: 0.4,
							},
						},
					},
					particles: {
						color: {
							value: "#ffffff",
						},
						links: {
							color: "#ffffff",
							distance: 150,
							enable: true,
							opacity: 0.5,
							width: 1,
						},
						move: {
							direction: "none",
							enable: true,
							outModes: {
								default: "bounce",
							},
							random: false,
							speed: 6,
							straight: false,
						},
						number: {
							density: {
								enable: true,
								area: 800,
							},
							value: 80,
						},
						opacity: {
							value: 0.5,
						},
						shape: {
							type: "circle",
						},
						size: {
							value: { min: 1, max: 5 },
						},
					},
					detectRetina: true,
				}}
			/>
			}
		</div>
	)
}
