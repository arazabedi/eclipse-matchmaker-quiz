"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { questionsObject } from "./questionsObject";
import QuestionRadioGroup from "./questionRadioGroup";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useRouter } from 'next/navigation'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import useFetch from 'http-react'
import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Checkbox } from "@/components/ui/checkbox";

// Ensures that each answer gives a final result
// between 1-5 (as a string due to a type error)
const answerSchema = z.enum(["1", "2", "3", "4", "5"]);

// Creates a schema that expects each question to
// have an answer of the type given in answerSchema
const quizSchema = z.object({});
for (let i = 1; i <= 26; i++) {
	const key = `q${i}`;
	quizSchema.shape[key] = answerSchema;
}

const userSchema = z.object({
	name: z.string().min(4, {
		message: "Name must be at least 4 characters long.",
	}),
	socialHandle: z.string().min(4, {
		message: "Social media handle must be least 4 characters.",
	}).optional(),
	preferredGender: z.array(z.string().min(2).refine(gender => ["male", "female", "non-binary"].includes(gender), {
		message: "Pick one option.",
	})),
	gender: z.string().min(2).refine(gender => ["male", "female", "non-binary"].includes(gender), {
		message: "Pick One Option.",
	}),
	email: z
		.string()
		.min(7)
		.email({ message: "Invalid email format" }) // Ensure it's a valid email format
		.max(255), // You may want to set a maximum length for emails
});

export const formSchema = quizSchema.merge(userSchema)

const defaultValues = {
	name: "Araz",
	socialHandle: "razzyroo777",
	gender: "male",
	preferredGender: ["male"],
	email: "wow@gmail.com",
	q1: '5',
	q2: '5',
	q3: '5',
	q4: '5',
	q5: '5',
	q6: '5',
	q7: '5',
	q8: '5',
	q9: '5',
	q10: '5',
	q11: '5',
	q12: '5',
	q13: '5',
	q14: '5',
	q15: '5',
	q16: '5',
	q17: '5',
	q18: '5',
	q19: '5',
	q20: '5',
	q21: '5',
	q22: '5',
	q23: '5',
	q24: '5',
	q25: '5',
	q26: '5',
};

export default function Quiz() {
	const router = useRouter()

	const [init, setInit] = useState(false);

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
		console.log(container);
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues
	})

	function dataShaper(values: z.infer<typeof formSchema>) {
		// console.log(values);

		const stringValuesArray = Object.values(values);
		// console.log(stringValuesArray);

		const userArray = stringValuesArray.reverse().slice(-5);
		// console.log(userArray);

		const answersArray = stringValuesArray.slice(0, -5);
		// console.log(answersArray);

		const integerValuesArray = answersArray.map((x: string) => {
			return +x
		})
		// console.log(integerValuesArray);

		const postData = {
			name: userArray[4],
			socialHandle: userArray[3],
			gender: userArray[2],
			preferredGender: userArray[1],
			email: userArray[0],
			responses: integerValuesArray,
		};
		console.log("postData:", postData)

		return postData
	}

	const formData = form.getValues()
	console.log(formData);
	const postData = dataShaper(formData);

	const {
		reFetch: submitPost,
		error
	} = useFetch('/users', {
		method: 'POST',
		auto: false,
		body: postData,
		onResolve() {
			router.replace('/thank-you')
			router.refresh()
		}
	})

	const onSubmit = form.handleSubmit(submitPost)

	const handleChange = (name: string, valueIndex: number) => {
		const answerArray = questionsObject[name].answers;
		const value = answerArray.length - valueIndex;
		form.setValue(name, value.toString());
	};

	const handleRadioChange = (name: "preferredGender" | "gender", value: string) => {
		form.setValue(name, value);
	}

	return (
		<main className="relative">
			<Form {...form}>
				{error && (
					<Alert className='mb-4' variant='destructive'>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>An error ocurred</AlertTitle>
					</Alert>
				)}
				<form onSubmit={onSubmit} className="space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>
									This is your public display name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="socialHandle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Social Handle</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>
									Social media username so that your match can find you (optional)
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
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
									So we can send you your matches
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="preferredGender"
						render={() => (
							<FormItem>
								<div className="mb-4">
									<FormLabel className="text-base">Preferred Gender</FormLabel>
									<FormDescription>
										Select your preferred gender(s).
									</FormDescription>
								</div>
								<FormItem
									className="flex flex-row items-start space-x-3 space-y-0"
									key="male"
								>
									<FormControl>
										<Checkbox
											checked={form.getValues().preferredGender.includes("male")}
											onCheckedChange={(checked) =>
												form.setValue(
													"preferredGender",
													checked
														? [...form.getValues().preferredGender, "male"]
														: form.getValues().preferredGender.filter(
															(value) => value !== "male"
														)
												)
											}
										/>
									</FormControl>
									<FormLabel className="font-normal">Male</FormLabel>
								</FormItem>
								<FormItem
									className="flex flex-row items-start space-x-3 space-y-0"
									key="female"
								>
									<FormControl>
										<Checkbox
											checked={form.getValues().preferredGender.includes(
												"female"
											)}
											onCheckedChange={(checked) =>
												form.setValue(
													"preferredGender",
													checked
														? [...form.getValues().preferredGender, "female"]
														: form.getValues().preferredGender.filter(
															(value) => value !== "female"
														)
												)
											}
										/>
									</FormControl>
									<FormLabel className="font-normal">Female</FormLabel>
								</FormItem>
								<FormItem
									className="flex flex-row items-start space-x-3 space-y-0"
									key="non-binary"
								>
									<FormControl>
										<Checkbox
											checked={form.getValues().preferredGender.includes(
												"non-binary"
											)}
											onCheckedChange={(checked) =>
												form.setValue(
													"preferredGender",
													checked
														? [
															...form.getValues().preferredGender,
															"non-binary",
														]
														: form.getValues().preferredGender.filter(
															(value) => value !== "non-binary"
														)
												)
											}
										/>
									</FormControl>
									<FormLabel className="font-normal">Non-Binary</FormLabel>
								</FormItem>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="gender"
						render={({ field }) => (
							<FormItem {...field}>
								<FormLabel>Gender</FormLabel>
								<FormControl>
									<RadioGroup
										defaultValue="male"
										onValueChange={(value: string) => handleRadioChange("gender", value)}
									>
										<FormItem key={1} className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="male" />
											</FormControl>
											<FormLabel className="font-normal">
												Male
											</FormLabel>
										</FormItem>
										<FormItem key={2} className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="female" />
											</FormControl>
											<FormLabel className="font-normal">
												Female
											</FormLabel>
										</FormItem>
										<FormItem key={3} className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="non-binary" />
											</FormControl>
											<FormLabel className="font-normal">
												Non-Binary
											</FormLabel>
										</FormItem>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Separator className="my-4" />
					{Object.keys(questionsObject).map((questionNumber) => (
						<FormField
							key={questionNumber}
							control={form.control}
							name={questionNumber as keyof typeof questionsObject}
							initialValue={questionsObject.q1.answers[0]}
							render={({ field }) => (
								<FormItem>
									<FormLabel>{questionsObject[questionNumber].question}</FormLabel>
									<FormControl>
										<QuestionRadioGroup
											questionNumber={questionNumber}
											onChange={(value) => {
												const answerArray = questionsObject[questionNumber].answers;
												const index = answerArray.indexOf(value);
												handleChange(questionNumber, index !== -1 ? index : 0);
											}}
											value={field.value}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
					<Button type="submit">Submit</Button>
				</form>
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
			</Form>
		</main>
	);
}
