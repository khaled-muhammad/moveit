import { motion } from 'framer-motion';
import { FiShield, FiFileText, FiAlertTriangle } from 'react-icons/fi';

const TermsOfService = () => {
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
            Terms of Service
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
                <FiFileText className="text-purple-400" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                By accessing and using Moveit ("the Service"), operated by Muhammad Ibrahim Ibrahim Abulmaaty ("we," "us," or "our") with principal address at St.268, Alexandria, Egypt, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <p className="text-gray-300 leading-relaxed">
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FiShield className="text-purple-400" />
                2. Description of Service
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Moveit is a content sharing and collaboration platform that allows users to:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Share text, links, images, audio, and video content between devices</li>
                <li>Create and manage persistent beam sessions</li>
                <li>Collaborate in real-time with multiple devices</li>
                <li>Use QR codes for device pairing</li>
                <li>Create rich notes and organize content</li>
                <li>Upload and share files</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FiAlertTriangle className="text-purple-400" />
                3. User Accounts and Registration
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                While some features of Moveit are available without registration, certain premium features require account creation. When you create an account, you must provide accurate and complete information.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                You are responsible for:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your account information is accurate and up-to-date</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Upload, share, or transmit any content that is illegal, harmful, threatening, abusive, or defamatory</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others, including intellectual property rights</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Use the Service for spam, phishing, or other malicious activities</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to reverse engineer or decompile the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Content and Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You retain ownership of all content you upload, create, or share through Moveit. By using our Service, you grant us a limited license to store, process, and transmit your content solely for the purpose of providing the Service.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                You are solely responsible for the content you share and must ensure you have the right to share such content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We implement appropriate security measures to protect your data, but no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Subscription and Billing</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Premium features require a paid subscription. Subscription fees are billed in advance on a monthly or yearly basis.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                You may cancel your subscription at any time through your account settings. Cancellations take effect at the end of the current billing period.
              </p>
              <p className="text-gray-300 leading-relaxed">
                All fees are non-refundable except as provided in our Refund Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Service Availability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We strive to maintain high service availability but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or technical issues.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the Service at any time with reasonable notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To the maximum extent permitted by law, Moveit (Muhammad Ibrahim Ibrahim Abulmaaty) shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to indemnify and hold harmless Moveit and Muhammad Ibrahim Ibrahim Abulmaaty, along with any officers, directors, employees, and agents, from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Upon termination, your right to use the Service ceases immediately, and we may delete your account and data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">13. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via email or through the Service.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Your continued use of the Service after changes become effective constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-300">
                  <strong>Legal name:</strong> Muhammad Ibrahim Ibrahim Abulmaaty<br />
                  <strong>Operating as:</strong> Moveit<br />
                  <strong>Email:</strong> legal@airsynca.com<br />
                  <strong>Website:</strong> airsynca.com<br />
                  <strong>Address:</strong> St.268, Alexandria, Egypt
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
