
import { useState } from 'react'
import {
  ArrowRight,
  HeartPulse,
  Mail,
  MessageCircle,
  Hospital,
  UserRound,
  Send,
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import './ContactUs.css'

const initialFormData = {
  fullName: '',
  email: '',
  category: '',
  subject: '',
  message: '',
}

const supportOptions = [
  {
    icon: UserRound,
    title: 'Donor support',
    description:
      'Need help with your donor account, availability, or donation requests?',
  },
  {
    icon: Hospital,
    title: 'Hospital support',
    description:
      'Questions about hospital verification, blood requests, or inventory?',
  },
  {
    icon: MessageCircle,
    title: 'General enquiries',
    description:
      'Have feedback, suggestions, or questions about BloodBridge?',
  },
]

export default function ContactUs({ onSubmitMessage }) {
  const [formData, setFormData] = useState(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({
    type: '',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (feedback.message) {
      setFeedback({ type: '', message: '' })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)
    setFeedback({ type: '', message: '' })

    try {
      if (onSubmitMessage) {
        await onSubmitMessage(formData)
      } else {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              'Unable to send your message. Please try again.',
          )
        }
      }

      setFormData(initialFormData)
      setFeedback({
        type: 'success',
        message:
          'Your message has been sent successfully. Thank you for contacting BloodBridge.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="contact-page">
      {/* Header
      <header className="contact-page__header">
        <a className="contact-page__brand" href="/" aria-label="BloodBridge home">
          <span className="contact-page__brand-icon">
            <HeartPulse size={23} strokeWidth={2.2} />
          </span>
          <span>
            Blood<span>Bridge</span>
          </span>
        </a>

        <nav className="contact-page__nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a
            href="/contact"
            className="contact-page__nav-active"
            aria-current="page"
          >
            Contact
          </a>
        </nav>

        <a className="contact-page__header-cta" href="/sign-in">
          Get Started <ArrowRight size={16} />
        </a>
      </header> */}

      {/* Page introduction */}
      <section className="contact-page__hero">
        <span className="contact-page__eyebrow">
          <MessageCircle size={15} />
          WE'RE HERE TO HELP
        </span>

        <h1>
          Let's make every
          <br />
          <span>connection count.</span>
        </h1>

        <p>
          Have a question about donating blood, requesting blood, or using
          BloodBridge? Send us a message and our team will help you find the
          right direction.
        </p>
      </section>

      {/* Contact content */}
      <section className="contact-page__content" id="contact-form">
        <div className="contact-page__main">
          <div className="contact-page__section-heading">
            <h2>Send us a message</h2>
            <p>
              Fill out the form below. Fields marked with an asterisk are
              required.
            </p>
          </div>

          <form
            className="contact-page__form"
            onSubmit={handleSubmit}
          >
            <div className="contact-page__field-row">
              <div className="contact-page__field">
                <label htmlFor="contact-full-name">
                  Full name <span>*</span>
                </label>
                <input
                  id="contact-full-name"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="contact-page__field">
                <label htmlFor="contact-email">
                  Email address <span>*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={254}
                />
              </div>
            </div>

            <div className="contact-page__field">
              <label htmlFor="contact-category">
                I am contacting you as <span>*</span>
              </label>
              <select
                id="contact-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="Donor">Blood donor</option>
                <option value="Patient">Patient or requester</option>
                <option value="Hospital">Hospital or blood bank</option>
                <option value="Partner">Partner or organisation</option>
                <option value="General">General enquiry</option>
              </select>
            </div>

            <div className="contact-page__field">
              <label htmlFor="contact-subject">
                Subject <span>*</span>
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="What can we help you with?"
                value={formData.subject}
                onChange={handleChange}
                required
                maxLength={150}
              />
            </div>

            <div className="contact-page__field">
              <label htmlFor="contact-message">
                Your message <span>*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell us a little more about your enquiry..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                minLength={10}
                maxLength={3000}
              />
              <span className="contact-page__character-count">
                {formData.message.length}/3000 characters
              </span>
            </div>

            <p className="contact-page__privacy-note">
              <ShieldCheck size={16} />
              Please do not include passwords, medical records, or other
              sensitive personal information in this form.
            </p>

            {feedback.message && (
              <div
                className={`contact-page__feedback contact-page__feedback--${feedback.type}`}
                role={feedback.type === 'error' ? 'alert' : 'status'}
                aria-live="polite"
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <button
              type="submit"
              className="contact-page__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending message...' : 'Send Message'}
              {!isSubmitting && <Send size={17} />}
            </button>

            <p className="contact-page__form-footer">
              Your enquiry will be handled with care.
            </p>
          </form>
        </div>

        {/* Support information */}
        <aside className="contact-page__sidebar">
          <div className="contact-page__support-intro">
            <div className="contact-page__support-icon">
              <HeartPulse size={24} />
            </div>
            <h2>How can we help?</h2>
            <p>
              Choose the type of assistance you need. We'll use your selection
              to direct your enquiry appropriately.
            </p>
          </div>

          <div className="contact-page__support-options">
            {supportOptions.map((option) => {
              const Icon = option.icon

              return (
                <article
                  className="contact-page__support-item"
                  key={option.title}
                >
                  <div className="contact-page__support-item-icon">
                    <Icon size={19} />
                  </div>

                  <div>
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="contact-page__info-card">
            <div className="contact-page__info-card-heading">
              <Clock size={18} />
              <h3>Before contacting us</h3>
            </div>

            <p>
              To help us assist you, describe the issue clearly and include
              your request reference number when relevant. Do not include
              private patient details.
            </p>
          </div>
        </aside>
      </section>

      {/* Emergency notice */}
      <section className="contact-page__emergency" aria-label="Emergency notice">
        <div className="contact-page__emergency-icon">
          <AlertCircle size={22} />
        </div>

        <div>
          <h2>Need blood urgently?</h2>
          <p>
            This contact form is not an emergency response service. For a
            life-threatening situation, contact your local emergency services
            or the nearest hospital immediately. Use BloodBridge's blood
            request feature for platform-based requests.
          </p>
        </div>

        <a href="/sign-in">
          Access BloodBridge <ArrowRight size={16} />
        </a>
      </section>

      {/* Footer */}
      <footer className="contact-page__footer">
        <a className="contact-page__footer-brand" href="/">
          <HeartPulse size={19} />
          BloodBridge
        </a>

        <p>
          Connecting people, donors, and healthcare providers when it matters
          most.
        </p>

        <span className="contact-page__copyright">
          © {new Date().getFullYear()} BloodBridge. All rights reserved.
        </span>
      </footer>
    </main>
  )
}
