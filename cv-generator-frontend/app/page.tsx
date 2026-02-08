'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
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
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  const stats = [
    { label: 'CVs Generated', value: '50,000+' },
    { label: 'Success Rate', value: '94%' },
    { label: 'Happy Users', value: '15,000+' },
    { label: 'Time Saved', value: '100k hrs' },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI analyzes job descriptions to extract key requirements, skills, and keywords automatically.',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Target,
      title: 'Perfect Job Match',
      description: 'Tailors your CV to match specific job requirements, highlighting relevant experience and skills.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate a professional, customized CV in under 30 seconds. No more hours of manual formatting.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Shield,
      title: 'ATS Optimized',
      description: 'Ensures your CV passes Applicant Tracking Systems with proper formatting and keyword optimization.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: FileCheck,
      title: 'Multiple Templates',
      description: 'Choose from professionally designed templates that suit different industries and job levels.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Download,
      title: 'Export Anywhere',
      description: 'Download your CV in PDF, DOCX, or other formats. Print-ready and digital-friendly.',
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Your Information',
      description: 'Add your work experience, education, skills, and achievements to your profile.',
    },
    {
      number: '02',
      title: 'Paste Job Description',
      description: 'Copy the job posting you\'re interested in. Our AI will analyze the requirements.',
    },
    {
      number: '03',
      title: 'Generate & Download',
      description: 'Get a perfectly tailored CV in seconds. Download and apply with confidence.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'Tech Corp',
      content: 'I got 3x more interview callbacks after using this AI CV generator. The job-specific optimization really works!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Manager',
      company: 'StartupXYZ',
      content: 'Saved me hours of work for each application. The ATS optimization helped me land my dream job.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Designer',
      company: 'Design Studio',
      content: 'The templates are beautiful and professional. Finally, a CV tool that understands what recruiters want.',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-700 text-sm font-medium mb-8 shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>Trusted by 15,000+ professionals worldwide</span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                Land Your Dream Job with
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  AI-Powered CVs
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Stop sending generic resumes. Our AI analyzes job descriptions and creates perfectly tailored CVs that get you noticed by recruiters.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link
                  href={isAuthenticated ? "/dashboard" : "/auth/register"}
                  className="group w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 flex items-center justify-center gap-2"
                >
                  Start Creating for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-full hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  See How It Works
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative mx-auto max-w-6xl mt-20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-3xl opacity-20" />
              <div className="relative rounded-2xl bg-gradient-to-b from-gray-900/5 to-gray-900/10 p-3 ring-1 ring-inset ring-gray-900/10">
                <div className="rounded-xl bg-white shadow-2xl overflow-hidden border border-gray-200 aspect-[16/10]">
                  <div className="p-12 text-center bg-gradient-to-br from-gray-50 to-white w-full h-full flex flex-col items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-2xl opacity-20" />
                      <Layout className="relative w-24 h-24 text-gray-300 mb-4" />
                    </div>
                    <p className="text-gray-400 font-medium text-lg">Dashboard Interface Preview</p>
                    <p className="text-gray-400 text-sm mt-2">Intuitive & Powerful CV Creation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Everything You Need to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Stand Out</span>
              </h2>
              <p className="text-xl text-gray-600">
                Powerful AI features designed to give you the competitive edge in your job search.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-white border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Three Simple Steps to Success
              </h2>
              <p className="text-xl text-gray-600">
                Creating a job-winning CV has never been easier. Just follow these steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 -z-10"
                      style={{ width: 'calc(100% - 3rem)' }}
                    />
                  )}
                  <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-600 transition-all duration-300 hover:shadow-xl">
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                Loved by Job Seekers Everywhere
              </h2>
              <p className="text-xl text-gray-600">
                See what our users have to say about their success stories.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Job Search?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who have already landed their dream jobs with our AI-powered CV generator.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="group w-full sm:w-auto px-10 py-5 text-lg font-bold text-blue-600 bg-white rounded-full hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started Now - It's Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="mt-6 text-blue-100 text-sm">
              No credit card required • Create unlimited CVs • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-white shadow-sm">
                  <Image
                    src="/logo.png"
                    alt={APP_NAME}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-white">{APP_NAME}</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Empowering job seekers with AI-powered tools to create professional, ATS-optimized CVs that stand out.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}