// pages/posts.js
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/post/PostCard';
import { prisma } from '@/server';
import Head from 'next/head';

export const revalidate = 0;

export default async function Posts() {
	const posts = (await prisma.post.findMany({})).reverse();

	// Function to generate random position for heart images
	const randomPosition = () => ({
		top: `${Math.random() * 100}%`,
		left: `${Math.random() * 100}%`,
	});

	return (
		<section style={{ position: 'relative' }}>
			<Head>
				<meta http-equiv="refresh" content="15"/>
			</Head>
			<Link href="/" className="flex gap-1 items-center ">
				<ArrowLeft size={18} />
				Back
			</Link>
			<header className="flex items-center justify-between my-4 md:my-8">
				<h1 className="font-bold text-2xl">All Posts</h1>
				<Link href="/posts/create">
					<Button size="sm" variant="outline">
						Create Post
					</Button>
				</Link>
			</header>

			{posts.length === 0 ? (
				<div className="h-72 flex items-center justify-center">
					<p>No posts to show</p>
				</div>
			) : (
				<div className="py-4 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3  gap-2 rounded-md">
					{posts.map((post) => (
						<PostCard post={post} key={post.id} />
					))}
				</div>
			)}
		</section>
	);
}
