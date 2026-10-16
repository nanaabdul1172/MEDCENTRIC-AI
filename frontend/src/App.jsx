import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    age: 58,
    trestbps: 140,
    chol: 245,
    thalch: 130,
    oldpeak: 1.5,
    exang_True: 1,
    slope_flat: 1,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Dynamic API URL: uses environment variable in production, falls back to localhost in dev
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);

      // Add entry to session history
      const newEntry = { ...formData, ...data, timestamp: new Date().toLocaleTimeString() };
      setHistory([newEntry, ...history]);
    } catch (error) {
      console.error('Error connecting to Medcentric AI backend:', error);
      alert('Could not connect to the backend server. Please verify the API status.');
    }
    setLoading(false);
  };

  const downloadReport = () => {
    if (!result) return;
    const reportContent = `--- MEDCENTRIC AI CLINICAL ASSESSMENT REPORT ---
Timestamp: ${new Date().toLocaleString()}

PATIENT VITALS & METRICS:
- Age: ${formData.age} yrs
- Resting Blood Pressure: ${formData.trestbps} mm Hg
- Serum Cholesterol: ${formData.chol} mg/dl
- Max Heart Rate Achieved: ${formData.thalch} bpm
- ST Depression (Oldpeak): ${formData.oldpeak}
- Exercise Induced Angina: ${formData.exang_True === 1 ? 'Yes' : 'No'}
- Peak Exercise ST Slope (Flat): ${formData.slope_flat === 1 ? 'Yes (Flat)' : 'No (Upsloping/Downsloping)'}

ASSESSMENT OUTCOME:
- Risk Status: ${result.status}
- Confidence Score: ${result.confidence}%
- Classification Result: ${result.risk_detected ? 'High Risk Detected' : 'Low Risk / Normal'}

DISCLAIMER: Medcentric AI is an educational demonstrator and prototype. This report is non-diagnostic and should not replace professional clinical evaluation.
--------------------------------------------------`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Medcentric_Report_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 sm:p-6 flex flex-col items-center">
      {/* App Header */}
      <header className="mb-6 text-center mt-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medcentric AI</h1>
        <p className="text-slate-600 text-sm mt-1">Advanced Cardiovascular Risk Assessment Dashboard</p>
      </header>

      {/* Clinical Disclaimer Safety Notice Banner */}
      <div className="w-full max-w-3xl mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
        <div className="flex items-start">
          <div className="ml-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
              ⚠️ Clinical Disclaimer & Safety Notice
            </h3>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              <strong>Medcentric AI is an educational prototype</strong> and research demonstrator, not an FDA-approved diagnostic tool. A low-risk output cannot rule out heart disease and should never delay seeking immediate medical attention or professional evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form & Assessment Results */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Input Form Column */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-4">Patient Vitals & Clinical Metrics</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Age */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700">Age</label>
              <p className="text-[11px] text-slate-500 mb-1">Patient's age in years.</p>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                required
              />
            </div>

            {/* Resting BP */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700">Resting BP (trestbps)</label>
              <p className="text-[11px] text-slate-500 mb-1">Resting blood pressure in mm Hg on admission.</p>
              <input
                type="number"
                name="trestbps"
                value={formData.trestbps}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                required
              />
            </div>

            {/* Cholesterol */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700">Serum Cholesterol (chol)</label>
              <p className="text-[11px] text-slate-500 mb-1">Serum cholesterol measurement in mg/dl.</p>
              <input
                type="number"
                name="chol"
                value={formData.chol}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                required
              />
            </div>

            {/* Max Heart Rate */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700">Max Heart Rate (thalch)</label>
              <p className="text-[11px] text-slate-500 mb-1">Maximum heart rate achieved during exercise (bpm).</p>
              <input
                type="number"
                name="thalch"
                value={formData.thalch}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                required
              />
            </div>

            {/* Oldpeak */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700">ST Depression (oldpeak)</label>
              <p className="text-[11px] text-slate-500 mb-1">ST depression induced by exercise relative to rest.</p>
              <input
                type="number"
                step="0.1"
                name="oldpeak"
                value={formData.oldpeak}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                required
              />
            </div>

            {/* Exercise Angina */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700">Exercise Angina (exang)</label>
              <p className="text-[11px] text-slate-500 mb-1">Presence of chest pain during exertion.</p>
              <select
                name="exang_True"
                value={formData.exang_True}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
              >
                <option value={1}>Yes (Angina Induced)</option>
                <option value={0}>No (No Angina)</option>
              </select>
            </div>

            {/* Peak Exercise ST Slope */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase text-slate-700">ST Segment Slope (slope)</label>
              <p className="text-[11px] text-slate-500 mb-1">Slope of peak exercise ST segment on an ECG trace.</p>
              <select
                name="slope_flat"
                value={formData.slope_flat}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
              >
                <option value={1}>Flat Slope</option>
                <option value={0}>Upsloping / Downsloping</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm text-sm disabled:opacity-50"
              >
                {loading ? 'Analyzing Vitals...' : 'Evaluate Heart Risk'}
              </button>
            </div>
          </form>
        </div>

        {/* Assessment Results & Dynamic Risk Meter */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-4">Assessment Result</h2>
            {result ? (
              <div className="space-y-5">
                <div
                  className={`p-4 rounded-lg text-center ${
                    result.risk_detected
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <h3 className="font-bold text-base">
                    {result.status === 'High Risk' ? '⚠️ High Risk Detected' : '✅ Low Risk / Normal'}
                  </h3>
                  <p className="text-xs mt-1 font-semibold">Confidence: {result.confidence}%</p>
                </div>

                {/* Risk Gauge Visual Bar */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Risk Gauge</span>
                    <span>{result.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        result.risk_detected ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>

                {/* Download Clinical Report Button */}
                <button
                  onClick={downloadReport}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-lg text-xs font-semibold hover:bg-slate-900 transition shadow-sm"
                >
                  Download Report (.txt)
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">
                Submit patient vitals to generate a live clinical risk assessment and visualization meter.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Patient Assessment Session History Log */}
      {history.length > 0 && (
        <div className="w-full max-w-3xl mt-6 bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h2 className="text-base font-bold text-slate-800 mb-3">Session History Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase">
                <tr>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Age</th>
                  <th className="p-2.5">BP</th>
                  <th className="p-2.5">Chol</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-500">{item.timestamp}</td>
                    <td className="p-2.5">{item.age}</td>
                    <td className="p-2.5">{item.trestbps}</td>
                    <td className="p-2.5">{item.chol}</td>
                    <td className={`p-2.5 font-bold ${item.risk_detected ? 'text-red-600' : 'text-emerald-600'}`}>
                      {item.status}
                    </td>
                    <td className="p-2.5">{item.confidence}%</td>
                  </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}