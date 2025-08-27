import React, { useState } from 'react';
import { Stethoscope, Search, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const SYMPTOM_DATABASE = [
  {
    symptoms: ['fever', 'cough', 'fatigue', 'body aches'],
    disease: 'Common Cold',
    severity: 'mild',
    recommendations: [
      'Get plenty of rest',
      'Stay hydrated',
      'Consider over-the-counter pain relievers',
      'Monitor symptoms for worsening'
    ]
  },
  {
    symptoms: ['chest pain', 'shortness of breath', 'nausea', 'sweating'],
    disease: 'Possible Heart Issue',
    severity: 'severe',
    recommendations: [
      'Seek immediate medical attention',
      'Call emergency services if severe',
      'Do not ignore chest pain',
      'Avoid physical exertion'
    ]
  },
  {
    symptoms: ['headache', 'nausea', 'sensitivity to light', 'vomiting'],
    disease: 'Migraine',
    severity: 'moderate',
    recommendations: [
      'Rest in a dark, quiet room',
      'Apply cold or warm compress',
      'Stay hydrated',
      'Consider prescribed migraine medication'
    ]
  },
  {
    symptoms: ['fever', 'severe headache', 'stiff neck', 'confusion'],
    disease: 'Possible Meningitis',
    severity: 'severe',
    recommendations: [
      'Seek emergency medical care immediately',
      'This is a medical emergency',
      'Do not delay treatment',
      'Call 911 or go to emergency room'
    ]
  },
  {
    symptoms: ['persistent cough', 'weight loss', 'night sweats', 'fatigue'],
    disease: 'Possible Tuberculosis',
    severity: 'moderate',
    recommendations: [
      'Consult a doctor immediately',
      'Get tested for tuberculosis',
      'Avoid close contact with others',
      'Follow isolation guidelines if diagnosed'
    ]
  },
  {
    symptoms: ['stomach pain', 'diarrhea', 'nausea', 'vomiting'],
    disease: 'Gastroenteritis',
    severity: 'mild',
    recommendations: [
      'Stay hydrated with clear fluids',
      'Rest and avoid solid foods temporarily',
      'Use oral rehydration solutions',
      'Consult doctor if symptoms persist'
    ]
  }
];

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const analyzeSymptoms = () => {
    setLoading(true);
    setHasSearched(true);

    // Simulate API call delay
    setTimeout(() => {
      const searchTerms = symptoms.toLowerCase().split(',').map(s => s.trim());
      
      const matches = SYMPTOM_DATABASE
        .map(condition => {
          const matchCount = condition.symptoms.filter(symptom =>
            searchTerms.some(term => symptom.includes(term) || term.includes(symptom))
          ).length;
          
          return {
            ...condition,
            matchCount,
            confidence: Math.round((matchCount / condition.symptoms.length) * 100)
          };
        })
        .filter(condition => condition.matchCount > 0)
        .sort((a, b) => b.confidence - a.confidence);

      setResults(matches);
      setLoading(false);
    }, 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild':
        return <CheckCircle className="h-4 w-4" />;
      case 'moderate':
        return <Info className="h-4 w-4" />;
      case 'severe':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Symptom Checker</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Describe your symptoms and get preliminary health insights. This tool provides 
            general information and should not replace professional medical advice.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Medical Disclaimer</p>
              <p className="mt-1">
                This symptom checker is for informational purposes only and does not constitute 
                medical advice. Always consult with a qualified healthcare professional for 
                proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>

        {/* Symptom Input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Describe your symptoms (separated by commas)
          </label>
          <div className="flex space-x-3">
            <div className="flex-1">
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., fever, headache, cough, fatigue"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
          <button
            onClick={analyzeSymptoms}
            disabled={!symptoms.trim() || loading}
            className="mt-4 w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing symptoms...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Analyze Symptoms</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <Stethoscope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                <p className="text-gray-600">
                  We couldn't find any conditions matching your symptoms. Please consult 
                  with a healthcare professional for proper evaluation.
                </p>
              </div>
            ) : (
              results.map((result, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{result.disease}</h3>
                      <p className="text-sm text-gray-600">Confidence: {result.confidence}%</p>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getSeverityColor(result.severity)}`}>
                      {getSeverityIcon(result.severity)}
                      <span className="capitalize">{result.severity}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {result.severity === 'severe' && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">
                          Urgent medical attention recommended
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}