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

// Ensures that each answer gives a final result
// between 1-5 (as a string due to a type error)
const answerSchema = z.enum(["1", "2", "3", "4", "5"]);

// Creates a schema that expects each question to
// have an answer of the type given in answerSchema
const formSchema = z.object({});
for (let i = 1; i <= 26; i++) {
	const key = `q${i}`;
	formSchema.shape[key] = answerSchema;
}

const defaultValues = {
  q1: '1',
  q2: '1',
  q3: '1',
  q4: '1',
  q5: '1',
  q6: '1',
  q7: '1',
  q8: '1',
  q9: '1',
  q10: '1',
  q11: '1',
  q12: '1',
  q13: '1',
  q14: '1',
  q15: '1',
  q16: '1',
  q17: '1',
  q18: '1',
  q19: '1',
  q20: '1',
  q21: '1',
  q22: '1',
  q23: '1',
  q24: '1',
  q25: '1',
  q26: '1',
};

export default function Quiz() {

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues,
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);

		const stringValuesArray = Object.values(values);
		console.log(stringValuesArray);

		const integerValuesArray = stringValuesArray.map((x: string) => {
			return +x
		})
		console.log(integerValuesArray);

		const sum = integerValuesArray.reduce((a, b) => a + b, 0);
		console.log("Total: " + sum);
	}


	const handleChange = (name: string, valueIndex: number) => {
		const answerArray = questionsObject[name].answers;
		const value = answerArray.length - valueIndex;
		form.setValue(name, value.toString());
	};

	return (
		<main className="">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					{Object.keys(questionsObject).map((questionNumber) => (
						<FormField
							key={questionNumber}
							control={form.control}
							name={questionNumber as keyof typeof questionsObject}
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
			</Form>
		</main>
	);
}
