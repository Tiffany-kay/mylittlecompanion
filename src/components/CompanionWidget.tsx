import { useState } from 'react'

interface Message {
  id: string
  text: string
  isSystem?: boolean
}

interface CompanionWidgetProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hey builder! I'm your Ponti companion. Ask me about the projects, get accountability check-ins, or just vent when the code won't compile.",
    isSystem: true
  }
]

const quickPrompts = [
  "What's the next step on Ponti?",
  "Help me break down a big task",
  "Accountability check-in",
  "Explain this project to a visitor"
]

export default function CompanionWidget({ isOpen, onClose, onOpen }: CompanionWidgetProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue
    }

    setMessages(prev => [...prev, newUserMessage])
    setInputValue('')

    setTimeout(() => {
      const responses = [
        "Let me think about that...",
        "Great question! Here's what I'm thinking:",
        "I notice you're diving deep today. What's the one thing that would move the needle?",
        "Before we go further - have you shipped the APPROVED response state yet?"
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: randomResponse
      }])
    }, 800)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt)
  }

  if (!isOpen) {
    return (
      <div className="companion-widget">
        <button 
          className="companion-btn"
          onClick={onOpen}
          aria-label="Open AI Companion"
        >
          👁️
        </button>
        <span className="companion-tooltip">
          Your companion is watching... click to chat
        </span>
      </div>
    )
  }

  return (
    <div className="companion-modal-overlay" onClick={onClose}>
      <div className="companion-modal" onClick={e => e.stopPropagation()}>
        <div className="companion-header">
          <h3>
            <span>👁️</span> Ponti Companion
          </h3>
          <button 
            className="companion-close"
            onClick={onClose}
            aria-label="Close companion"
          >
            ×
          </button>
        </div>

        <div className="companion-body">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`companion-message ${message.isSystem ? 'system' : ''}`}
            >
              {message.text}
            </div>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <p style={{ 
              margin: '0 0 12px', 
              fontSize: '0.85rem', 
              color: 'var(--text-secondary)',
              fontWeight: 500
            }}>
              Quick prompts:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickPrompt(prompt)}
                  style={{
                    background: 'var(--espresso-light)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.background = 'rgba(255, 107, 157, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.background = 'var(--espresso-light)'
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="companion-input-area">
          <input
            type="text"
            className="companion-input"
            placeholder="Ask anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend()
            }}
          />
          <button 
            className="companion-send"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
