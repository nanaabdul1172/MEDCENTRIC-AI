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
    // Additional features with defaults (to match backend schema)
    fbs_True: 0,
    restecg_normal: 1,
    restecg_st_abnomality: 0,
    slope_upsloping: 0,
    thal_normal: 1,
    thal_reversable_defect: 0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Dynamic API URL: uses environment variable in production, localhost in dev
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);

      // Add to session history
      const newEntry = { ...formData, ...data, timestamp: new Date().toLocaleTimeString() };
      setHistory([newEntry, ...history]);
    } catch (error) {
      console.error('Error connecting to Medcentric AI backend:', error);
      alert('Could not connect to the backend server.');
    }
    setLoading(false);
  };

  const downloadReport = () => {
    if (!result) return;
    const reportContent = `--- MEDCENTRIC AI CLINICAL ASSESSMENT REPORT ---
Timestamp: ${new Date().toLocaleString()}

⚠️ DISCLAIMER: This is an educational prototype. Not for clinical use.

Patient Vitals:
- Age: ${formData.age} yrs
- Resting BP: ${formData.trestbps} mmHg
- Cholesterol: ${formData.chol} mg/dl
- Max Heart Rate: ${formData.thalch} bpm
- Oldpeak: ${formData.oldpeak}

Clinical Indicators:
- Fasting Blood Sugar > 120 mg/dl: ${formData.fbs_True ? 'Yes' : 'No'}
- Exercise Induced Angina: ${formData.exang_True ? 'Yes' : 'No'}
- ST Slope: ${formData.slope_flat ? 'Flat' : (formData.slope_upsloping ? 'Upsloping' : 'Downsloping')}

Assessment Result: ${result.status}
Confidence Score: ${result.confidence}%

This assessment is based on a Random Forest machine learning model 
trained on the UCI Heart Disease dataset (85.87% accuracy on test set).

IMPORTANT: Consult a qualified healthcare professional for medical advice.
---------------------------------------------`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Medcentric_Report_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      {/* Clinical Disclaimer & Safety Notice Banner */}
      <div className="w-full max-w-3xl mb-6 mt-4 bg-amber-50 border-2 border-amber-400 rounded-xl p-4 shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl mt-0.5">⚠️</div>
          <div>
            <h2 className="text-base font-bold text-amber-900 mb-1">
              Clinical Disclaimer & Safety Notice
            </h2>
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Medcentric AI is an educational prototype and research demonstration.</strong> This system is <strong>NOT a medical diagnostic tool</strong> and should <strong>NEVER be used for clinical decision-making or patient care</strong>. All predictions are statistical estimates based on historical data and must not replace professional medical evaluation, testing, or physician consultation. If you are experiencing a medical emergency, call 911 immediately.
            </p>
          </div>
        </div>
      </div>

      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medcentric AI</h1>
        <p className="text-slate-600 mt-1">Advanced Cardiovascular Risk Assessment Dashboard</p>
      </header>

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Form Column */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Patient Vitals Input</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Resting BP (trestbps)</label>
              <input type="number" name="trestbps" value={formData.trestbps} onChange={handleChange} className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Cholesterol (chol)</label>
              <input type="number" name="chol" value={formData.chol} onChange={handleChange} className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Max Heart Rate (thalch)</label>
              <input type="number" name="thalch" value={formData.thalch} onChange={handleChange} className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Oldpeak</label>
              <input type="number" step="0.1" name="oldpeak" value={formData.oldpeak} onChange={handleChange} className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Fasting Blood Sugar &gt; 120 mg/dl</label>
              <select name="fbs_True" value={formData.fbs_True} onChange={handleChange} className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white">
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            <div className="sm:col-span-2 border-t pt-4 mt-2">
              <h3 className="text-xs font-bold uppercase text-slate-700 mb-3">Clinical Indicators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Exercise Induced Angina</label>
                  <select name="exang_True" value={formData.exang_True} onChange={handleChange} className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">ST Slope Type</label>
                  <select 
                    name="slope_type" 
                    value={formData.slope_flat ? 'flat' : (formData.slope_upsloping ? 'upsloping' : 'downsloping')} 
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        slope_flat: value === 'flat' ? 1 : 0,
                        slope_upsloping: value === 'upsloping' ? 1 : 0,
                      });
                    }}
                    className="w-full p-2.5 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
                  >
                    <option value="downsloping">Downsloping</option>
                    <option value="flat">Flat</option>
                    <option value="upsloping">Upsloping</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 mt-4">
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm text-sm">
                {loading ? 'Analyzing Vitals...' : 'Evaluate Heart Risk'}
              </button>
            </div>
          </form>
        </div>

        {/* Results & Risk Gauge Column */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Assessment Result</h2>
            {result ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg text-center ${result.risk_detected ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                  <h3 className="font-bold text-base">{result.status === "High Risk" ? "⚠️ High Risk Detected" : "✅ Low Risk / Normal"}</h3>
                  <p className="text-xs mt-1 font-semibold">Confidence: {result.confidence}%</p>
                </div>

                {/* Risk Gauge Visual Bar */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                    <span>Risk Meter</span>
                    <span>{result.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${result.risk_detected ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <button 
                  onClick={downloadReport} 
                  className="w-full bg-slate-800 text-white p-2.5 rounded-lg text-xs font-semibold hover:bg-slate-900 transition"
                >
                  Download Report (.doc)
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-12">Submit patient vitals to generate a live clinical assessment and risk gauge.</p>
            )}
          </div>
        </div>
      </div>

      {/* Patient History Log */}
      {history.length > 0 && (
        <div className="w-full max-w-3xl mt-6 bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-3">Session History Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase">
                <tr>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Age</th>
                  <th className="p-2.5">BP</th>
                  <th className="p-2.5">Chol</th>
                  <th className="p-2.5">FBS</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono">{item.timestamp}</td>
                    <td className="p-2.5">{item.age}</td>
                    <td className="p-2.5">{item.trestbps}</td>
                    <td className="p-2.5">{item.chol}</td>
                    <td className="p-2.5">{item.fbs_True ? 'Y' : 'N'}</td>
                    <td className={`p-2.5 font-bold ${item.risk_detected ? 'text-red-600' : 'text-emerald-600'}`}>{item.status}</td>
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