import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calculator, AlertCircle, Loader2 } from 'lucide-react';

const CarbonCalculator = ({ isLoading = false }) => {
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
    <div className="w-full h-full bg-neutral-900 p-6 rounded-xl">
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
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              <p className="text-neutral-400">Updating calculator...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full gap-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-500" />
                <h2 className="text-lg font-medium text-neutral-100">
                  Carbon Footprint Calculator
                </h2>
              </div>
              <AlertCircle className="w-5 h-5 text-neutral-500" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-neutral-400">
                    Monthly Electricity Usage (kWh)
                  </label>
                  <input
                    type="number"
                    value={values.electricity}
                    onChange={(e) => handleInputChange('electricity', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-100"
                    placeholder="Enter amount"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-neutral-400">
                    Monthly Transport Distance (km)
                  </label>
                  <input
                    type="number"
                    value={values.transport}
                    onChange={(e) => handleInputChange('transport', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-100"
                    placeholder="Enter distance"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-neutral-400">
                    Monthly Waste (kg)
                  </label>
                  <input
                    type="number"
                    value={values.waste}
                    onChange={(e) => handleInputChange('waste', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-neutral-100"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-neutral-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-neutral-300 mb-2">
                  Estimated Carbon Emissions
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-medium text-cyan-500">
                    {totalEmissions.toFixed(2)}
                  </span>
                  <span className="text-sm text-neutral-400">
                    tonnes CO₂e/year
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="ghost-secondary" size="sm">
                Reset
              </Button>
              <Button variant="primary" size="sm">
                Calculate
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarbonCalculator;