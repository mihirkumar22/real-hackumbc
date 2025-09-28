import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const data = {
  facebookLink: 'https://facebook.com/beanstalk',
  instaLink: 'https://instagram.com/beanstalk',
  twitterLink: 'https://twitter.com/beanstalk',
  githubLink: 'https://github.com/beanstalk',
  dribbbleLink: 'https://dribbble.com/beanstalk',
  services: {
    webdev: '/web-development',
    webdesign: '/web-design',
    marketing: '/marketing',
    googleads: '/google-ads',
  },
  about: {
    history: '/company-history',
    team: '/meet-the-team',
    handbook: '/employee-handbook',
    careers: '/careers',
  },
  help: {
    faqs: '/faqs',
    support: '/support',
    livechat: '/live-chat',
  },
  contact: {
    email: 'hello@beanstalk.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA, USA',
  },
  company: {
    name: 'Beanstalk',
    description:
      'The fun way to learn American Sign Language. Master ASL with interactive lessons, real-time AI feedback, and a learning path that grows with you.',
    logo: '/logo.webp',
  },
};

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: data.facebookLink },
  { icon: Instagram, label: 'Instagram', href: data.instaLink },
  { icon: Twitter, label: 'Twitter', href: data.twitterLink },
  { icon: Github, label: 'GitHub', href: data.githubLink },
  { icon: Dribbble, label: 'Dribbble', href: data.dribbbleLink },
];

const aboutLinks = [
  { text: 'Company History', href: data.about.history },
  { text: 'Meet the Team', href: data.about.team },
  { text: 'Employee Handbook', href: data.about.handbook },
  { text: 'Careers', href: data.about.careers },
];

const serviceLinks = [
  { text: 'Web Development', href: data.services.webdev },
  { text: 'Web Design', href: data.services.webdesign },
  { text: 'Marketing', href: data.services.marketing },
  { text: 'Google Ads', href: data.services.googleads },
];

const helpfulLinks = [
  { text: 'FAQs', href: data.help.faqs },
  { text: 'Support', href: data.help.support },
  { text: 'Live Chat', href: data.help.livechat, hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="bg-gray-900 mt-16 w-full place-self-end rounded-t-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-green-500 flex justify-center gap-2 sm:justify-start">
              <span className="text-2xl">🌱</span>
              <span className="text-2xl font-semibold">
                {data.company.name}
              </span>
            </div>

            <p className="text-gray-300 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-green-500 hover:text-green-400 transition"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-gray-300 hover:text-white transition"
                      to={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Our Services</p>
              <ul className="mt-8 space-y-4 text-sm">
                {serviceLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-gray-300 hover:text-white transition"
                      to={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      to={href}
                      className={`${
                        hasIndicator
                          ? 'group flex justify-center gap-1.5 sm:justify-start'
                          : 'text-gray-300 hover:text-white transition'
                      }`}
                    >
                      <span className="text-gray-300 hover:text-white transition">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="bg-green-500 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-green-500 relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <Link
                      className="flex items-center justify-center gap-1.5 sm:justify-start"
                      to="#"
                    >
                      <Icon className="text-green-500 size-5 shrink-0 shadow-sm" />
                      {isAddress ? (
                        <address className="text-gray-300 -mt-0.5 flex-1 not-italic transition">
                          {text}
                        </address>
                      ) : (
                        <span className="text-gray-300 flex-1 transition">
                          {text}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-gray-300">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-gray-400 mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; 2025 {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
