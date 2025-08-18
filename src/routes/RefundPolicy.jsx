import { motion } from 'framer-motion';
import { FiDollarSign, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const RefundPolicy = () => {
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
            Refund Policy
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
                <FiDollarSign className="text-purple-400" />
                1. Overview
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                At Airsynca, we want you to be completely satisfied with your subscription. This Refund Policy outlines the circumstances under which refunds may be granted for our premium services.
              </p>
              <p className="text-gray-300 leading-relaxed">
                By purchasing a subscription to Airsynca, you acknowledge that you have read and agree to this Refund Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-green-400" />
                2. 30-Day Money-Back Guarantee
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We offer a 30-day money-back guarantee for all paid subscriptions. If you're not completely satisfied with our service within the first 30 days of your subscription, you may request a full refund.
              </p>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                <p className="text-green-400 font-semibold">
                  ✅ Full refund available within 30 days of purchase
                </p>
              </div>
              <p className="text-gray-300 leading-relaxed">
                This guarantee applies to both monthly and yearly subscriptions, regardless of the reason for cancellation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Refund Eligibility</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <FiCheckCircle className="text-green-400" />
                Eligible for Refund
              </h3>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Subscription cancellation within 30 days of purchase</li>
                <li>Technical issues preventing service use (after support attempts)</li>
                <li>Service unavailability for extended periods</li>
                <li>Billing errors or duplicate charges</li>
                <li>Unauthorized charges</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <FiXCircle className="text-red-400" />
                Not Eligible for Refund
              </h3>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>Subscription cancellation after 30 days</li>
                <li>Violation of Terms of Service</li>
                <li>Account suspension due to abuse</li>
                <li>Change of mind after 30 days</li>
                <li>Failure to use the service</li>
                <li>Downgrading from yearly to monthly plan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FiClock className="text-purple-400" />
                4. Refund Process
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To request a refund, follow these steps:
              </p>
              <ol className="text-gray-300 leading-relaxed list-decimal list-inside space-y-2 mb-4">
                <li>Contact our support team at support@airsynca.com</li>
                <li>Include your account email and reason for refund</li>
                <li>Provide any relevant details about the issue</li>
                <li>Our team will review your request within 2-3 business days</li>
                <li>If approved, refund will be processed within 5-10 business days</li>
              </ol>
              <p className="text-gray-300 leading-relaxed">
                Refunds are processed to the original payment method used for the purchase.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Refund Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Request Review</h4>
                  <p className="text-gray-300 text-sm">2-3 business days</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Refund Processing</h4>
                  <p className="text-gray-300 text-sm">5-10 business days</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Bank Processing</h4>
                  <p className="text-gray-300 text-sm">3-5 business days</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Total Timeline</h4>
                  <p className="text-gray-300 text-sm">10-18 business days</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Partial Refunds</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                In certain circumstances, we may offer partial refunds:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li><strong>Service Downtime:</strong> Pro-rated refund for extended service outages</li>
                <li><strong>Feature Removal:</strong> Partial refund if major features are discontinued</li>
                <li><strong>Billing Errors:</strong> Refund of overcharged amounts</li>
                <li><strong>Technical Issues:</strong> Partial refund for prolonged technical problems</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Partial refunds are calculated based on the unused portion of your subscription period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Subscription Cancellation</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                <p className="text-blue-400 font-semibold">
                  ℹ️ Cancellation does not automatically trigger a refund
                </p>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To request a refund, you must explicitly contact our support team within the 30-day guarantee period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Payment Method Refunds</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Refunds are processed to the original payment method:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
                <li><strong>PayPal:</strong> 3-5 business days</li>
                <li><strong>Bank Transfers:</strong> 7-14 business days</li>
                <li><strong>Digital Wallets:</strong> 2-5 business days</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Processing times may vary depending on your bank or payment provider.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Disputed Charges</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you believe you've been charged incorrectly:
              </p>
              <ol className="text-gray-300 leading-relaxed list-decimal list-inside space-y-2 mb-4">
                <li>Contact our support team immediately</li>
                <li>Provide detailed information about the charge</li>
                <li>We'll investigate and resolve the issue</li>
                <li>If confirmed as an error, we'll process a refund</li>
              </ol>
              <p className="text-gray-300 leading-relaxed">
                Please do not initiate chargebacks without first contacting our support team, as this may result in account suspension.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Free Trial Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We offer a 14-day free trial for all paid plans:
              </p>
              <ul className="text-gray-300 leading-relaxed list-disc list-inside space-y-2 mb-4">
                <li>No credit card required to start the trial</li>
                <li>Full access to premium features during trial</li>
                <li>Automatic conversion to paid plan after trial ends</li>
                <li>Can cancel anytime during the trial period</li>
                <li>30-day money-back guarantee applies after trial conversion</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Enterprise Customers</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Enterprise customers with custom contracts may have different refund terms specified in their service agreements.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Please refer to your specific contract or contact your account manager for enterprise refund policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For refund requests or questions about this policy:
              </p>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-300">
                  <strong>Email:</strong> support@airsynca.com<br />
                  <strong>Website:</strong> airsynca.com<br />
                  <strong>Response Time:</strong> Within 24 hours<br />
                  <strong>Business Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">13. Policy Updates</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may update this Refund Policy from time to time. Changes will be effective immediately upon posting on our website.
              </p>
              <p className="text-gray-300 leading-relaxed">
                For existing customers, we will notify you of material changes via email at least 30 days before they take effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">14. Legal Rights</h2>
              <p className="text-gray-300 leading-relaxed">
                This Refund Policy does not affect your statutory rights under consumer protection laws. You may have additional rights depending on your location and applicable laws.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy;
