import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, BarChart, Dumbbell, BarChart2 } from 'lucide-react'
import { AnimatedBackground } from '@/components/ui/animated-background'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="absolute top-0 left-0 w-full z-10 bg-transparent">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <BarChart2 className="h-6 w-6 mr-2 text-primary" />
                <span className="text-2xl font-bold text-primary">XTrack</span>
              </div>
            </div>
            <div className="flex items-center">
              <Button asChild variant="ghost">
                <a href="/api/auth/login">Log in</a>
              </Button>
              <Button asChild className="ml-4">
                <a href="/api/auth/signup">Sign up</a>
              </Button>
            </div>
          </div>
        </nav>
      </header>


      <main className="flex-grow">
        <AnimatedBackground
          className="py-24"
          backgroundColor="bg-slate-50 dark:bg-slate-900"
          // pathColor="rgb(59, 130, 246)"
          
          pathColor="rgb(115,194,251)"
          // pathColor="rgb(247,112,40)"
          // pathColor="rgb(71, 73, 114)"
          pathOpacity={0.02}
        >
          <section className="bg-transparent dark:bg-transparent">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                    {/* Empower Your <span className="text-primary">Physiotherapy Practice</span> */}
                    Empower Your
                    Training
                    Workflow
                  </h1>
                  <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 dark:text-gray-300 sm:text-xl md:mt-5 md:max-w-3xl">
                    XTrack helps specialists manage Athletes, schedule trainings, and track progress effortlessly.
                  </p>
                  <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md ">
                      <Button asChild size="lg">
                        <Link href="/signup">Get Started</Link>
                      </Button>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Button asChild variant="outline" size="lg">
                        <Link href="/demo">Watch Demo</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                {/* <div className="mt-12 lg:mt-0">
                <img
                  className="w-full rounded-lg shadow-xl"
                  src="/placeholder.svg?height=400&width=600"
                  alt="PhysioTrack dashboard preview"
                />
              </div> */}
              </div>
            </div>
          </section>
        </AnimatedBackground>


        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Everything you need to manage your practice
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader>
                    <Calendar className="h-8 w-8 text-primary" />
                    <CardTitle>Smart Scheduling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Efficiently manage appointments and reduce no-shows with automated reminders.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Users className="h-8 w-8 text-primary" />
                    <CardTitle>Patient Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Keep detailed patient records, treatment plans, and progress notes in one place.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <BarChart className="h-8 w-8 text-primary" />
                    <CardTitle>Progress Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Visualize patient progress with customizable charts and analytics.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Dumbbell className="h-8 w-8 text-primary" />
                    <CardTitle>Exercise Library</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Access a comprehensive library of exercises to create personalized treatment plans.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Benefits</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Why choose PhysioTrack?
              </p>
            </div>
            <div className="mt-10">
              <ul className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                {[
                  "Streamline your workflow and save time",
                  "Improve patient outcomes with data-driven insights",
                  "Enhance communication with patients",
                  "Reduce administrative burden",
                  "Increase practice efficiency",
                  "Ensure compliance with healthcare regulations"
                ].map((benefit, index) => (
                  <li key={index} className="mt-10 md:mt-0">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{benefit}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-primary">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to dive in?</span>
              <span className="block text-primary-foreground">Start your free trial today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/signup">Get started</Link>
                </Button>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Button asChild size="lg" variant="outline">
                  <Link href="/contact">Contact sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-400">&copy; 2025 PhysioTrack, Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            {[
              { name: 'Facebook', href: '#' },
              { name: 'Instagram', href: '#' },
              { name: 'Twitter', href: '#' },
              { name: 'GitHub', href: '#' },
            ].map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500 text-sm">
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
    
  )
}