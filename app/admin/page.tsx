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

export default async function Admin(props) {
	async function getUsers() {
		// const res = await fetch(`http://${process.env.VERCEL_URL}`);
		console.log("/////////////////////////////////////////////////");
		console.log(process.env.NEXT_PUBLIC_VERCEL_URL);
		const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}`);
		let users = await res.json();
		users.reverse()
		return users
	}

	const users = await getUsers()
	console.log(users);

	const userIndex = users.findIndex(user => user.email === props.userEmail);

	if (userIndex < 0 || userIndex >= users.length) {
		return (
			<div className='text-red-500 mt-7'>
				Invalid email
			</div>
		)
	}

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

	const compatibilityData = await formatMatchmakerResults(userIndex);

	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	if (!users || users.length === 0) {
		return <div>Loading users data...</div>;
	}

	return (
		(userIndex < 0 || userIndex >= users.length) ? (
			<div></div>
		) : (
			<div className='mt-8'>
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
		)
	);
}
