"use client";
import { ShieldCheck, Landmark, Euro, Linkedin, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Sticky Bar */}
      <div className="sticky bottom-0 bg-gray-800 bg-opacity-90 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2" title="PCI DSS Compliant">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium">PCI DSS Compliant</span>
              </div>
              <div className="flex items-center gap-2" title="Partner Bank">
                <Landmark className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Partner Bank Secured</span>
              </div>
              <div className="flex items-center gap-2" title="EU Jurisdiction">
                <Euro className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">EU Jurisdiction</span>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer">
              Contact Compliance
            </button>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Careers</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms of Service</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Support Center</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Agent Login</a>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info & Social Links */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Your Company Inc.</h3>
              <p className="text-gray-400 text-sm">&copy; 2024 Your Company Inc. All Rights Reserved.</p>
              <div className="flex space-x-4 mt-6">
                <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors duration-300">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Registered Offices */}
            <div className="md:col-span-2">
              <h3 className="font-semibold text-lg mb-2">Registered Offices</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-400">
                <div>
                  <p className="font-medium text-white mb-1">North America</p>
                  <p>123 Innovation Drive, Suite 100<br />Palo Alto, CA 94304, USA</p>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Europe</p>
                  <p>789 Global Avenue, Floor 5<br />Dublin 2, D02 F8X, Ireland</p>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Asia-Pacific</p>
                  <p>456 Tech Park, Tower B<br />Singapore 188953</p>
                </div>
              </div>
            </div>
          </div>

          {/* Licensing & Regulatory Info */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-xs">
            <p>Your Company Inc. is licensed and regulated by the Financial Conduct Authority under registration number 900507.</p>
            <p className="mt-2">Services are provided in accordance with the Payment Services Regulations 2017. All trademarks and brand names belong to their respective owners.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
