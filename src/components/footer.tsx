export function Footer() {
  return (
    <footer className="mt-auto border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">About SmokeFree India</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Empowering Indians to quit tobacco through data-driven insights and personal tracking tools.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/" className="hover:text-emerald-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/states" className="hover:text-emerald-600 transition-colors">
                  State Insights
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-emerald-600 transition-colors">
                  My Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors">
                  Quit Smoking Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors">
                  Support Groups
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-600 transition-colors">
                  Health Benefits
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} SmokeFree India. Built with care for a healthier nation.</p>
        </div>
      </div>
    </footer>
  )
}
