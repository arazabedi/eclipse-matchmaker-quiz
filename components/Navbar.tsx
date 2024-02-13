'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { useEffect, useState } from 'react'
import styles from './Navbar.css'

const Navbar = () => {

	const [scrolling, setScrolling] = useState(false);

	useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
		<header className={`bg-bg-neutral-950 sticky top-0 z-50 ${scrolling ? 'transition-transform duration-300 transform -translate-y-full' : ''}`}>
			<div className='max-w-7xl mx-auto flex items-center justify-between py-2 px-4'>
				<Link className='font-bold text-lg' href={'/'}>
					Eclipse Matchmaker Quiz
				</Link>
				<NavigationMenu>
					<NavigationMenuList className='gap-2'>
						<NavigationMenuItem>
							<Link href='/posts' legacyBehavior passHref>
								<NavigationMenuLink
									className={cn(navigationMenuTriggerStyle(), 'font-medium')}
								>
									Anonymous Confessions
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem></NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</header>
	);

}
export default Navbar
