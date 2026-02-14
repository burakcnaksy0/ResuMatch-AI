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
  ChevronRight,
  Crown,
  Infinity
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#181c24] via-[#232a36] to-[#10131a] text-white">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#181c24] via-[#232a36] to-[#10131a]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#232a36]/80 backdrop-blur-sm border border-blue-800 text-blue-300 text-sm font-medium mb-8 shadow-sm">
                <Sparkles className="w-4 h-4" />
                <span>15.000+ profesyonel tarafından güvenildi</span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                Hayalindeki İşi Kap!
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#a21caf]">
                  AI Destekli CV'lerle
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Sıradan CV'lere elveda! Yapay zeka ile iş ilanlarını analiz eden ve sana özel, öne çıkan CV'ler oluştur.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link
                  href={isAuthenticated ? "/dashboard" : "/auth/register"}
                  className="group w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#3b82f6] to-[#6366f1] rounded-full hover:from-[#2563eb] hover:to-[#4f46e5] transition-all duration-200 shadow-xl shadow-blue-900 hover:shadow-2xl hover:shadow-blue-800 flex items-center justify-center gap-2"
                >
                  Hemen Başla
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-blue-200 bg-[#232a36] border-2 border-[#3b82f6] rounded-full hover:border-[#6366f1] hover:bg-[#181c24] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  Nasıl Çalışır?
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative mx-auto max-w-6xl mt-20">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] rounded-3xl blur-3xl opacity-20" />
              <div className="relative rounded-2xl bg-gradient-to-b from-[#232a36]/60 to-[#10131a]/80 p-3 ring-1 ring-inset ring-[#232a36]">
                <div className="rounded-xl bg-[#181c24] shadow-2xl overflow-hidden border border-[#232a36]">
                  {isAuthenticated ? (
                    // Authenticated User - Show Dashboard Summary
                    <div className="p-8 bg-gradient-to-br from-[#232a36] to-[#181c24]">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#181c24] rounded-lg">
                            <Layout className="w-6 h-6 text-[#3b82f6]" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Dashboard Özeti</h3>
                            <p className="text-sm text-blue-200">Son aktiviteleriniz ve CV'leriniz</p>
                          </div>
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white text-sm font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#4f46e5] transition-all"
                        >
                          Dashboard'a Git
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-[#181c24] rounded-xl p-4 border border-[#232a36]">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-[#3b82f6]" />
                            <span className="text-xs text-blue-200">Toplam CV</span>
                          </div>
                          <p className="text-2xl font-bold text-white">12</p>
                        </div>
                        <div className="bg-[#181c24] rounded-xl p-4 border border-[#232a36]">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-[#6366f1]" />
                            <span className="text-xs text-blue-200">Profil</span>
                          </div>
                          <p className="text-2xl font-bold text-white">85%</p>
                        </div>
                        <div className="bg-[#181c24] rounded-xl p-4 border border-[#232a36]">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-blue-200">Bu Ay</span>
                          </div>
                          <p className="text-2xl font-bold text-white">5</p>
                        </div>
                        <div className="bg-[#181c24] rounded-xl p-4 border border-[#232a36]">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-blue-200">Başarı</span>
                          </div>
                          <p className="text-2xl font-bold text-white">94%</p>
                        </div>
                      </div>

                      {/* Recent CVs */}
                      <div>
                        <h4 className="text-sm font-semibold text-blue-200 mb-3">Son CV'lerim</h4>
                        <div className="space-y-2">
                          {[
                            { title: 'Senior Frontend Developer', company: 'TechCorp', time: '2 saat önce', status: 'active' },
                            { title: 'Full Stack Engineer', company: 'StartupXYZ', time: '1 gün önce', status: 'downloaded' },
                            { title: 'React Developer', company: 'Digital Agency', time: '3 gün önce', status: 'active' },
                          ].map((cv, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 bg-[#181c24] rounded-lg border border-[#232a36] hover:border-[#3b82f6] transition-colors group"
                            >
                              <FileText className="w-5 h-5 text-[#3b82f6] group-hover:text-white" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{cv.title}</p>
                                <p className="text-xs text-blue-200">{cv.company} • {cv.time}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                cv.status === 'downloaded'
                                  ? 'bg-green-900/30 text-green-300'
                                  : 'bg-blue-900/30 text-blue-300'
                              }`}>
                                {cv.status === 'downloaded' ? 'İndirildi' : 'Aktif'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Non-authenticated - Show Demo Preview
                    <div className="p-8 bg-gradient-to-br from-[#232a36] to-[#181c24]">
                      {/* Header */}
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#6366f1] rounded-2xl mb-4">
                          <Layout className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Dashboard Arayüz Önizlemesi</h3>
                        <p className="text-blue-200">Kolay & Güçlü CV Oluşturma</p>
                      </div>

                      {/* Demo Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-[#181c24] rounded-xl p-4 border border-[#232a36]">
                          <FileText className="w-5 h-5 text-[#3b82f6] mb-2" />
                          <p className="text-xs text-blue-200 mb-1">Toplam CV</p>
                          <p className="text-xl font-bold text-white">50K+</p>
                        </div>
                        <div className="bg-[#181c24] rounded-xl p-4 border border-[#232a36]">
                          <Sparkles className="w-5 h-5 text-[#6366f1] mb-2" />
                          <p className="text-xs text-blue-200 mb-1">Başarı Oranı</p>
                          <p className="text-xl font-bold text-white">94%</p>
                        </div>
                        <div className="bg-[#181c24] rounded-xl p-4 border border-[#232a36]">
                          <Users className="w-5 h-5 text-emerald-500 mb-2" />
                          <p className="text-xs text-blue-200 mb-1">Mutlu Kullanıcı</p>
                          <p className="text-xl font-bold text-white">15K+</p>
                        </div>
                        <div className="bg-[#181c24] rounded-xl p-4 border border-[#232a36]">
                          <Clock className="w-5 h-5 text-amber-500 mb-2" />
                          <p className="text-xs text-blue-200 mb-1">Zaman Tasarrufu</p>
                          <p className="text-xl font-bold text-white">100K saat</p>
                        </div>
                      </div>

                      {/* Demo Features List */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-[#181c24] rounded-lg border border-[#232a36]">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <p className="text-sm text-blue-100">AI ile iş ilanını analiz et ve özel CV oluştur</p>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-[#181c24] rounded-lg border border-[#232a36]">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <p className="text-sm text-blue-100">Profesyonel şablonlar ile ATS uyumlu CV'ler</p>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-[#181c24] rounded-lg border border-[#232a36]">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <p className="text-sm text-blue-100">Her iş başvurusu için özelleştirilmiş içerik</p>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-6 text-center">
                        <Link
                          href="/auth/register"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white font-semibold rounded-lg hover:from-[#2563eb] hover:to-[#4f46e5] transition-all"
                        >
                          Hemen Başla
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-[#181c24] relative">
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
                  className="group relative p-8 rounded-2xl bg-[#232a36] border border-[#232a36] hover:border-[#3b82f6] hover:shadow-2xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-blue-200 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-[#232a36] to-[#181c24]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                3 Kolay Adımda Başarı
              </h2>
              <p className="text-xl text-blue-200">
                İşe alımda öne çıkmak için CV oluşturmak hiç bu kadar kolay olmamıştı.
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
                  <div className="relative bg-[#232a36] rounded-2xl p-8 border-2 border-[#232a36] hover:border-[#3b82f6] transition-all duration-300 hover:shadow-xl">
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#3b82f6] to-[#6366f1] mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-blue-200 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-[#181c24]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                Kullanıcılarımızdan Yorumlar
              </h2>
              <p className="text-xl text-blue-200">
                Başarı hikayelerini ve kullanıcı deneyimlerini inceleyin.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-[#232a36] to-[#181c24] rounded-2xl p-8 border border-[#232a36] hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-blue-100 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-blue-200">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pro Membership Section */}
        <section className="py-24 bg-gradient-to-br from-[#232a36] via-[#1a1f2e] to-[#181c24] relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full mb-6">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">Premium Özellikler</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                Pro ile Sınırsız İmkanlar
              </h2>
              <p className="text-xl text-blue-200">
                Kariyerini bir üst seviyeye taşı. Sınırsız CV oluştur, tüm özelliklere eriş.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              {/* Free Plan - Comparison */}
              <div className="bg-[#232a36]/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#232a36]">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-white">$0</span>
                    <span className="text-blue-200">/süresiz</span>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-blue-200">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>3 iş bazlı CV (toplam limit)</span>
                  </li>
                  <li className="flex items-start gap-3 text-blue-200">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>1 profil bazlı CV (toplam limit)</span>
                  </li>
                  <li className="flex items-start gap-3 text-blue-200">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Temel şablonlar</span>
                  </li>
                  <li className="flex items-start gap-3 text-blue-200">
                    <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>ATS uyumlu format</span>
                  </li>
                </ul>
              </div>

              {/* Pro Plan - Highlighted */}
              <div className="relative bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20">
                {/* Popular badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-6 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Star className="w-4 h-4 fill-white" />
                    En Popüler
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-6 h-6 text-amber-400" />
                    <h3 className="text-2xl font-bold text-white">Pro Plan</h3>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-white">$15</span>
                    <span className="text-blue-200">/ay</span>
                    <span className="text-sm text-blue-300 ml-2">veya $99/yıl</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-white">
                    <div className="p-1 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full">
                      <Infinity className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold">Sınırsız CV oluşturma</span>
                  </li>
                  <li className="flex items-start gap-3 text-white">
                    <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Tüm premium şablonlar</span>
                  </li>
                  <li className="flex items-start gap-3 text-white">
                    <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Öncelikli AI işleme</span>
                  </li>
                  <li className="flex items-start gap-3 text-white">
                    <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Gelişmiş özelleştirme</span>
                  </li>
                  <li className="flex items-start gap-3 text-white">
                    <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>Premium destek</span>
                  </li>
                </ul>

                <Link
                  href="/pricing"
                  className="block w-full text-center px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Pro'ya Yükselt
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-center text-sm text-blue-200 mt-4">
                  Yıllık planda %33 tasarruf edin
                </p>
              </div>
            </div>

            {/* Quick Benefits */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-[#232a36]/40 backdrop-blur-sm rounded-xl border border-[#232a36]">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Infinity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sınırsız Oluşturma</h3>
                <p className="text-sm text-blue-200">İstediğin kadar CV oluştur, her iş için özelleştir</p>
              </div>
              <div className="text-center p-6 bg-[#232a36]/40 backdrop-blur-sm rounded-xl border border-[#232a36]">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Öncelikli İşleme</h3>
                <p className="text-sm text-blue-200">AI işlemlerinde öncelik, daha hızlı sonuçlar</p>
              </div>
              <div className="text-center p-6 bg-[#232a36]/40 backdrop-blur-sm rounded-xl border border-[#232a36]">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Premium Destek</h3>
                <p className="text-sm text-blue-200">Öncelikli müşteri desteği ve yardım</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#a21caf]" />
          <div className="absolute inset-0 opacity-20" />

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              İş Arayışını Dönüştürmeye Hazır mısın?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Binlerce profesyonel gibi, hayalindeki işe ulaşmak için hemen AI destekli CV oluşturucumuzu kullan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="group w-full sm:w-auto px-10 py-5 text-lg font-bold text-[#3b82f6] bg-white rounded-full hover:bg-gray-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center justify-center gap-2"
              >
                Hemen Başla - Ücretsiz
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="mt-6 text-blue-100 text-sm">
              Kredi kartı gerekmez • Sınırsız CV oluştur • İstediğin zaman iptal et
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#10131a] text-blue-200 py-16">
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
              <p className="text-blue-200 leading-relaxed max-w-md">
                Yapay zeka destekli araçlarla, profesyonel ve ATS uyumlu CV'ler oluşturmanı sağlıyoruz.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Ürün</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Şirket</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-blue-200">
              © {new Date().getFullYear()} {APP_NAME}. Tüm hakları saklıdır.
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