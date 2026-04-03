import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  const contactEmail = "www.ngendahermann14@gmail.com";
  const mailtoEmail = contactEmail.replace(/^www\./, "");

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-3xl font-semibold text-slate-900">
              <span>resume</span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </Link>
            <p className="mt-4 max-w-sm text-slate-600 leading-7">
              Crafted by Hermann to help students and job seekers present themselves with clarity and confidence.
            </p>
          </div>

          <div>
            <p className="text-slate-900 font-semibold">Quick Links</p>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li><Link to="/" className="hover:text-slate-900 transition">Home</Link></li>
              <li><Link to="/app" className="hover:text-slate-900 transition">Dashboard</Link></li>
              <li><Link to="/app?state=login" className="hover:text-slate-900 transition">Login</Link></li>
              <li><Link to="/app?state=register" className="hover:text-slate-900 transition">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-slate-900 font-semibold">Connect</p>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>
                <a
                  href="https://github.com/Hermann1412"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900 transition"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href={`mailto:${mailtoEmail}`} className="hover:text-slate-900 transition">
                  {mailtoEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-slate-100 text-sm text-slate-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {year} Resume Builder. All rights reserved.</p>
          <p>Designed with purpose, not templates.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
