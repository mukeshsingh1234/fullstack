
import { useState } from "react";
import "./App.css";
import Admin from "./admin/Admin.jsx";

const services = [
  { number: "01", title: "Web Development", desc: "Modern, scalable and high-performance websites built for your business.", icon: "⌘" },
  { number: "02", title: "AI Solutions", desc: "Intelligent automation and AI-powered solutions for smarter workflows.", icon: "✳" },
  { number: "03", title: "UI/UX Design", desc: "Beautiful, intuitive digital experiences designed around your users.", icon: "◈" },
  { number: "04", title: "Digital Solutions", desc: "Technology-driven solutions that help your business grow.", icon: "↗" },
];

function App() {
  const path = window.location.pathname;

  // Admin login and dashboard routes
  if (path === "/admin" || path === "/admin/dashboard") {
    return <Admin />;
  }

  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice("");

    try {
      const response = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setNotice("Your project inquiry has been submitted successfully!");
      setForm({
        name: "",
        email: "",
        service: "",
        budget: "",
        timeline: "",
        message: "",
      });
    } catch (error) {
      setNotice(error.message || "Unable to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="website">
      <nav className="navbar">
        <a href="#home" className="brand">
          <span className="brand-icon">C</span>
          <span>cynbit<span className="brand-dot">.</span></span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#process">Process</a>
        </div>

        <a href="#contact" className="nav-cta">
          Let's Talk <span>↗</span>
        </a>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot"></span>
              DIGITAL INNOVATION STUDIO
            </div>

            <h1>
              We build digital
              <br />
              experiences that
              <br />
              <span>move businesses.</span>
            </h1>

            <p>
              We transform ambitious ideas into powerful digital products
              through technology, creativity and intelligent solutions.
            </p>

            <div className="hero-actions">
              <a href="#contact" className="primary-btn">
                Start a project <span>↗</span>
              </a>
              <a href="#services" className="secondary-btn">
                Explore services <span>↓</span>
              </a>
            </div>

            <div className="hero-note">
              <span className="note-line"></span>
              BUILT FOR WHAT'S NEXT.
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow"></div>
            <div className="visual-card">
              <div className="visual-top">
                <span>CY / DIGITAL SYSTEMS</span>
                <span>● LIVE</span>
              </div>
              <div className="visual-symbol">C<span>.</span></div>
              <div className="visual-bottom">
                <span>IDEAS INTO IMPACT.</span>
                <span>2026 — PRESENT</span>
              </div>
            </div>
            <div className="floating-card">
              <span className="floating-icon">✳</span>
              <div>
                <strong>Future focused</strong>
                <small>Technology meets creativity</small>
              </div>
            </div>
            <div className="visual-index">01 / 04</div>
          </div>
        </section>

        <div className="ticker">
          <div>
            WEB DEVELOPMENT <span>✳</span> AI SOLUTIONS <span>✳</span>
            UI/UX DESIGN <span>✳</span> DIGITAL INNOVATION <span>✳</span>
            WEB DEVELOPMENT <span>✳</span>
          </div>
        </div>

        <section className="services section" id="services">
          <div className="section-heading">
            <div>
              <div className="eyebrow">WHAT WE DO / 01</div>
              <h2>Technology that<br /><span>creates impact.</span></h2>
            </div>
            <p>
              From the first idea to the final product, we create digital
              solutions that solve real problems and unlock opportunities.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <div className="service-card-top">
                  <span>{service.number} / 04</span>
                  <span className="service-icon">{service.icon}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <a href="#contact">Explore service <span>↗</span></a>
              </article>
            ))}
          </div>
        </section>

        <section className="about section" id="about">
          <div className="eyebrow">ABOUT CYNBIT / 02</div>
          <div className="about-content">
            <h2>
              We don't just build
              <span> technology.</span>
              <br />
              We build possibilities.
            </h2>
            <div className="about-description">
              <p>
                Cynbit is a digital technology partner focused on helping
                businesses move forward. We combine development, design and
                intelligent technology to turn complex challenges into
                simple digital experiences.
              </p>
              <a href="#contact" className="text-link">
                Build something with us <span>↗</span>
              </a>
            </div>
          </div>
          <div className="stats">
            <div><strong>01<span>+</span></strong><small>Ideas to reality</small></div>
            <div><strong>04<span>+</span></strong><small>Core services</small></div>
            <div><strong>100<span>%</span></strong><small>Focus on quality</small></div>
          </div>
        </section>

        <section className="process section" id="process">
          <div className="eyebrow">HOW WE WORK / 03</div>
          <div className="section-heading">
            <h2>Simple process.<br /><span>Powerful results.</span></h2>
            <p>A clear and collaborative approach that takes your idea from concept to launch.</p>
          </div>

          <div className="process-grid">
            {[
              ["01", "Discover", "We understand your goals, users and business challenges."],
              ["02", "Design", "We plan the experience and create a clear direction."],
              ["03", "Develop", "We build, test and refine your digital solution."],
              ["04", "Deliver", "We launch your product and help you move forward."],
            ].map((item) => (
              <div className="process-item" key={item[0]}>
                <span>{item[0]}</span>
                <h3>{item[1]}</h3>
                <p>{item[2]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contact section" id="contact">
          <div className="contact-left">
            <div className="eyebrow">HAVE A PROJECT IN MIND? / 04</div>
            <h2>Let's make<br /><span>it happen.</span></h2>
            <p>
              Tell us about your idea. Let's explore how we can turn it into
              something meaningful.
            </p>
            <div className="contact-decoration">C<span>.</span></div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Start a conversation</h3>
            <p>Fill in the details and we'll get back to you.</p>

            <div className="form-row">
              <label>
                Your name
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
              </label>
              <label>
                Email address
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
              </label>
            </div>

            <div className="form-row">
              <label>
                Service required
                <select name="service" value={form.service} onChange={handleChange} required>
                  <option value="">Select a service</option>
                  {services.map((s) => <option key={s.number} value={s.title}>{s.title}</option>)}
                </select>
              </label>
              <label>
                Project budget
                <select name="budget" value={form.budget} onChange={handleChange}>
                  <option value="">Select budget</option>
                  <option value="Under ₹25,000">Under ₹25,000</option>
                  <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                  <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                  <option value="₹1,00,000+">₹1,00,000+</option>
                </select>
              </label>
            </div>

            <label>
              Expected timeline
              <select name="timeline" value={form.timeline} onChange={handleChange}>
                <option value="">Select timeline</option>
                <option value="Immediately">Immediately</option>
                <option value="Within 1 month">Within 1 month</option>
                <option value="1-3 months">1-3 months</option>
                <option value="Flexible">Flexible</option>
              </select>
            </label>

            <label>
              Tell us about your project
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="A little about your idea..." rows="4" required />
            </label>

            {notice && <div className="form-notice">{notice}</div>}

            <button className="primary-btn submit-btn" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Send project inquiry"} <span>↗</span>
            </button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <a href="#home" className="brand">
            <span className="brand-icon">C</span>
            <span>cynbit<span className="brand-dot">.</span></span>
          </a>
          <p>Building what's next.<br />One idea at a time.</p>
          <a href="#home" className="back-top">BACK TO TOP ↑</a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 CYNBIT. ALL RIGHTS RESERVED.</span>
          <span>DESIGNED FOR WHAT'S NEXT.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
