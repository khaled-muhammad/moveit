import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, 
  FiX, 
  FiStar, 
  FiZap, 
  FiShield, 
  FiUsers, 
  FiCloud,
  FiHeadphones,
  FiTrendingUp,
  FiSettings
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { isAuthenticated } = useAuth();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: <FiStar className="w-6 h-6" />,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for personal use and trying out Airsynca',
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-600/10',
      borderColor: 'border-gray-600/20',
      features: [
        'Up to 3 active beam sessions',
        'Basic text and link sharing',
        'QR code device pairing',
        'Up to 2 connected devices per beam',
        '7-day session history',
        'Basic sticky notes',
        'Community support'
      ],
      limitations: [
        'No file uploads',
        'Limited session history',
        'Basic features only'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: <FiZap className="w-6 h-6" />,
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'Ideal for professionals and power users',
      color: 'from-blue-400 to-indigo-600',
      bgColor: 'bg-blue-600/10',
      borderColor: 'border-blue-600/20',
      popular: true,
      features: [
        'Unlimited beam sessions',
        'Rich Lexi note editor',
        'File uploads (up to 100MB per file)',
        'Up to 10 connected devices per beam',
        '30-day session history',
        'All content types (text, images, audio, video)',
        'Advanced drag & drop organization',
        'Session saving and naming',
        'Priority email support'
      ],
      limitations: []
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: <FiShield className="w-6 h-6" />,
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'Advanced features for teams and heavy users',
      color: 'from-purple-400 to-indigo-600',
      bgColor: 'bg-purple-600/10',
      borderColor: 'border-purple-600/20',
      features: [
        'Everything in Pro',
        'Advanced file uploads (up to 500MB per file)',
        'Unlimited connected devices',
        'Unlimited session history',
        'Advanced beam sharing permissions',
        'Session templates & presets',
        'Advanced archive management',
        'Custom beam organization',
        'Live chat support',
        'Export capabilities'
      ],
      limitations: []
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: <FiUsers className="w-6 h-6" />,
      price: { monthly: 49.99, yearly: 499.99 },
      description: 'Full-scale solution for organizations',
      color: 'from-indigo-400 to-purple-600',
      bgColor: 'bg-indigo-600/10',
      borderColor: 'border-indigo-600/20',
      features: [
        'Everything in Premium',
        'Team collaboration dashboard',
        'Admin user management',
        'Custom beam branding',
        'API access for integrations',
        'SSO integration',
        'Advanced analytics',
        'Custom file size limits',
        'Priority support with SLA',
        'Custom onboarding',
        'White-label options'
      ],
      limitations: []
    }
  ];

  const handlePlanSelect = (planId) => {
    if (planId === 'free') {
      if (isAuthenticated) {
        toast.success('You\'re already on the Free plan!');
      } else {
        toast.success('Sign up to get started with the Free plan!');
      }
      return;
    }
    
    if (!isAuthenticated) {
      toast.error('Please log in to upgrade your plan');
      return;
    }
    
    setSelectedPlan(planId);
    // Here you would integrate with your payment processor
    toast.success(`Selected ${plans.find(p => p.id === planId)?.name} plan!`);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
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
            Choose Your Plan
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Unlock the full potential of seamless content sharing and collaboration across all your devices
          </motion.p>
          
          {/* Billing Toggle */}
          <motion.div 
            className="flex items-center justify-center gap-4 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className='flex items-center justify-center gap-4 mb-4 relative'>

            <span className={`text-sm ${!isYearly ? 'text-white font-semibold' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                isYearly 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                  : 'bg-gray-600'
              }`}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: isYearly ? 36 : 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'text-white font-semibold' : 'text-gray-400'}`}>
              Yearly
            </span>
            {isYearly && (
              <motion.div 
                className="bg-green-500/20 text-green-400 absolute top-15 md:top-auto md:-right-25 px-3 py-1 rounded-full text-xs font-semibold border border-green-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Save 15%
              </motion.div>
            )}
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => {
            const price = isYearly ? plan.price.yearly : plan.price.monthly;
            const originalYearlyPrice = plan.price.monthly * 12;
            const yearlySavings = originalYearlyPrice - plan.price.yearly;
            
            return (
              <motion.div
                key={plan.id}
                className={`relative rounded-2xl p-8 ${plan.bgColor} ${plan.borderColor} border backdrop-blur-xl transition-all duration-500 group flex flex-col h-full`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  >
                    Most Popular
                  </motion.div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <motion.div 
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    {plan.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold goldman-regular text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">
                      ${price}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-400">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {isYearly && plan.price.monthly > 0 && yearlySavings > 0 && (
                    <motion.p 
                      className="text-green-400 text-sm mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      Save ${yearlySavings.toFixed(2)} per year
                    </motion.p>
                  )}
                  {!isYearly && plan.price.monthly > 0 && (
                    <p className="text-gray-500 text-sm mt-1">
                      ${plan.price.yearly}/year
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div 
                      key={featureIndex}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                    >
                      <FiCheck className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                  {plan.limitations.map((limitation, limitIndex) => (
                    <motion.div 
                      key={limitIndex}
                      className="flex items-start gap-3 opacity-60"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 0.6, x: 0 }}
                      transition={{ delay: (index * 0.1) + ((plan.features.length + limitIndex) * 0.05) }}
                    >
                      <FiX className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 text-sm leading-relaxed line-through">
                        {limitation}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 mt-auto ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index * 0.1) + 0.8 }}
                >
                  {plan.price.monthly === 0 ? 'Get Started Free' : 'Choose Plan'}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <motion.div 
          className="bg-[#1A1B2E]/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold goldman-regular text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-8">
            Feature Comparison
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-4 text-gray-300 font-semibold">Features</th>
                  {plans.map(plan => (
                    <th key={plan.id} className="pb-4 text-center text-gray-300 font-semibold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="space-y-4">
                {[
                  ['Beam Sessions', '3', 'Unlimited', 'Unlimited', 'Unlimited'],
                  ['Connected Devices', '2', '10', 'Unlimited', 'Unlimited'],
                  ['Session History', '7 days', '30 days', 'Unlimited', 'Unlimited'],
                  ['File Uploads', '❌', '100MB', '500MB', 'Custom'],
                  ['Rich Editor', '❌', '✅', '✅', '✅'],
                  ['Advanced Permissions', '❌', '❌', '✅', '✅'],
                  ['API Access', '❌', '❌', '❌', '✅'],
                  ['SSO Integration', '❌', '❌', '❌', '✅'],
                  ['Priority Support', '❌', 'Email', 'Live Chat', 'SLA'],
                ].map(([feature, ...values], index) => (
                  <motion.tr 
                    key={feature}
                    className="border-b border-gray-800/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + (index * 0.05) }}
                  >
                    <td className="py-3 text-gray-300 font-medium">{feature}</td>
                    {values.map((value, valueIndex) => (
                      <td key={valueIndex} className="py-3 text-center text-gray-400">
                        {value}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold goldman-regular text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                question: "Can I upgrade or downgrade my plan anytime?",
                answer: "Yes! You can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle."
              },
              {
                question: "What happens to my data if I downgrade?",
                answer: "Your data remains safe. If you exceed the limits of your new plan, you'll have read-only access to older content until you're within the limits."
              },
              {
                question: "Is there a free trial for paid plans?",
                answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all paid plans. Contact our support team if you're not satisfied."
              }
            ].map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-[#1A1B2E]/30 backdrop-blur-sm border border-purple-500/10 rounded-xl p-6 text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + (index * 0.1) }}
                whileHover={{ 
                  borderColor: 'rgba(127, 90, 240, 0.3)'
                }}
              >
                <h3 className="font-semibold text-white mb-3 goldman-regular">
                  {faq.question}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-12 max-w-4xl mx-auto">
            <motion.h2 
              className="text-4xl font-bold goldman-regular text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              Ready to Get Started?
            </motion.h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join thousands of users who are already sharing content seamlessly across all their devices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => handlePlanSelect('free')}
                className="brain-boom-btn px-8 py-4 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Today
              </motion.button>
              <motion.button
                onClick={() => handlePlanSelect('pro')}
                className="brain-boom-btn px-8 py-4 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Pro Free
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;
