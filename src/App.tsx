import { useState, useEffect } from 'react'
import CompanionWidget from './components/CompanionWidget'

interface Project {
  id: string
  name: string
  icon: string
  description: string
  tags: string[]
  featured?: boolean
  links?: { label: string; url: string }[]
}

interface LogEntry {
  date: string
  title: string
  description: string
}

const projects: Project[] = [
  {
    id: 'ponti',
    name: 'Ponti Verify',
    icon: '🌉',
    description: 'Creator economy platform reducing payment uncertainty between creators and brands. Features escrow, AI agents, verification, and automated workflows.',
    tags: ['AI Agents', 'Escrow', 'Creator Economy', 'Automation'],
    featured: true,
    links: [
      { label: 'Learn more', url: '#' },
      { label: 'GitHub', url: '#' }
    ]
  },
  {
    id: 'plintcart',
    name: 'PlintCart',
    icon: '🛒',
    description: 'Mobile-first e-commerce platform for local merchants with product catalogs, carts, checkout, inventory, order tracking, and M-Pesa integration.',
    tags: ['E-commerce', 'Mobile', 'Payments', 'React'],
    links: [
      { label: 'View project', url: '#' },
      { label: 'GitHub', url: '#' }
    ]
  },
  {
    id: 'mental-baddie',
    name: 'Mental Baddie',
    icon: '🧠',
    description: 'AI-based mental wellness concept designed around accessible conversational support and tools for community settings.',
    tags: ['AI', 'Mental Health', 'Conversational UI'],
    links: [
      { label: 'Concept', url: '#' }
    ]
  },
  {
    id: 'promptagro',
    name: 'PromptAgro',
    icon: '🌱',
    description: 'AI agriculture project with FastAPI, JavaScript, multilingual AI capabilities, and image generation tooling.',
    tags: ['AI', 'Agriculture', 'FastAPI', 'Multilingual'],
    links: [
      { label: 'Explore', url: '#' }
    ]
  }
]

const logEntries: LogEntry[] = [
  {
    date: 'Today',
    title: 'Ponti Verify - Payment Flow Architecture',
    description: 'Mapping out the escrow state machine and brand approval workflows. Thinking about edge cases in creator-brand transactions.'
  },
  {
    date: 'Yesterday',
    title: 'Build Vlog #1 - Planning',
    description: 'Scripted the first Ponti build vlog covering the initial architecture decisions and why I chose this tech stack.'
  },
  {
    date: '2 days ago',
    title: 'Cloud Infrastructure Deep Dive',
    description: 'Experimenting with serverless patterns on Google Cloud. Testing cold start performance for API endpoints.'
  }
]

const thinkingTopics = [
  'How can AI agents reduce friction in creator-brand payments?',
  'What does "shipping in public" really mean for building trust?',
  'The intersection of cloud infrastructure and creator tools',
  'Why Go might be worth learning for systems thinking'
]

export default function App() {
  const [mounted, setMounted] = useState(false)
  const [companionOpen, setCompanionOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero fade-in">
        <img 
          src="/angel_char-nobg.png" 
          alt="Tiffany's digital companion character"
          className="hero-character"
          onError={(e) => {
            // Fallback if image doesn't exist yet
            e.currentTarget.style.display = 'none'
          }}
        />
        <h1>Hey, I'm Tiffany</h1>
        <p className="hero-tagline">
          AI + Cloud Builder for the Creator Economy. 
          I build Ponti Verify, ship code in public, and document the journey.
        </p>
        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary">
            See what I'm building →
          </a>
          <a href="#content" className="btn btn-secondary">
            Read the build logs
          </a>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="nav-section fade-in">
        <h2 className="section-title">Current Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className={`project-card ${project.featured ? 'featured' : ''}`}
            >
              <div className="project-icon">{project.icon}</div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              {project.links && (
                <div className="project-links">
                  {project.links.map((link, i) => (
                    <a key={i} href={link.url} className="link-btn">
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content Log Section */}
        <div id="content" className="content-log">
          <h2 style={{ margin: '0 0 24px', color: 'var(--text-primary)' }}>
            📝 Ponti Build Log
          </h2>
          {logEntries.map((entry, i) => (
            <div key={i} className="log-entry">
              <div className="log-date">{entry.date}</div>
              <div className="log-content">
                <h4>{entry.title}</h4>
                <p>{entry.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Currently Thinking Section */}
        <div className="thinking-section">
          <h2 className="section-title">Currently Thinking About...</h2>
          <div className="thinking-grid">
            {thinkingTopics.map((topic, i) => (
              <div key={i} className="thinking-card">
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#" className="footer-link">GitHub</a>
          <a href="#" className="footer-link">Twitter</a>
          <a href="#" className="footer-link">LinkedIn</a>
          <a href="#" className="footer-link">Email</a>
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          Built with ☕, curiosity, and too much late-night coding.
        </p>
        <p style={{ margin: '8px 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
          © {new Date().getFullYear()} Tiffany · Ponti Build Lab
        </p>
      </footer>

      {/* AI Companion Widget */}
      <CompanionWidget 
        isOpen={companionOpen} 
        onClose={() => setCompanionOpen(false)} 
      />
    </div>
  )
}
