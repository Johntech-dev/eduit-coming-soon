import Link from "next/link"
import { Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import NotifyMeModal from "@/components/notify-me-modal"
import WaitlistForm from "@/components/waitlist-form"
import { FadeIn, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Rocket className="h-6 w-6 text-orange-500" />
          <span className="ml-2 text-2xl font-bold text-green-600">EduIT</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#waitlist">
            Join Waitlist
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-white to-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-10">
              <FadeIn>
                <div className="space-y-4 max-w-3xl mx-auto">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    The <span className="text-green-600">Smart</span> School Management System
                  </h1>
                  <p className="text-gray-500 md:text-xl max-w-[700px] mx-auto">
                    Simplify administration, enhance learning, and connect your entire educational community with EduIT.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <NotifyMeModal />
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    Learn More
                  </Button>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="relative mt-8 w-full max-w-5xl">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-400 rounded-full opacity-20 animate-pulse"></div>

                  <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="grid md:grid-cols-3 gap-0">
                      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-8 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
                        <p className="opacity-90 mb-6">Join our waitlist today and get 50% off when we launch.</p>
                        <div className="flex space-x-2">
                          <div className="bg-white/20 h-2 w-2 rounded-full animate-pulse"></div>
                          <div className="bg-white/20 h-2 w-2 rounded-full animate-pulse delay-100"></div>
                          <div className="bg-white/20 h-2 w-2 rounded-full animate-pulse delay-200"></div>
                        </div>
                      </div>
                      <div className="md:col-span-2 p-8 flex flex-col justify-center">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-600"
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                            </div>
                            <h4 className="font-medium">Student Management</h4>
                          </div>
                          <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-orange-500"
                              >
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                              </svg>
                            </div>
                            <h4 className="font-medium">Curriculum Planning</h4>
                          </div>
                          <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-600"
                              >
                                <path d="M12 2v20"></path>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                              </svg>
                            </div>
                            <h4 className="font-medium">Financial Management</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600">Features</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need</h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    EduIT provides a comprehensive suite of tools to manage your educational institution efficiently.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <StaggerContainer className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <StaggerItem index={0} className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Student Management</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Easily manage student records, attendance, and performance tracking.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem index={1} className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Curriculum Planning</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Design and manage your curriculum with powerful planning tools.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem index={2} className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 2v20"></path>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Financial Management</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Handle fees, budgets, and financial reporting with ease.
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-600">About</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose EduIT?</h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    We're building EduIT with a focus on simplicity, efficiency, and connectivity.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <ScrollReveal>
                <div className="flex flex-col justify-center space-y-4">
                  <ul className="grid gap-6">
                    <li className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">User-Friendly Interface</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Intuitive design that requires minimal training to use effectively.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">Cloud-Based Solution</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Access your school management system from anywhere, anytime.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">Comprehensive Reporting</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          Generate detailed reports to make data-driven decisions.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>
              <ScrollReveal>
                <div className="flex items-center justify-center">
                  <div className="relative h-[350px] w-full rounded-lg bg-gradient-to-br from-green-500 to-orange-500 p-1">
                    <div className="absolute inset-0 flex items-center justify-center bg-white m-1 rounded-lg">
                      <div className="text-center p-6">
                        <h3 className="text-2xl font-bold text-green-600 mb-4">Join the Future of Education</h3>
                        <p className="text-gray-500 mb-6">
                          EduIT is designed by educators for educators. We understand the challenges you face and have
                          built solutions to address them.
                        </p>
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white animate-pulse">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
        <section id="waitlist" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-green-50 to-orange-50">
          <div className="container px-4 md:px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600">
                    Limited Time Offer
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join Our Waitlist</h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Schools that join our waitlist now will receive{" "}
                    <span className="font-bold text-orange-500">50% off</span> the regular pricing when we launch.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="mx-auto max-w-md">
              <ScrollReveal>
                <WaitlistForm />
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 EduIT. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

