import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-gray-900 text-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Get to know us</h4>
          <ul className="text-sm space-y-1">
            <li>About Vellique</li>
            <li>Careers</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Help</h4>
          <ul className="text-sm space-y-1">
            <li>Contact Us</li>
            <li>Returns</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="text-sm space-y-1">
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
      <div className="bg-gray-800 text-center py-4 text-sm">© {new Date().getFullYear()} Vellique — Demo</div>
    </footer>
  )
}
