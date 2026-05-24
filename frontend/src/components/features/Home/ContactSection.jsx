import { Button } from "../../common/Button/Button";

export const ContactSection = () => {
    return (
        <section id="contact" className="contact-section snap-section">
        <div className="container">
          <div className="contact-layout-wrapper">
            <div className="contact-text-side animate-on-scroll fade-in-left">
              <h2>Get in Touch</h2>
              <p className="contact-lead">Have a question or need assistance? We'd love to hear from you. Drop us a line or visit our shop.</p>
              
              <div className="contact-info-list">
                <div className="info-item">
                  <strong>Location</strong>
                  <p>27 Maginhawa Street, Diliman, Quezon City, Metro Manila, Philippines 1101</p>
                </div>
                <div className="info-item">
                  <strong>Phone</strong>
                  <p>+63 917 845 2731</p>
                </div>
                <div className="info-item">
                  <strong>Email</strong>
                  <p>hello@clovercoffee.ph</p>
                </div>
                <div className="info-item">
                  <strong>Business Hours</strong>
                  <p>Monday - Sunday: 7:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>

            <div className="contact-form-side animate-on-scroll fade-in-right">
              <form className="boutique-contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" placeholder="Full Name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="email@example.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" placeholder="How can we help you?" required></textarea>
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
};