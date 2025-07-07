'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Phone, Mail, MapPin } from 'lucide-react';
import "@fortawesome/fontawesome-free/css/all.min.css";

export function Footer() {
  const pathname = usePathname();
  const publicPaths = ['/login', '/signup'];

  if (publicPaths.includes(pathname)) return null;

  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-700 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">AgriMitraAI</span>
                <p className="text-sm text-green-200">AI Agritech Advisor</p>
              </div>
            </div>
            <p className="text-green-100 leading-relaxed">
              Empowering small farmers with AI-driven agricultural solutions. 
              Get personalized advice for crops, fertilizers, pest control, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                ['Crop Advisor', '/crop-advisor'],
                ['Fertilizer Guide', '/fertilizer-soil'],
                ['Pest Control', '/pest-disease'],
                ['Community Forum', '/community'],
                ['Market', '/market-yield'],
                ['Subsidies', '/govt-schemes'],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link href={path} className="text-green-200 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-300" />
                <span className="text-green-200">906081811</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-300" />
                <span className="text-green-200">adityaraj7cr@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-300" />
                <span className="text-green-200">India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="mt-16 bg-green-700 rounded-xl py-6 px-6 text-center shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-2">Meet the Developer</h3>
          <p className="text-green-100 mb-4">Aditya Raj – Creator of AgriMitraAI</p>
          <div className="flex justify-center space-x-6 text-white text-2xl">
            <a
              href="https://linkedin.com/in/adityarajbitmesra"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="hover:text-blue-300 transition-colors"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="https://github.com/ADITYARAJ97513"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="hover:text-gray-300 transition-colors"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              href="https://www.instagram.com/adityaraj97512/"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
              className="hover:text-pink-400 transition-colors"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-700 mt-10 pt-6 text-center">
          <p className="text-green-200">
            © 2025 AgriMitraAI. All rights reserved. Designed for farmers with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
