'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generatedCVApi, jobPostingApi } from '@/lib/api/client';
import {
  Briefcase,
  FileText,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Layout,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  Users,
  Star,
  Download,
  FileCheck,
  Brain,
  ChevronRight,
  Crown,
  Infinity as InfinityIcon,
  User
} from 'lucide-react';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [latestCV, setLatestCV] = useState<any>(null);
  const [latestJob, setLatestJob] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Fetch latest CV
      generatedCVApi.getAll(user.id).then(res => {
        if (res.data && res.data.length > 0) {
          // Assuming the API returns sorted by recently created, or we sort it here
          const sorted = res.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLatestCV(sorted[0]);
        }
      }).catch(err => console.error(err));

      // Fetch latest Job Posting
      jobPostingApi.getAll(user.id).then(res => {
        if (res.data && res.data.length > 0) {
          const sorted = res.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLatestJob(sorted[0]);
        }
      }).catch(err => console.error(err));
    }
  }, [isAuthenticated, user]);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Our advanced AI engine deeply analyzes job descriptions to extract critical keywords and requirements.',
      gradient: 'from-violet-600 to-indigo-600',
    },
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'Automatically tailors your experience to align perfectly with the job, boosting your ATS score.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Instant Generation',
      description: 'Create a tailored, professional application in seconds, not hours. Speed is your advantage.',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      icon: Shield,
      title: 'ATS Compliance',
      description: 'Formatting that passes automated filters effortlessly. Get your CV in front of human eyes.',
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      icon: Layout,
      title: 'Premium Templates',
      description: 'Access a library of sleek, modern designs that adapt to your content and personal brand.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Download,
      title: 'Smart Export',
      description: 'Download pixel-perfect PDFs with interactive links and optimized metadata.',
      gradient: 'from-purple-500 to-fuchsia-500',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Profile',
      description: 'Input your career history once. We store your experience, skills, and education securely.',
    },
    {
      number: '02',
      title: 'Target Job',
      description: 'Paste the URL or text of the job you want. Our AI analyzes the specific requirements.',
    },
    {
      number: '03',
      title: 'Generate',
      description: 'Watch as a custom CV is instanty created, optimizing your profile for that tangible role.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'Tech Corp',
      content: 'I got 3x more interview callbacks. The AI tailored my generic experience to exactly what they were looking for.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'StartupXYZ',
      content: 'The ATS optimization requires zero effort. It just works. Landed my dream job in 2 weeks.',
      rating: 5,
    },
    {
      name: 'Emily R.',
      role: 'UX Designer',
      company: 'Creative Studio',
      content: 'Beautiful templates that actually respect visual hierarchy. Finally, a CV tool designed for humans and bots.',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19] text-white overflow-x-hidden selection:bg-blue-500/30">

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[128px]" />
      </div>

      <main className="relative z-10">

        {/* Navigation / Header */}
        <header className="absolute top-0 w-full z-50 pt-6 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">ResuMatch AI</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/auth/register" className="px-5 py-2.5 text-sm font-bold bg-white text-black rounded-full hover:bg-gray-100 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          <div className="max-w-5xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-8 backdrop-blur-md animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Now with AI-Powered Cover Letters
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Craft Your Perfect <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Job-Winning CV
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Stop sending generic resumes. Our AI analyzes job descriptions and tailors your CV to pass ATS filters and impress recruiters instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link
                href={isAuthenticated ? "/dashboard" : "/auth/register"}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 origin-left" />
                <span className="relative flex items-center gap-2">
                  Build My CV Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>

              <a
                href="#how-it-works"
                className="px-8 py-4 bg-[#1a1f2e] border border-white/10 rounded-full font-semibold text-gray-300 hover:bg-[#232a36] hover:text-white hover:border-white/20 transition-all duration-300"
              >
                See How It Works
              </a>
            </div>

            {/* Dashboard Preview Section */}
            <div className="relative mx-auto max-w-6xl group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-purple-600/20 rounded-xl blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-700" />

              <div className="relative rounded-xl border border-white/10 bg-[#131620]/80 backdrop-blur-xl shadow-2xl overflow-hidden transform group-hover:rotate-x-1 transition-transform duration-700 ease-out">
                {/* Browser Controls */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#1a1f2e]/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <div className="ml-4 px-3 py-1 bg-black/20 rounded-md text-[10px] text-gray-500 font-mono w-64">
                    https://resumatch.ai/dashboard
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {isAuthenticated && (latestCV || latestJob) ? (
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Latest CV Card */}
                      <div className="group/card relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-1 border border-white/10 overflow-hidden hover:border-blue-500/30 transition-colors">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        <div className="bg-[#151925] rounded-lg p-5 h-full relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                              <FileText className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold bg-white/5 px-2 py-1 rounded">Latest CV</span>
                          </div>

                          <h3 className="text-lg font-bold text-white mb-1 truncate">
                            {latestCV ? `CV for ${latestCV.jobTitle || 'General Application'}` : 'No CVs yet'}
                          </h3>
                          <p className="text-sm text-gray-400 mb-6">
                            {latestCV ? new Date(latestCV.createdAt).toLocaleDateString() : 'Create your first CV to see it here.'}
                          </p>

                          {latestCV ? (
                            <Link href={`/cvs/${latestCV.id}`} className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                              Open PDF Editor <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          ) : (
                            <Link href="/cvs/new" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                              Create Now <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Latest Job Card */}
                      <div className="group/card relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl p-1 border border-white/10 overflow-hidden hover:border-purple-500/30 transition-colors">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        <div className="bg-[#151925] rounded-lg p-5 h-full min-h-[180px] flex flex-col justify-between relative z-10">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                                <Briefcase className="w-6 h-6" />
                              </div>
                              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold bg-white/5 px-2 py-1 rounded">Last Analyzed Job</span>
                            </div>

                            {latestJob ? (
                              <>
                                <h3 className="text-lg font-bold text-white mb-2 truncate" title={latestJob.title || 'Untitled Position'}>
                                  {latestJob.title || 'Untitled Position'}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                  <span className="text-sm text-gray-400 flex items-center gap-1">
                                    {latestJob.company || 'Unknown Company'}
                                  </span>
                                  {latestJob.matchScore !== undefined && (
                                    <>
                                      <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                      <span className={`text-xs px-2 py-0.5 rounded-full border ${latestJob.matchScore >= 80 ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                          latestJob.matchScore >= 50 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        Match: {latestJob.matchScore}%
                                      </span>
                                    </>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <h3 className="text-lg font-bold text-white mb-2">No Jobs Analyzed</h3>
                                <p className="text-sm text-gray-400 mb-2">Analyze a job description to get tailored advice.</p>
                              </>
                            )}
                          </div>

                          <div className="mt-2">
                            {latestJob ? (
                              <Link href={`/jobs/${latestJob.id}`} className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors group-hover/card:translate-x-1 duration-200">
                                View Analysis <ArrowRight className="w-4 h-4 ml-1" />
                              </Link>
                            ) : (
                              <Link href="/jobs/new" className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors group-hover/card:translate-x-1 duration-200">
                                Analyze Job <ArrowRight className="w-4 h-4 ml-1" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Fallback / Static Mockup for Unauthenticated Users
                    <div className="grid md:grid-cols-3 gap-8">
                      {/* Sidebar Mock */}
                      <div className="bg-white/5 rounded-lg p-6 border border-white/5 flex flex-col gap-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="h-2 w-20 bg-white/10 rounded" />
                        </div>
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-10 w-full bg-white/5 rounded-lg border border-white/5" />
                        ))}
                      </div>

                      {/* Main Feed Mock */}
                      <div className="col-span-2 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-medium text-sm">Senior Frontend Developer CV</span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">PDF</span>
                              </div>
                              <div className="h-3 w-32 bg-white/10 rounded" />
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                            Match: 98%
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 opacity-60">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="h-4 w-40 bg-white/20 rounded mb-2" />
                              <div className="h-3 w-20 bg-white/10 rounded" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-20 pt-10 border-t border-white/5">
              <p className="text-sm font-medium text-gray-500 mb-6 uppercase tracking-wider">Trusted by professionals from</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Simple Placeholders for Logos using Text */}
                <span className="text-xl font-bold font-serif text-white/40">Google</span>
                <span className="text-xl font-bold font-sans text-white/40">Spotify</span>
                <span className="text-xl font-bold font-mono text-white/40">Amazon</span>
                <span className="text-xl font-bold text-white/40">Microsoft</span>
                <span className="text-xl font-bold italic text-white/40">Netflix</span>
              </div>
            </div>

          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 px-6 relative bg-[#0F121C]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Power-Packed for Your Career</h2>
              <p className="text-gray-400 text-lg">Everything you need to stand out in a crowded market, powered by state-of-the-art AI.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div key={idx} className="group p-8 rounded-2xl bg-[#151925] border border-white/5 hover:border-white/10 transition-colors hover:bg-[#1a1f2e]">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Steps */}
        <section id="how-it-works" className="py-32 px-6 bg-[#0B0F19]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                  Your Dream Job is <br />
                  <span className="text-blue-500">Three Steps Away</span>
                </h2>
                <div className="space-y-12">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex gap-6 group">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full border border-blue-500/20 text-blue-500 font-mono font-bold flex items-center justify-center text-lg group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12">
                  <Link href="/auth/register" className="inline-flex items-center gap-3 text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                    Start Building Now <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-30" />
                <div className="relative bg-[#151925] border border-white/10 rounded-2xl p-8 rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                  {/* Abstract UI representation of the process */}
                  <div className="space-y-4">
                    <div className="h-32 bg-white/5 rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center text-center">
                      <FileText className="w-8 h-8 text-gray-500 mb-2" />
                      <span className="text-sm text-gray-400">Analysis in progress...</span>
                      <div className="w-full h-1 bg-gray-800 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-blue-500 w-2/3 animate-pulse" />
                      </div>
                    </div>
                    <div className="h-16 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center px-4 gap-4">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-blue-200">Skills Matched</span>
                    </div>
                    <div className="h-16 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center px-4 gap-4">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-blue-200">Keywords Optimized</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing / CTA */}
        <section id="pricing" className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F121C] to-[#0B0F19]" />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Simple Pricing, Unlimited Potential</h2>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-white/10 rounded-full transition-colors hover:bg-white/20 focus:outline-none"
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-blue-500 rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : ''}`} />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
                Yearly <span className="text-green-400 text-xs ml-1">(Save 45%)</span>
              </span>
            </div>

            <div className="bg-gradient-to-br from-[#1a1f2e] to-[#151925] border border-white/10 rounded-3xl p-10 md:p-14 shadow-2xl max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black font-bold px-4 py-1 rounded-full text-sm shadow-lg shadow-amber-500/20">
                MOST POPULAR
              </div>

              <div className="flex justify-center items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-white">
                  {billingCycle === 'monthly' ? '$15' : '$99'}
                </span>
                <span className="text-gray-400">
                  {billingCycle === 'monthly' ? '/mo' : '/yr'}
                </span>
              </div>

              {billingCycle === 'yearly' && (
                <p className="text-green-400 text-sm font-medium mb-6">
                  Billed annually (equals $8.25/mo)
                </p>
              )}

              <p className="text-gray-400 mb-8 mt-2">Unlock unlimited CV generations, premium templates, and priority AI access.</p>

              <ul className="space-y-4 mb-10 text-left">
                {[
                  'Unlimited Job-Specific CVs',
                  'Access to All Premium Templates',
                  'Advanced AI Keyword Optimization',
                  'Priority Processing',
                  'PDF & DOCX Export'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/pricing" className="block w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
                Get Started
              </Link>
              <p className="mt-4 text-xs text-gray-500">Free plan available. Cancel anytime.</p>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/5 bg-[#05080f] pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">ResuMatch AI</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Empowering professionals to land their dream jobs through intelligent, automated personal branding tools.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400">Features</a></li>
              <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400">Templates</a></li>
              <li><a href="#" className="hover:text-blue-400">Examples</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400">About</a></li>
              <li><a href="#" className="hover:text-blue-400">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2026 ResuMatch AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white"><span className="sr-only">Twitter</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
            <a href="#" className="text-gray-500 hover:text-white"><span className="sr-only">GitHub</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg></a>
          </div>
        </div>
      </footer>
    </div>
  );
}