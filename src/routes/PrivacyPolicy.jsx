import { motion } from 'framer-motion';
import { FiShield, FiEye, FiDatabase, FiLock } from 'react-icons/fi';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold goldman-regular mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-cyan-400"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </motion.p>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="bg-[#1A1B2E]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FiShield className="text-purple-400" />
                1. Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Moveit ("we," "us," or "our"), operated by Muhammad Ibrahim Ibrahim Abulmaaty, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our content sharing and collaboration platform.
              </p>
              <p className="text-gray-300 leading-relaxed">
                By using our Service, you consent to the data practices described in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FiEye className="text-purple-400" />
                2. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">2.1 Personal Information</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                When you create an account or use our Service, we may collect:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Email address and username</li>
                <li>Profile information (name, profile picture)</li>
                <li>Account preferences and settings</li>
                <li>Payment information (processed securely by third-party providers)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">2.2 Usage Information</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We automatically collect information about your use of the Service:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Device information (browser type, operating system, device identifiers)</li>
                <li>IP address and location data</li>
                <li>Usage patterns and session data</li>
                <li>Beam session information and content shared</li>
                <li>Error logs and performance data</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">2.3 Content You Share</h3>
              <p className="text-gray-300 leading-relaxed">
                We store the content you share through our Service, including text, images, audio, video, and files, solely for the purpose of providing the Service functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and manage subscriptions</li>
                <li>Send service-related communications</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our Service</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FiLock className="text-purple-400" />
                5. Data Security
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Provide our Service to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Improve our Service</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                When you delete your account, we will delete or anonymize your personal information within 30 days, except where retention is required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights and Choices</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Restriction:</strong> Limit how we process your information</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                To exercise these rights, contact us at privacy@airsynca.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking Technologies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and features</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                You can control cookie settings through your browser preferences, though disabling cookies may affect Service functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our Service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We use the following third-party services:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Payment processors (Stripe, PayPal)</li>
                <li>Analytics services (Google Analytics)</li>
                <li>Cloud hosting providers (AWS, Google Cloud)</li>
                <li>Email service providers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.
              </p>
              <p className="text-gray-300 leading-relaxed">
                For users in the European Economic Area (EEA), we rely on adequacy decisions, standard contractual clauses, or other appropriate safeguards for international transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Posting the updated policy on our website</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying in-app notifications</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Your continued use of the Service after changes become effective constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-300">
                  <strong>Legal name:</strong> Muhammad Ibrahim Ibrahim Abulmaaty<br />
                  <strong>Operating as:</strong> Moveit<br />
                  <strong>Email:</strong> privacy@airsynca.com<br />
                  <strong>Website:</strong> airsynca.com<br />
                  <strong>Address:</strong> St.268, Alexandria, Egypt<br />
                  <strong>Data Protection Officer:</strong> dpo@airsynca.com
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">14. GDPR Compliance</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For users in the European Union, this Privacy Policy complies with the General Data Protection Regulation (GDPR). You have the right to:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Lodge a complaint with your local data protection authority</li>
                <li>Withdraw consent at any time</li>
                <li>Request data portability</li>
                <li>Object to automated decision-making</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
