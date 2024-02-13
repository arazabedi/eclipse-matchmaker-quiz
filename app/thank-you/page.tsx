"use client"

import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";
import MovingText from 'react-moving-text'

export default function ThankYou() {
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


	return (
		<main className="flex flex-col gap-3 items-center">
			<div className="gap-14 text-4xl mt-32 text-center">
				<MovingText
					type="fadeInFromLeft"
					duration="1000ms"
					delay="0s"
					direction="normal"
					timing="ease"
					iteration="1"
					fillMode="backwards">
					<p>THANKS FOR TAKING THE TIME TO DO OUR MATCHMAKER QUIZ</p>
					<p>P.S. Check out the anonymous confessions</p>
				</MovingText>
			</div>
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
		</main>
	)
}
