import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Input } from '../../components/ui/input';

interface CarbonCalculatorProps {
  isLoading?: boolean;
  state?: {
    type: 'error' | 'clarification' | 'version';
    data?: {
      features?: string[];
      errorMessage?: string;
      question?: string;
      highlightedFields?: string[];
    };
  };
}

const CarbonCalculator = ({ isLoading = false, state }: CarbonCalculatorProps) => {
  const [values, setValues] = useState({
    electricity: '',
    transport: '',
    waste: '',
    water: ''
  });
  
  const [totalEmissions, setTotalEmissions] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mock calculation
    const newTotal = Object.values({ ...values, [field]: value })
      .reduce((acc, val) => acc + (Number(val) || 0), 0) * 0.5;
    setTotalEmissions(newTotal);
  };

  // Handle different visual states
  const renderClarificationHighlight = () => {
    if (state?.type === 'clarification' && state.data?.question) {
      // Map questions to relevant fields
      const fieldMapping: Record<string, string[]> = {
        'data visualization': ['electricity', 'transport', 'waste'],
        'real-time updates': ['electricity', 'transport'],
        'smart home devices': ['electricity'],
        'export to PDF': ['results'],
        'authentication': ['user-section'],
        'email notifications': ['results'],
        'search functionality': ['history'],
        'feedback rating': ['results'],
      };

      // Find matching keywords in the question
      const keywords = Object.keys(fieldMapping);
      const matchingKeyword = keywords.find(keyword => 
        state.data?.question?.toLowerCase().includes(keyword)
      );

      if (matchingKeyword) {
        return fieldMapping[matchingKeyword].map(field => (
          <motion.div
            key={field}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 ring-2 ring-blue-500/50 rounded-lg"
          />
        ));
      }
    }
    return null;
  };

  return (
    <div className="relative w-full h-full bg-white">
      {/* Main Content */}
      <motion.div
        animate={{
          scale: state?.type === 'error' ? 0.98 : 1,
          opacity: state?.type === 'error' ? 0.7 : 1
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full h-full p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">
              Carbon Footprint Calculator
            </h2>
          </div>
          <AlertCircle className="w-5 h-5 text-gray-400" />
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className={cn(
            "space-y-2",
            state?.data?.highlightedFields?.includes('electricity') && "relative ring-2 ring-blue-500 rounded-lg p-2"
          )}>
            <label className="text-sm text-gray-600">
              Monthly Electricity Usage (kWh)
            </label>
            <Input
              type="number"
              value={values.electricity}
              onChange={(e) => handleInputChange('electricity', e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div className={cn(
            "space-y-2",
            state?.data?.highlightedFields?.includes('transport') && "relative ring-2 ring-blue-500 rounded-lg p-2"
          )}>
            <label className="text-sm text-gray-600">
              Monthly Transport Distance (km)
            </label>
            <Input
              type="number"
              value={values.transport}
              onChange={(e) => handleInputChange('transport', e.target.value)}
              placeholder="Enter distance"
            />
          </div>
          
          <div className={cn(
            "space-y-2",
            state?.data?.highlightedFields?.includes('waste') && "relative ring-2 ring-blue-500 rounded-lg p-2"
          )}>
            <label className="text-sm text-gray-600">
              Monthly Waste (kg)
            </label>
            <Input
              type="number"
              value={values.waste}
              onChange={(e) => handleInputChange('waste', e.target.value)}
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Estimated Carbon Emissions
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-medium text-blue-500">
              {totalEmissions.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600">
              tonnes CO₂e/year
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button 
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Reset
          </button>
          <button 
            className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Calculate
          </button>
        </div>

        {/* Clarification Highlights */}
        <AnimatePresence>
          {state?.type === 'clarification' && renderClarificationHighlight()}
        </AnimatePresence>

        {/* Version Update Overlay */}
        {state?.type === 'version' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-neutral-950/50 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="p-4 rounded-lg shadow-lg">
              <h3 className="text-body-sm font-base mb-2">New Features Added</h3>
              <ul className="space-y-1">
                {state.data?.features?.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm text-gray-600"
                  >
                    • {feature}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Error Overlay */}
      <AnimatePresence mode="wait">
        {state?.type === 'error' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-neutral-950/80 flex items-center justify-center backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-4 p-6 bg-neutral-900/50 rounded-xl backdrop-blur-md"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </motion.div>
              <p className="text-body font-base text-red-300 text-center max-w-md">
                {state.data?.errorMessage}
              </p>
              <div className="flex gap-2 mt-2">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2
                  }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4
                  }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-800 flex items-center justify-center"
          >
            <Loader2 className="w-12 h-12 text-neutral-500 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarbonCalculator;