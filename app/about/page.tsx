import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Sri Vinayaga Traders — Tamil Nadu\'s trusted importer and distributor of premium steel and construction materials since 1982.',
};

const PARTNER_LOGOS = [
  { name: 'ARS 550', src: '/logos/ars_550.png' },
  { name: 'MCR', src: '/logos/mcr.png' },
  { name: 'Amman', src: '/logos/amman.png' },
  { name: 'Tata Steel', src: '/logos/tata.png' },
  { name: 'Blue Gold', src: '/logos/bluegold.png' },
  { name: 'iSteel', src: '/logos/isteel.png' },
  { name: 'JSW', src: '/logos/jsw.png' },
  { name: 'Kamachi', src: '/logos/kamachi.png' },
  { name: 'Pulkit', src: '/logos/pulkit.png' },
  { name: 'SAIL', src: '/logos/sail.png' },
  { name: 'Suryadev', src: '/logos/suryadev.png' },
  { name: 'Vizag', src: '/logos/vizag.png' },
];

const TEAM_VALUES = [
  { icon: '🏆', title: 'Quality First', desc: 'We source only from certified, top-tier manufacturers ensuring every product meets the highest standards.' },
  { icon: '🤝', title: 'Trust & Integrity', desc: 'Transparency in pricing and dealings has built lasting relationships over 40 years.' },
  { icon: '⚡', title: 'Reliability', desc: 'Timely deliveries and consistent supply keep our customers construction on schedule.' },
  { icon: '📈', title: 'Customer Growth', desc: 'Our success is defined by our customers\'s success in their construction projects.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>About Sri Vinayaga Traders</h1>
          <p>Your trusted partner for premium construction materials since 1982</p>
        </div>
      </div>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyContent}>
              <span className="overline">Our Story</span>
              <h2 className={styles.storyTitle}>Four Decades of Building Trust</h2>
              <p className={styles.storyText}>
                Sri Vinayaga Traders was founded in 1982 in Chennai, Tamil Nadu, with a simple mission:
                to provide builders, contractors, and retailers with the highest quality construction
                materials at fair prices.
              </p>
              <p className={styles.storyText}>
                What started as a small steel trading business has grown into one of the region&apos;s
                most trusted distributors, offering over 70 products across 9 categories from India&apos;s
                leading manufacturers.
              </p>
              <p className={styles.storyText}>
                Today, we serve thousands of customers across Tamil Nadu, maintaining the same
                commitment to quality, reliability, and customer satisfaction that has defined
                us for over 40 years.
              </p>
              <div className={styles.storyStats}>
                <div className={styles.storyStat}>
                  <span className={styles.storyStatVal}>40+</span>
                  <span className={styles.storyStatLabel}>Years</span>
                </div>
                <div className={styles.storyStat}>
                  <span className={styles.storyStatVal}>70+</span>
                  <span className={styles.storyStatLabel}>Products</span>
                </div>
                <div className={styles.storyStat}>
                  <span className={styles.storyStatVal}>10K+</span>
                  <span className={styles.storyStatLabel}>Customers</span>
                </div>
                <div className={styles.storyStat}>
                  <span className={styles.storyStatVal}>12+</span>
                  <span className={styles.storyStatLabel}>Partners</span>
                </div>
              </div>
            </div>

            <div className={styles.storyVisual}>
              <div className={styles.visualCard}>
                <div className={styles.visualInner}>
                  <span className={styles.visualIcon}>🏗️</span>
                  <h3>Serving Tamil Nadu</h3>
                  <p>No. 64/3D, Sriperambudur Main Road<br />Pudupper Village, Chennai - 600069</p>
                  <div className={styles.visualDivider} />
                  <p className={styles.visualQuote}>
                    &ldquo;Quality materials build quality structures. We&apos;re here to make that possible.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`section ${styles.valuesSection}`}>
        <div className="container">
          <div className="section-heading">
            <span className="overline">What Drives Us</span>
            <h2>Our Core Values</h2>
          </div>
          <div className={styles.valuesGrid}>
            {TEAM_VALUES.map(v => (
              <div key={v.title} className={styles.valueCard}>
                <span className={styles.valueIcon}>{v.icon}</span>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className={styles.partnersSection}>
        <div className="container">
          <div className="section-heading">
            <span className="overline">Our Network</span>
            <h2>Trusted Manufacturer Partners</h2>
            <p>We work exclusively with India&apos;s most reputable steel and construction material manufacturers</p>
          </div>
          <div className={styles.logoCarouselWrap}>
            <div className={styles.logoCarousel}>
              {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
                <div key={`${logo.name}-${i}`} className={styles.logoItem}>
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={120}
                    height={60}
                    className={styles.logoImg}
                    style={{ height: 'auto' }}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className={`section ${styles.branchesSection}`}>
        <div className="container">
          <div className="section-heading">
            <span className="overline">Our Presence</span>
            <h2>Our Branches & Associated Companies</h2>
            <p>Visit or contact our retail outlets and steel manufacturing branches across Tamil Nadu</p>
          </div>
          
          <div className={styles.branchesGrid}>
            {/* Branch 1 */}
            <div className={styles.branchCard}>
              <span className={styles.branchType}>Steel & Construction Materials</span>
              <h3 className={styles.branchName}>SRI VINAYAGA TRADERS</h3>
              <p className={styles.branchAddress}>
                📍 399/4B, Vandalur Walajabad Highway, Padappai,<br />
                Kancheepuram, Tamil Nadu 600069
              </p>
              <div className={styles.branchContacts}>
                <a href="tel:+919751411234" className={styles.branchPhone}>📞 +91 97514 11234</a>
                <a href="tel:+919751421234" className={styles.branchPhone}>📞 +91 97514 21234</a>
              </div>
            </div>

            {/* Branch 2 */}
            <div className={styles.branchCard}>
              <span className={styles.branchType}>Rings & Wire Products</span>
              <h3 className={styles.branchName}>SRI VINAYAGA RINGS</h3>
              <p className={styles.branchAddress}>
                📍 No. 48&49, Arakonam Road, Rajalakshmi Nagar,<br />
                Part 2, Sriperumbudur, Thandalam - 602105
              </p>
              <div className={styles.branchContacts}>
                <a href="tel:+919841447494" className={styles.branchPhone}>📞 +91 98414 47494</a>
                <a href="tel:+919514921234" className={styles.branchPhone}>📞 +91 95149 21234</a>
              </div>
              <div className={styles.branchWebLinkWrap}>
                <a href="https://www.srivinayagarings.com/" target="_blank" rel="noopener noreferrer" className={styles.branchWebLink}>
                  🌐 www.srivinayagarings.com
                </a>
              </div>
            </div>

            {/* Branch 3 */}
            <div className={styles.branchCard}>
              <span className={styles.branchType}>Rings & Wire Products</span>
              <h3 className={styles.branchName}>SRI VINAYAGA RINGS</h3>
              <p className={styles.branchAddress}>
                📍 No. 12/281, Puthantharuvai Road, Panaivilai,<br />
                Thisayanvilai, Tamil Nadu - 628656
              </p>
              <div className={styles.branchContacts}>
                <a href="tel:+919710812345" className={styles.branchPhone}>📞 +91 97108 12345</a>
                <a href="tel:+917598721234" className={styles.branchPhone}>📞 +91 75987 21234</a>
              </div>
            </div>

            {/* Branch 4 */}
            <div className={styles.branchCard}>
              <span className={styles.branchType}>Rings & Wire Products</span>
              <h3 className={styles.branchName}>SRI VINAYAGA RINGS</h3>
              <p className={styles.branchAddress}>
                📍 No. 6 and 7, S.R. Nagar, Panayapuram,<br />
                Villupuram, Tamil Nadu - 605601
              </p>
              <div className={styles.branchContacts}>
                <a href="tel:+919514981234" className={styles.branchPhone}>📞 +91 95149 81234</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>Ready to Work With Us?</h2>
            <p>Contact us today for bulk orders, pricing enquiries, or to learn more about our products.</p>
            <div className={styles.ctaBtns}>
              <Link href="/contact" className="btn btn-primary btn-lg">Get in Touch</Link>
              <Link href="/products" className="btn btn-secondary btn-lg">Browse Products</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
