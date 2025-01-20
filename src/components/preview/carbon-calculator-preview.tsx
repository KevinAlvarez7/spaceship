import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, AlertCircle, Loader2, AlertTriangle } from 'lucide-react';

interface CarbonCalculatorProps {
  isLoading?: boolean;
  state?: {
    type: 'error' | 'clarification' | 'version';
    data?: {
      features?: string[];
      errorMessage?: string;
    };
  };
}

const CarbonCalculator = ({ isLoading = false, state }: CarbonCalculatorProps) => {
  const [values, setValues] = useState({
    electricity: '',
    transport: '',
    waste: ''
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

  return (
    <div className="relative w-full h-full bg-stone-700">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-stone-100 animate-spin" />
              <p className="text-stone-100">Buidling prototype...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full bg-gray-100 p-6 gap-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-medium text-gray-900">
                  Carbon Footprint Calculator
                </h2>
              </div>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    Monthly Electricity Usage (kWh)
                  </label>
                  <input
                    type="number"
                    value={values.electricity}
                    onChange={(e) => handleInputChange('electricity', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900"
                    placeholder="Enter amount"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    Monthly Transport Distance (km)
                  </label>
                  <input
                    type="number"
                    value={values.transport}
                    onChange={(e) => handleInputChange('transport', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900"
                    placeholder="Enter distance"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    Monthly Waste (kg)
                  </label>
                  <input
                    type="number"
                    value={values.waste}
                    onChange={(e) => handleInputChange('waste', e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
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
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Overlay */}
      {state?.type === 'error' && (
        <div className="absolute inset-0 bg-neutral-950/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
            <p className="text-body font-base text-red-300">{state.data?.errorMessage}</p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-950/50" />
      )}
    </div>
  );
};

export default CarbonCalculator;