
import BottomBar from "@/components/shared/BottomBar"
import LeftSideBar from "@/components/shared/LeftSideBar"
import RightSideBar from "@/components/shared/RightSideBar"
import TopBar from "@/components/shared/TopBar"

import { ClerkProvider } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Meta Threads Application',
}

import  "../globals.css"
import { Metadata } from "next"

const RootLayout =({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <TopBar />

          <main className="flex flex-row">
            <LeftSideBar />

            <section className="main-container">
              <div className="w-full max-w-4xl">
                {children}
              </div>
            </section>

            <RightSideBar />
          </main>

          <BottomBar />
          
        </body>
      </html>
    </ClerkProvider>
  )
}

export default RootLayout