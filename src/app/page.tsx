import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent } from '@/components/ui/section';
import { Badge } from '@/components/ui/badge';
import { TypingText } from '@/components/ui/typing-text';
import { LevelSkillCard, CollapsibleSkillCard } from '@/components/ui/skill-card';
import { generateStructuredData } from '@/lib/seo';
import { Download, Mail } from 'lucide-react';

export default function Home() {
  const structuredData = generateStructuredData('person', {
    sameAs: [
      'https://github.com/Waynting',
      'https://www.instagram.com/waiting_941208',
    ],
    jobTitle: 'Information Management Student',
    worksFor: {
      '@type': 'Organization',
      'name': 'National Taiwan University'
    }
  });

  // 使用分層技能展示（方案一）
  const skillsWithLevel = {
    "Frontend Development": [
      { name: "React", level: "advanced" as const },
      { name: "Next.js", level: "advanced" as const },
      { name: "TypeScript", level: "advanced" as const },
      { name: "JavaScript", level: "expert" as const },
      { name: "HTML5", level: "expert" as const },
      { name: "CSS3", level: "expert" as const },
      { name: "Tailwind CSS", level: "advanced" as const },
      { name: "shadcn/ui", level: "intermediate" as const },
    ],
    "Backend & Data": [
      { name: "Node.js", level: "intermediate" as const },
      { name: "Python", level: "intermediate" as const },
      { name: "REST API", level: "advanced" as const },
      { name: "GraphQL", level: "intermediate" as const },
      { name: "SQL", level: "intermediate" as const },
      { name: "PostgreSQL", level: "beginner" as const },
    ],
  };

  // 使用可折疊展示（方案二）
  const allSkills = {
    "Programming Languages": ["JavaScript", "TypeScript", "Python", "C++", "HTML5", "CSS3", "SQL"],
    "Frameworks & Libraries": ["React", "Next.js (App Router)", "Node.js", "Express.js", "Tailwind CSS", "shadcn/ui", "React Query", "SWR"],
    "Tools & Technologies": ["Git", "GitHub", "Vercel", "Docker", "VS Code", "Figma", "Linux", "WordPress Headless"],
    "AI & Data": ["OpenAI API", "RAG Systems", "Embedding Models", "Prompt Engineering", "Data Analysis", "CUPED", "A/B Testing"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hero Section with Profile Image */}
      <Section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Gradient background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,119,198,0.05),transparent_50%)]" />
        
        <SectionContent className="relative z-10 text-center max-w-5xl mx-auto px-6 py-16">
          {/* Profile Image with glow effect */}
          <div className="mb-14">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="relative border-3 border-border/50 rounded-full p-1.5 bg-background/80 backdrop-blur-sm">
                <div className="bg-background rounded-full h-full w-full overflow-hidden shadow-2xl">
                  <Image 
                    src="/LIU_0457.jpg" 
                    alt="Wayn Liu profile photo"
                    width={224}
                    height={224}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Title with gradient effect and typing animation */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-foreground tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              <TypingText 
                text="Wei-Ting Liu"
                delay={1500}
                speed={120}
                showCursor={true}
              />
            </span>
          </h1>
          
          <div className="space-y-6 mb-14">
            {/* Animated tagline */}
            <p className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground/90">
              Building the Future, One Line at a Time
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground/80">
              Information Management Student at NTU
            </p>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Full-stack developer specializing in Next.js, TypeScript, and AI-enhanced experiences. 
              Crafting performant, accessible, and delightful web applications.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="w-full sm:w-auto group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Link href="/posts">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Read My Articles
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Link href="/camera-drift-ntu">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Camera Drift Project
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <a href="/CV_WeiTing Liu.pdf" download="CV_WeiTing_Liu.pdf">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CV
              </a>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="flex justify-center gap-6">
            <a href="https://github.com/Waynting" target="_blank" rel="noopener noreferrer" className="group p-3 rounded-full border border-border/50 hover:border-foreground/20 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-110">
              <svg className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="sr-only">GitHub</span>
            </a>
            <a href="mailto:wayntingliu@gmail.com" className="group p-3 rounded-full border border-border/50 hover:border-foreground/20 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-110">
              <svg className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="sr-only">Email</span>
            </a>
            <a href="https://www.linkedin.com/in/waiting5928/" target="_blank" rel="noopener noreferrer" className="group p-3 rounded-full border border-border/50 hover:border-foreground/20 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-110">
              <svg className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="https://www.instagram.com/waiting_941208/" target="_blank" rel="noopener noreferrer" className="group p-3 rounded-full border border-border/50 hover:border-foreground/20 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-110">
              <svg className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.79-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </SectionContent>
      </Section>

      {/* About Section */}
      <Section className="py-16">
        <SectionHeader className="mb-16">
          <SectionTitle>About Me</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6 space-y-4 text-muted-foreground">
                <p className="text-lg">
                  I&apos;m a B.S. student in Information Management and the Trans-disciplinary Bachelor Program at NTU.
                  I approach problems at the intersection of software, data, and business.
                </p>
                <p>
                  I specialize in full-stack development (Next.js/React/TypeScript) and apply AI/ML pragmatically (RAG, experimentation, pricing). 
                  I also care about design—photography and UI/UX shape how I build fast, usable products.
                </p>
                <p className="text-sm italic">
                  Open to internship opportunities in SWE, AI/ML, and product engineering.
                </p>
              </CardContent>
            </Card>
          </div>
        </SectionContent>
      </Section>

      {/* Experience Section */}
      <Section className="py-16">
        <SectionHeader className="mb-16">
          <SectionTitle>Experience</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <div className="space-y-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>ABConvert — Startup Generalist Summer Intern</CardTitle>
                    <CardDescription>Product/AI · Shopify A/B Testing SaaS</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    2025 – Present
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="list-disc list-inside space-y-2">
                  <li>Built an A/B <b>Price Testing Tool</b> (Next.js 15, TypeScript, Recharts) with dual-slider UI and CSV ingestion</li>
                  <li>Shipped experimentation UI for pricing: A/B instrumentation, always-valid monitoring, CUPED variance reduction</li>
                  <li>Authored spec for Experiment Design Wizard: proposes variants, sample sizes, monitoring boundaries based on goals</li>
                  <li>Explored pricing analytics: elasticity modeling, uplift/heterogeneous treatment effects for targeting</li>
                  <li>Built internal RAG knowledge agent to answer product/experimentation questions from company docs</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Nojo apps — CTO</CardTitle>
                    <CardDescription>Student schedule & activity-matching app</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    2025 – Present
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Led official website build and non-technical operations (branding, community, documentation). 
                Contributed to product goals/roadmap.</p>
              </CardContent>
            </Card>
          </div>
        </SectionContent>
      </Section>

      {/* Education Section */}
      <Section className="py-16">
        <SectionHeader className="mb-16">
          <SectionTitle>Education</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <div className="space-y-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>National Taiwan University</CardTitle>
                <CardDescription>The Best University in Taiwan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">B.B.A. in Information Management</p>
                  <p className="text-sm">2024–2028 (expected) · Relevant coursework: Data Structures & Algorithms, Web Systems</p>
                </div>
                <div className="border-t pt-3">
                  <p className="font-medium text-foreground">Double Major: Trans-disciplinary Bachelor Program</p>
                  <p className="text-sm">2025–2028 (expected) · Focus: Product innovation, design thinking, real-world practice</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </SectionContent>
      </Section>

      {/* Skills Section */}
      <Section className="py-16">
        <SectionHeader className="mb-16">
          <SectionTitle>Technical Skills</SectionTitle>
          <SectionDescription>
            Hover over skill badges to see proficiency levels
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          {/* 方案一：分層展示主要技能 */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-6 text-center">Core Competencies</h3>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {Object.entries(skillsWithLevel).map(([category, skills]) => (
                <LevelSkillCard 
                  key={category} 
                  category={category} 
                  skills={skills} 
                />
              ))}
            </div>
          </div>

          {/* 方案二：可折疊展示完整技能 */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-center">All Skills & Technologies</h3>
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
              {Object.entries(allSkills).map(([category, skills]) => (
                <CollapsibleSkillCard 
                  key={category} 
                  category={category} 
                  skills={skills} 
                />
              ))}
            </div>
          </div>
        </SectionContent>
      </Section>

      {/* Call to Action Section */}
      <Section className="py-16" id="contact">
        <SectionHeader className="mb-16 text-center">
          <SectionTitle>Let&apos;s Connect</SectionTitle>
          <SectionDescription>
            I&apos;m available for internships in Summer 2026 (10-12 weeks, late June start)
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group">
              <a href="mailto:wayntingliu@gmail.com">
                <Mail className="mr-2 h-4 w-4" /> Get in Touch
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                View My Projects
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="/CV_WeiTing Liu.pdf" download="CV_WeiTing_Liu.pdf">
                <Download className="mr-2 h-4 w-4" /> Download CV
              </a>
            </Button>
          </div>
        </SectionContent>
      </Section>

    </>
  );
}
