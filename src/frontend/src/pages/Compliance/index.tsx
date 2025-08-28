import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Compliance: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando compliance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Compliance</h1>
        <p className="text-gray-600 mt-2">
          Monitoramento de conformidade com frameworks de segurança
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { framework: 'OWASP Top 10', score: 85, status: 'Compliant', issues: 3 },
          { framework: 'ISO 27001', score: 72, status: 'Partial', issues: 8 },
          { framework: 'NIST Framework', score: 90, status: 'Compliant', issues: 1 },
          { framework: 'PCI DSS', score: 68, status: 'Non-Compliant', issues: 12 },
          { framework: 'SOC 2', score: 78, status: 'Partial', issues: 6 },
          { framework: 'GDPR', score: 95, status: 'Compliant', issues: 0 }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.framework}</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-blue-600">{item.score}%</span>
              <span className={`text-sm px-2 py-1 rounded ${
                item.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                item.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {item.status}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  item.score >= 90 ? 'bg-green-500' :
                  item.score >= 70 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {item.issues} {item.issues === 1 ? 'issue' : 'issues'} {item.issues === 1 ? 'encontrado' : 'encontrados'}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Compliance; 