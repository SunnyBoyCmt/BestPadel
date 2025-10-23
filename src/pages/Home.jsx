import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🚀</span>
              <span>Fastest Growing Sport</span>
            </div>
            <h1 className="hero-title">
              The Future of <span className="gradient-text">Padel</span> is Here
            </h1>
            <p className="hero-description">
              Experience the sport that's taking the world by storm. Professional tournaments, 
              smart courts, and AI coaching - all in one platform.
            </p>
            
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-number">25M+</div>
                <div className="stat-label">Players Worldwide</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">95%</div>
                <div className="stat-label">Retention Rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">2028</div>
                <div className="stat-label">Olympics Debut</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">$2.5B</div>
                <div className="stat-label">Market Value</div>
              </div>
            </div>
            
            <div className="hero-actions">
              <Link to="/americano" className="btn btn-primary">
                <span>🏆</span>
                Start Tournament
              </Link>
              <a href="#about" className="btn btn-outline">
                <span>ℹ️</span>
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2>What is Padel?</h2>
            <p>The fastest growing sport in the world</p>
          </div>
          <div className="about-content">
            <div className="about-text">
              <h3>Why Padel is Taking Over</h3>
              <p>
                Padel combines the best of tennis and squash in an exciting, social format. 
                With 25 million players worldwide and 40% annual growth, it's the sport 
                everyone is talking about.
              </p>
              <ul className="feature-list">
                <li>🏆 Easy to learn, fun to master</li>
                <li>👥 Perfect for all ages and skill levels</li>
                <li>🌍 Growing rapidly worldwide</li>
                <li>🏅 Coming to the 2028 Olympics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Section */}
      <section id="growth" className="growth">
        <div className="container">
          <div className="section-header">
            <h2>Explosive Growth</h2>
            <p>Padel is the fastest growing sport globally</p>
          </div>
          <div className="growth-stats">
            <div className="growth-card">
              <div className="growth-number">40%</div>
              <div className="growth-label">Annual Growth Rate</div>
            </div>
            <div className="growth-card">
              <div className="growth-number">25M+</div>
              <div className="growth-label">Active Players</div>
            </div>
            <div className="growth-card">
              <div className="growth-number">95%</div>
              <div className="growth-label">Player Retention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section id="investment" className="investment">
        <div className="container">
          <div className="section-header">
            <h2>Investment Opportunity</h2>
            <p>The next big thing in sports</p>
          </div>
          <div className="investment-content">
            <div className="investment-card">
              <h3>Market Value</h3>
              <div className="investment-value">$2.5B</div>
              <p>Global market size and growing</p>
            </div>
            <div className="investment-card">
              <h3>ROI Potential</h3>
              <div className="investment-value">300%+</div>
              <p>Expected returns in 3-5 years</p>
            </div>
            <div className="investment-card">
              <h3>Market Penetration</h3>
              <div className="investment-value">5%</div>
              <p>Current US market penetration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2>Get Started</h2>
            <p>Join the Padel revolution</p>
          </div>
          <div className="contact-content">
            <Link to="/americano" className="btn btn-primary btn-large">
              <span>🏆</span>
              Start Your Tournament
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
