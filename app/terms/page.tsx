import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service - Secondhand Empire',
  description: 'Terms of Service for Secondhand Empire vintage marketplace',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-vintage-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">
          Last Updated: January 2025
        </p>

        <div className="card prose prose-vintage max-w-none">
          <p className="text-gray-700 mb-6">
            Welcome to Secondhand Empire. By accessing or using our website and services, you agree to be
            bound by these Terms of Service. Please read them carefully.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By using Secondhand Empire, you agree to these Terms of Service, our Privacy Policy, and all
            applicable laws and regulations. If you do not agree with any of these terms, you are
            prohibited from using or accessing this site.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-3">
            We grant you a limited, non-exclusive, non-transferable license to access and use Secondhand
            Finds for personal, non-commercial purposes, subject to these terms.
          </p>
          <p className="text-gray-700 font-semibold mb-2">You may not:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or public display</li>
            <li>Attempt to decompile or reverse engineer any software on the site</li>
            <li>Remove any copyright or proprietary notations</li>
            <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
          </ul>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">3. User Accounts</h2>
          <p className="text-gray-700 mb-3">
            To access certain features, you may need to create an account. You are responsible for:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>Maintaining the confidentiality of your account and password</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Providing accurate and complete registration information</li>
          </ul>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">4. User-Generated Content</h2>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">4.1 Your Content</h3>
          <p className="text-gray-700 mb-3">
            When you post listings, guestbook entries, or other content on Secondhand Empire, you retain
            ownership of your content but grant us a worldwide, non-exclusive, royalty-free license to
            use, display, reproduce, and distribute your content on our platform.
          </p>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">4.2 Content Standards</h3>
          <p className="text-gray-700 mb-2">You agree that your content will not:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>Be false, misleading, or fraudulent</li>
            <li>Infringe on any third party&apos;s intellectual property or privacy rights</li>
            <li>Contain spam, advertising, or solicitations</li>
            <li>Include offensive, discriminatory, or illegal material</li>
            <li>Contain malware or malicious code</li>
          </ul>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">4.3 Moderation</h3>
          <p className="text-gray-700">
            We reserve the right to review, edit, or remove any user-generated content at our discretion.
            All yard sales, estate sales, and guestbook entries are subject to moderation before publication.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">5. Listings and Accuracy</h2>
          <p className="text-gray-700 mb-3">
            While we strive to provide accurate information, Secondhand Empire does not guarantee the
            accuracy, completeness, or reliability of any listings, business information, or user content.
          </p>
          <p className="text-gray-700">
            Users are responsible for verifying information independently, including business hours,
            sale dates, and item availability. We are not responsible for errors or omissions in listings.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">6. Transactions</h2>
          <p className="text-gray-700 mb-3">
            Secondhand Empire is a directory and information platform only. We do not:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>Facilitate or process transactions between users and shops</li>
            <li>Guarantee the quality, safety, or legality of items</li>
            <li>Assume responsibility for disputes between buyers and sellers</li>
            <li>Provide warranties or guarantees for any items or services</li>
          </ul>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">7. Prohibited Activities</h2>
          <p className="text-gray-700 mb-2">You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>Use the site for any illegal purpose</li>
            <li>Scrape, harvest, or collect user data without permission</li>
            <li>Impersonate another person or entity</li>
            <li>Interfere with or disrupt the site&apos;s operation</li>
            <li>Attempt to gain unauthorized access to any portion of the site</li>
            <li>Post false or misleading listings</li>
            <li>Harass, abuse, or harm other users</li>
          </ul>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">8. Intellectual Property</h2>
          <p className="text-gray-700">
            The Secondhand Empire name, logo, and all original content, features, and functionality are
            owned by us and are protected by international copyright, trademark, and other intellectual
            property laws.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">9. Third-Party Links</h2>
          <p className="text-gray-700">
            Our site may contain links to third-party websites or services. We are not responsible for
            the content, privacy policies, or practices of any third-party sites or services.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">10. Disclaimer of Warranties</h2>
          <p className="text-gray-700">
            The service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind, either
            express or implied. We do not warrant that the service will be uninterrupted, secure, or
            error-free.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">11. Limitation of Liability</h2>
          <p className="text-gray-700">
            To the maximum extent permitted by law, Secondhand Empire shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages resulting from your use of or inability
            to use the service.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">12. Indemnification</h2>
          <p className="text-gray-700">
            You agree to indemnify and hold harmless Secondhand Empire from any claims, damages, losses,
            liabilities, and expenses arising from your use of the service or violation of these terms.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">13. Termination</h2>
          <p className="text-gray-700">
            We may terminate or suspend your account and access to the service immediately, without prior
            notice, for any reason, including breach of these Terms.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">14. Changes to Terms</h2>
          <p className="text-gray-700">
            We reserve the right to modify these terms at any time. We will notify users of material
            changes by posting the new terms on this page with an updated &quot;Last Updated&quot; date. Your
            continued use of the service after changes constitutes acceptance of the new terms.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">15. Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be governed by and construed in accordance with the laws of [Your State/Country],
            without regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">16. Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about these Terms, please contact us at:
          </p>
          <p className="text-gray-700 mt-2">
            Email: <a href="mailto:legal@secondhandempire.com" className="text-vintage-600 hover:text-vintage-700">legal@secondhandempire.com</a>
          </p>

          <div className="mt-12 pt-8 border-t border-vintage-200">
            <p className="text-sm text-gray-600">
              By using Secondhand Empire, you acknowledge that you have read, understood, and agree to be
              bound by these Terms of Service.
            </p>
            <div className="mt-4">
              <Link href="/privacy" className="text-vintage-600 hover:text-vintage-700 text-sm font-medium">
                View Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
