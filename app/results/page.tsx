import { Suspense, useEffect, useState } from "react";
import ResultsForm from "./ResultsForm";

export default function Results() {
	return (
		<div>
		<Suspense>
			<ResultsForm />
		</Suspense>
		</div>
	)
}
