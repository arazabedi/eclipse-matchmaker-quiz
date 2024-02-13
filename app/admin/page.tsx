import { prisma } from '@/server'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default async function Admin(props) {
	const users = (await prisma.user.findMany({})).reverse()
	console.log(users);
	function calculateCompatibilityScore(responsesA: number[], responsesB: number[]): number {
		let compatibilityScore = 0;
		for (let i = 0; i < responsesA.length; i++) {
			const absoluteDifference = Math.abs(responsesA[i] - responsesB[i]);
			compatibilityScore += absoluteDifference;
		}
		return compatibilityScore;
	}

	function calculateCompatibilityMatrix(): number[][] {
		const matrix: number[][] = [];

		// Initialize the matrix with zeros
		for (let i = 0; i < users.length; i++) {
			matrix[i] = new Array(users.length).fill(0);
		}

		// Calculate compatibility scores based on responses
		for (let i = 0; i < users.length; i++) {
			for (let j = i + 1; j < users.length; j++) {
				const score = calculateCompatibilityScore(
					users[i].responses,
					users[j].responses
				);
				matrix[i][j] = matrix[j][i] = score;
			}
		}

		return matrix;
	}

	// async function formatMatchmakerResults(userIndex: number): Promise<string> {
	// 	// console.log(users)
	// 	const rankedMatches = await getRankedMatches(userIndex);
	// 	const compatibilityPercentages: String[] = []

	// 	let resultString = `My Matchmaker Quiz Results🌖✨:\n`;
	// 	resultString += `Ranked Matches:\t\tCompatibility Percentage\t\tSocial Handle\n`;

	// 	for (let i = rankedMatches.length - 1; i >= 0; i--) {
	// 		const matchIndex = rankedMatches[i];
	// 		const compatibilityScore = calculateCompatibilityScore(
	// 			users[userIndex].responses,
	// 			users[matchIndex].responses
	// 		);
	// 		const compatibilityPercentage = ((1 - compatibilityScore / (26 * 4)) * 100).toFixed(2);
	// 		compatibilityPercentages.push(compatibilityPercentage);

	// 		resultString += `${users[matchIndex].name}:\t\t\t${compatibilityPercentage}%\t\t${users[matchIndex].socialHandle}\n`;
	// 	}

	// 	return resultString;
	// }

	async function formatMatchmakerResults(userIndex: number): Promise<{ [name: string]: { compatibility: string } }> {
		const rankedMatches = await getRankedMatches(userIndex);
		const compatibilityRatings: { [name: string]: { compatibility: string } } = {};

		for (let i = rankedMatches.length - 1; i >= 0; i--) {
			const matchIndex = rankedMatches[i];
			const compatibilityScore = calculateCompatibilityScore(
				users[userIndex].responses,
				users[matchIndex].responses
			);
			const compatibilityPercentage = ((1 - compatibilityScore / (26 * 4)) * 100).toFixed(2);

			compatibilityRatings[users[matchIndex].name] = {
				compatibility: compatibilityPercentage + "%"
			};
		}

		return compatibilityRatings;
	}

	async function getRankedMatches(userIndex: number): Promise<number[]> {
		if (userIndex < 0 || userIndex >= users.length) {
			throw new Error("Invalid user index");
		}

		const user = users[userIndex]; // correct
		// console.log(users[userIndex].name)
		const matrix = calculateCompatibilityMatrix(); // correct
		const rankedMatches: { userIndex: number, compatibilityScore: number }[] = [];

		// Calculate compatibility scores only for potential matches
		for (let i = 0; i < users.length; i++) {
			if (userIndex !== i && user.preferredGender.includes(users[i].gender) && users[i].preferredGender.includes(user.gender)) {
				const compatibilityScore = matrix[userIndex][i];
				rankedMatches.push({ userIndex: i, compatibilityScore });
			}
			// Return only user indices from ranked matches
		}
		return rankedMatches.map(match => match.userIndex);
	}

	// async function main() {
	// 	// let email: string = 'djfndk@dkldm.com'
	// 	// let index = users.findIndex(user => user.email === email);
	// 	// const matchmakerResults = await formatMatchmakerResults(index);
	// 	let array: {}[] = []
	// 	for (let i = 0; i < users.length; i++) {
	// 		const matchmakerResults = await formatMatchmakerResults(i);
	// 		array.push(matchmakerResults)
	// 	}
	// 	return array
	// }

	// const array = await main()

	// return (
	// 	<div>
	// 		{array.map((userCompatibility, index) => (
	// 			<div key={index}>
	// 				<h2>{users[index].name}'s Compatibility Ratings:</h2>
	// 				<ul>
	// 					{Object.entries(userCompatibility).map(([name, { compatibility }], innerIndex) => (
	// 						<li key={innerIndex}>
	// 							{name}: {compatibility}
	// 						</li>
	// 					))}
	// 				</ul>
	// 			</div>
	// 		))}
	// 	</div>
	// )


	// let index = users.findIndex(user => user.email === userEmail);
	// const matchmakerResults = await formatMatchmakerResults(index);

	const userIndex = users.findIndex(user => user.email === props.userEmail);

	const compatibilityData = await formatMatchmakerResults(userIndex);

	function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

	return (
		<div className='mt-8'>
			<Button asChild>
				<Link className="mb-10" href="/results">Back</Link>
			</Button>
			<Card>
				<CardHeader>
					<CardTitle><h1>Compatibility Ratings for {users[userIndex].name}</h1></CardTitle>
					<CardDescription>Here are your picks</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableCaption>Have a jolly good night.</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Name</TableHead>
								<TableHead>Socials</TableHead>
								<TableHead>Compatibility Percentage</TableHead>
								<TableHead className="text-right">Gender</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Object.entries(compatibilityData).reverse().map(([name, { compatibility }], index) => (
								<TableRow key={index}>
									<TableCell className="font-medium">{name}</TableCell>
									<TableCell>{users[index].socialHandle}</TableCell>
									<TableCell>{compatibility}</TableCell>
									<TableCell className="text-right">{capitalizeFirstLetter(users[index].gender)}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
				{/* <CardFooter>
					<p>Card Footer</p>
				</CardFooter> */}
			</Card>
		</div>
	);
}
