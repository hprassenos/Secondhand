import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - Secondhand Finds',
  description: 'Privacy Policy for Secondhand Finds - How we collect, use, and protect your information',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-vintage-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">
          Last Updated: January 2025
        </p>

        <div className="card prose prose-vintage max-w-none">
          <p className="text-gray-700 mb-6">
            At Secondhand Finds, we take your privacy seriously. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you visit our website.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">1. Information We Collect</h2>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">1.1 Information You Provide</h3>
          <p className="text-gray-700 mb-2">We collect information you voluntarily provide, including:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li><strong>Account Information:</strong> Name, email address, password when you create an account</li>
            <li><strong>Profile Information:</strong> Optional profile details, preferences, saved searches</li>
            <li><strong>Content:</strong> Listings you post, guestbook entries, photos, descriptions</li>
            <li><strong>Communications:</strong> Messages sent through our contact forms or email</li>
            <li><strong>Verification Data:</strong> Business information when claiming a listing</li>
          </ul>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">1.2 Automatically Collected Information</h3>
          <p className="text-gray-700 mb-2">When you visit our site, we automatically collect:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li><strong>Log Data:</strong> IP address, browser type, pages visited, time spent</li>
            <li><strong>Device Information:</strong> Device type, operating system, unique identifiers</li>
            <li><strong>Location Data:</strong> General location based on IP address (not precise GPS)</li>
            <li><strong>Cookies:</strong> Small data files stored on your device (see Cookie Policy below)</li>
          </ul>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">1.3 Third-Party Information</h3>
          <p className="text-gray-700">
            If you sign in using social media (Google, Facebook), we receive basic profile information
            from those services according to their privacy policies.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-2">We use collected information to:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>Provide, operate, and maintain our services</li>
            <li>Create and manage your account</li>
            <li>Process and moderate your content submissions</li>
            <li>Send you updates, newsletters, and promotional materials (with your consent)</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Improve our website and develop new features</li>
            <li>Analyze usage patterns and trends</li>
            <li>Detect, prevent, and address technical issues and fraud</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">3. Sharing Your Information</h2>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">3.1 Public Information</h3>
          <p className="text-gray-700 mb-2">The following information is publicly visible:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>Approved yard sale and estate sale listings</li>
            <li>Approved guestbook entries and photos</li>
            <li>Shop directory listings</li>
            <li>Your username (if you choose to make it public)</li>
          </ul>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">3.2 Service Providers</h3>
          <p className="text-gray-700 mb-2">We may share information with trusted third parties who help us operate, including:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>Hosting and infrastructure providers (Vercel, Supabase)</li>
            <li>Authentication services (Google, Facebook OAuth)</li>
            <li>Email service providers</li>
            <li>Analytics providers</li>
            <li>Payment processors (for future premium features)</li>
          </ul>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">3.3 Legal Requirements</h3>
          <p className="text-gray-700">
            We may disclose your information if required by law, court order, or to protect our rights,
            property, or safety, or that of our users or the public.
          </p>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">3.4 Business Transfers</h3>
          <p className="text-gray-700">
            If Secondhand Finds is involved in a merger, acquisition, or sale of assets, your information
            may be transferred as part of that transaction.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
          <p className="text-gray-700 mb-3">
            We use cookies and similar technologies to track activity and store certain information.
          </p>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">Types of Cookies We Use:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Essential Cookies:</strong> Required for the site to function (authentication, security)</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you use the site</li>
            <li><strong>Advertising Cookies:</strong> May be used for future targeted advertising</li>
          </ul>

          <p className="text-gray-700 mt-4">
            You can control cookies through your browser settings. Note that disabling cookies may affect
            site functionality.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">5. Data Security</h2>
          <p className="text-gray-700 mb-3">
            We implement appropriate technical and organizational measures to protect your information, including:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>Encryption of data in transit (HTTPS/SSL)</li>
            <li>Encrypted password storage</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
            <li>Secure database hosting</li>
          </ul>
          <p className="text-gray-700 mt-3">
            However, no method of transmission over the Internet is 100% secure. We cannot guarantee
            absolute security of your information.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">6. Your Rights and Choices</h2>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">6.1 Access and Update</h3>
          <p className="text-gray-700">
            You can access and update your account information at any time through your account settings.
          </p>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">6.2 Delete Your Account</h3>
          <p className="text-gray-700">
            You may request deletion of your account by contacting us. Note that some information may be
            retained for legal or legitimate business purposes.
          </p>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">6.3 Marketing Communications</h3>
          <p className="text-gray-700">
            You can opt out of promotional emails by clicking &quot;unsubscribe&quot; in any marketing email or
            updating your communication preferences in your account.
          </p>

          <h3 className="text-xl font-semibold text-vintage-900 mt-6 mb-3">6.4 Do Not Track</h3>
          <p className="text-gray-700">
            We currently do not respond to &quot;Do Not Track&quot; browser signals, but you can control cookies
            through your browser settings.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">7. Children&apos;s Privacy</h2>
          <p className="text-gray-700">
            Our service is not intended for children under 13 years of age. We do not knowingly collect
            personal information from children under 13. If you believe we have collected information from
            a child under 13, please contact us immediately.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">8. International Users</h2>
          <p className="text-gray-700">
            Your information may be transferred to and maintained on servers located outside your state,
            province, or country. By using our service, you consent to this transfer.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">9. Third-Party Links</h2>
          <p className="text-gray-700">
            Our site may contain links to third-party websites. We are not responsible for the privacy
            practices of these external sites. We encourage you to read their privacy policies.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">10. California Privacy Rights</h2>
          <p className="text-gray-700 mb-3">
            If you are a California resident, you have additional rights under the California Consumer
            Privacy Act (CCPA), including:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            <li>Right to know what personal information is collected</li>
            <li>Right to know if personal information is sold or disclosed</li>
            <li>Right to opt-out of the sale of personal information</li>
            <li>Right to deletion of personal information</li>
            <li>Right to non-discrimination for exercising CCPA rights</li>
          </ul>
          <p className="text-gray-700 mt-3">
            <strong>Note:</strong> We do not sell your personal information.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">11. Changes to This Privacy Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of material changes
            by posting the new policy on this page with an updated &quot;Last Updated&quot; date. Your continued
            use of the service after changes constitutes acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-bold text-vintage-900 mt-8 mb-4">12. Contact Us</h2>
          <p className="text-gray-700 mb-3">
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="text-gray-700">
            <p>Email: <a href="mailto:privacy@secondhandfinds.com" className="text-vintage-600 hover:text-vintage-700">privacy@secondhandfinds.com</a></p>
            <p className="mt-2">Mail: Secondhand Finds Privacy Team<br/>
            [Your Address]<br/>
            [City, State ZIP]</p>
          </div>

          <div className="mt-12 pt-8 border-t border-vintage-200">
            <p className="text-sm text-gray-600">
              By using Secondhand Finds, you acknowledge that you have read and understood this Privacy Policy.
            </p>
            <div className="mt-4 space-x-4">
              <Link href="/terms" className="text-vintage-600 hover:text-vintage-700 text-sm font-medium">
                View Terms of Service →
              </Link>
              <Link href="/contact" className="text-vintage-600 hover:text-vintage-700 text-sm font-medium">
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
