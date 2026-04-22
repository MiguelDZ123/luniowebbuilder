import React from 'react'
import Link from 'next/link'

type Props = {}

const Header = (props: Props) => {
    return (
        <div>
            {/* Top bar */}
            <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex font-roboto font-medium items-center gap-2">
                    <Link href="/">
                        <img src="./lunioailogo.png" alt="LUNIO AI" className="h-8 w-30" />
                    </Link>
                </div>
                <nav className="text-sm text-muted-foreground hidden sm:flex items-center gap-6">
                    <Link href="/community" className="transition-colors cursor-default">
                        Community
                    </Link>
                    <Link href="/docs" className="transition-colors cursor-default">
                        Docs
                    </Link>
                    <Link href="/pricing" className="transition-colors cursor-default">
                        Pricing
                    </Link>
                </nav>
            </header>
        </div>
    )
}

export default Header