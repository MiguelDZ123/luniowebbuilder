import React from 'react'
import Link from 'next/link'
import RecentProjects from '../components/home/RecentProjects'
import Header from '../components/home/Header'

const page = () => {
    return (
        <div className="min-h-screen font-mono relative overflow-x-hidden">
           <Header />
            <RecentProjects />
        </div>
    )
}

export default page