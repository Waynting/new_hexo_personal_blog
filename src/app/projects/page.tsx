import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent } from '@/components/ui/section';
import { ExternalLink, Globe, Camera, Code, Database, Rocket } from 'lucide-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { FlipCard } from '@/components/ui/flip-card';

export const metadata: Metadata = {
  title: 'Projects - Wei-Ting Liu',
  description: 'Portfolio of web development, AI/ML, and product engineering projects by Wei-Ting Liu.',
};

export default function ProjectsPage() {
  const projects = [
    {
      title: "Price Test Smalltool",
      company: "ABConvert",
      description: "Interactive pricing simulator for e-commerce A/B testing",
      longDescription: "Built with Next.js + TypeScript + Tailwind + Vercel. Shows how pricing impacts conversion, revenue, and profit. Supports manual inputs + CSV upload, COGS/fees/shipping cost model, OEC optimization, and quick recommendations. Designed as a pre-sales/education tool to explain when/why to run real A/B tests.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts", "Vercel"],
      links: {
        live: "https://price-test-smalltool.vercel.app/",
        github: "https://github.com/wen5928/price_test_smalltool"
      },
      icon: <Rocket className="w-5 h-5" />,
      featured: true
    },
    {
      title: "Waynspace - Personal Website",
      description: "Modern blog platform with MDX and Cloudflare R2",
      longDescription: "Next.js 16 + MDX + Cloudflare R2. Built a modern blog platform with static site generation, automated image processing (WebP conversion), and R2 CDN integration. Features include dynamic sitemap, SEO optimization, Google Analytics 4, and build-time local image processing with automatic upload to R2.",
      technologies: ["Next.js 16", "TypeScript", "MDX", "Cloudflare R2", "Tailwind CSS v4", "Sharp", "AWS SDK"],
      links: {
        live: "https://waynspace.com",
        github: "https://github.com/Waynting/new_hexo_personal_blog"
      },
      icon: <Globe className="w-5 h-5" />,
      featured: true
    },
    {
      title: "Nojo Apps Official Website",
      company: "Nojo apps",
      role: "CTO",
      description: "Official website for student schedule & activity-matching app",
      longDescription: "Led official website build and non-technical operations including branding, community management, and documentation. Contributed to product goals/roadmap for a student-focused scheduling platform.",
      technologies: ["Next.js", "React", "Tailwind CSS", "Vercel"],
      links: {
        live: "https://nojo-official.vercel.app/zh-TW"
      },
      icon: <Code className="w-5 h-5" />
    },
    {
      title: "Camera Drift NTU",
      role: "Organizer/Photographer",
      description: "Cross-campus photo program with exhibition platform",
      longDescription: "Designed and ran a cross-campus photo program including logistics, onboarding, and digital exhibition. Built web platform to showcase participant work and stories. Sharpened composition + accessibility + storytelling skills used in UI work.",
      technologies: ["Photography", "Web Design", "Community Building", "Exhibition Curation"],
      links: {
        live: "/camera-drift-ntu"
      },
      icon: <Camera className="w-5 h-5" />
    }
  ];

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <>
      {/* Hero Section */}
      <Section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <SectionHeader className="mb-16 text-center">
          <SectionTitle className="text-4xl sm:text-5xl md:text-6xl">
            Projects & Skills
          </SectionTitle>
          <SectionDescription className="text-xl mt-6 max-w-3xl mx-auto">
            Showcase of my technical skills, programming expertise, and real-world projects.
            From interactive web applications to AI-powered solutions.
          </SectionDescription>
        </SectionHeader>
      </Section>

      {/* Skills Showcase Section */}
      <Section className="py-16">
        <SectionHeader className="mb-16">
          <SectionTitle>Technical Skills</SectionTitle>
          <SectionDescription>
            Interactive skill cards showcasing my technical expertise and related projects
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Frontend Development */}
            <FlipCard
              frontContent={{
                icon: "🎨",
                title: "Frontend Development",
                subtitle: "Modern user interface design & development",
                gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
                textColor: "text-white"
              }}
              backContent={{
                description: "Specialized in modern frontend frameworks and technologies, committed to creating beautiful and functional user interfaces. Experienced in responsive design, performance optimization, and user experience design.",
                skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "JavaScript"],
                projects: [
                  { name: "Personal Website Project", url: "/posts" },
                  { name: "Price Testing Tool", url: "https://price-test-smalltool.vercel.app/" }
                ],
                gradient: ""
              }}
            />

            {/* Backend Development */}
            <FlipCard
              frontContent={{
                icon: "⚙️",
                title: "Backend Development",
                subtitle: "Server-side logic & database design",
                gradient: "bg-gradient-to-br from-green-500 to-green-600",
                textColor: "text-white"
              }}
              backContent={{
                description: "Experienced in server-side development and API design, familiar with database design and system architecture planning. Focused on building stable and scalable backend services.",
                skills: ["Node.js", "Python", "REST API", "GraphQL", "PostgreSQL", "MongoDB", "Redis"],
                projects: [
                  { name: "MDX Blog with R2 CDN", url: "/posts" },
                  { name: "RAG Knowledge Agent", url: "#" }
                ],
                gradient: ""
              }}
            />

            {/* AI/ML & Data */}
            <FlipCard
              frontContent={{
                icon: "🤖",
                title: "AI/ML & Data",
                subtitle: "AI applications & data analysis",
                gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
                textColor: "text-white"
              }}
              backContent={{
                description: "Experienced in AI/ML applications, RAG systems, and data analysis. Focus on practical applications of AI technology in real-world scenarios.",
                skills: ["OpenAI API", "RAG Systems", "Data Analysis", "Vector DB", "Prompt Engineering", "Python", "SQL"],
                projects: [
                  { name: "Knowledge Retrieval Agent", url: "#" },
                  { name: "Price Optimization Tool", url: "https://price-test-smalltool.vercel.app/" }
                ],
                gradient: ""
              }}
            />

            {/* DevOps & Tools */}
            <FlipCard
              frontContent={{
                icon: "🛠️",
                title: "DevOps & Tools",
                subtitle: "Modern development environment & deployment",
                gradient: "bg-gradient-to-br from-orange-500 to-red-500",
                textColor: "text-white"
              }}
              backContent={{
                description: "Familiar with modern development toolchain and deployment processes, including version control, automated testing, continuous integration, and cloud deployment practices.",
                skills: ["Git", "GitHub Actions", "Docker", "Vercel", "AWS", "Linux", "VS Code"],
                projects: [
                  { name: "Automated Deployment Pipeline", url: "https://github.com/Waynting" },
                  { name: "Development Environment Setup", url: "/posts" }
                ],
                gradient: ""
              }}
            />

            {/* Photography */}
            <FlipCard
              frontContent={{
                icon: "📸",
                title: "Photography",
                subtitle: "Visual creation & post-processing skills",
                gradient: "bg-gradient-to-br from-cyan-500 to-blue-500",
                textColor: "text-white"
              }}
              backContent={{
                description: "Skilled in street photography, portraits, and landscape photography with rich experience and post-processing expertise. Integrating photography aesthetics into web design for visual impact.",
                skills: ["Street Photography", "Portrait Photography", "Landscape Photography", "Lightroom", "Photoshop", "Color Grading", "Composition"],
                projects: [
                  { name: "Photography Portfolio", url: "/capture-light" },
                  { name: "Camera Drift Project", url: "/camera-drift-ntu" }
                ],
                gradient: ""
              }}
            />

            {/* UI/UX Design */}
            <FlipCard
              frontContent={{
                icon: "🎭",
                title: "UI/UX Design",
                subtitle: "User experience & interface design",
                gradient: "bg-gradient-to-br from-pink-500 to-rose-500",
                textColor: "text-white"
              }}
              backContent={{
                description: "Equipped with user experience design thinking, familiar with interface design principles and interaction design. Focus on user needs analysis and design process planning.",
                skills: ["User Research", "Prototyping", "Interface Design", "Interaction Design", "Design Systems", "Accessibility", "Responsive Design"],
                projects: [
                  { name: "Design System Construction", url: "/projects" },
                  { name: "UX Case Studies", url: "/posts" }
                ],
                gradient: ""
              }}
            />
          </div>
        </SectionContent>
      </Section>

      {/* Featured Projects */}
      <Section className="py-16">
        <SectionHeader className="mb-16">
          <SectionTitle>Featured Projects</SectionTitle>
          <SectionDescription>
            Production-ready applications deployed and actively used
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <div className="grid gap-8 lg:grid-cols-2">
            {featuredProjects.map((project) => (
              <Card key={project.title} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 bg-muted rounded-lg">
                      {project.icon}
                    </div>
                    <div className="flex gap-2">
                      {project.links.github && (
                        <Button asChild size="icon" variant="ghost">
                          <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                            <GitHubLogoIcon className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {project.links.live && (
                        <Button asChild size="icon" variant="ghost">
                          <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardTitle>{project.title}</CardTitle>
                  {project.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {project.company}
                      </Badge>
                      {project.role && <span className="text-xs">· {project.role}</span>}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {project.longDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionContent>
      </Section>

      {/* Other Projects */}
      <Section className="py-16">
        <SectionHeader className="mb-16">
          <SectionTitle>Other Projects</SectionTitle>
          <SectionDescription>
            Leadership roles and community initiatives
          </SectionDescription>
        </SectionHeader>
        <SectionContent>
          <div className="grid gap-6 md:grid-cols-2">
            {otherProjects.map((project) => (
              <Card key={project.title}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      {project.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      {project.role && (
                        <CardDescription>{project.role}</CardDescription>
                      )}
                    </div>
                    {project.links.live && (
                      <Button asChild size="icon" variant="ghost">
                        <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {project.longDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionContent>
      </Section>

      {/* Awards & Recognition */}
      <Section className="py-16">
        <SectionHeader className="mb-16">
          <SectionTitle>Awards & Recognition</SectionTitle>
        </SectionHeader>
        <SectionContent>
          <Card>
            <CardHeader>
              <CardTitle>PDAO Competition 2025</CardTitle>
              <CardDescription>Programming Design And Optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge className="text-sm">5th Overall</Badge>
                <Badge variant="secondary" className="text-sm">1st in Department (IM)</Badge>
              </div>
            </CardContent>
          </Card>
        </SectionContent>
      </Section>

      {/* Call to Action */}
      <Section className="py-16">
        <SectionContent className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-semibold mb-4">Let's Build Something Together</h3>
              <p className="text-muted-foreground mb-6">
                I'm always interested in working on meaningful projects that push boundaries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a href="mailto:wayntingliu@gmail.com">
                    Get in Touch
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/posts">
                    Read My Blog
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </SectionContent>
      </Section>
    </>
  );
}

