'use client';

import { useState } from 'react';

export default function DiseaseDetectionPage() {
  const [form, setForm] = useState({
    cropType: '',
    growthStage: '',
    symptomsObserved: '',
    location: '',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/disease-detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Error detecting disease:', error);
      setResult({ error: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🌿 Plant Disease Diagnosis</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="cropType"
          placeholder="Crop Type (e.g., Tomato)"
          value={form.cropType}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="growthStage"
          placeholder="Growth Stage (e.g., Flowering)"
          value={form.growthStage}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <textarea
          name="symptomsObserved"
          placeholder="Describe symptoms (e.g., yellow spots, curling leaves)"
          value={form.symptomsObserved}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="location"
          placeholder="Location (optional)"
          value={form.location}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Diagnosing...' : 'Diagnose Disease'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-green-700 mb-2">🩺 Diagnosis</h2>
              <p><strong>Disease:</strong> {result.disease}</p>
              <p><strong>Description:</strong> {result.description}</p>
              <p><strong>Solution:</strong> {result.solution}</p>
              <p className="italic text-blue-600 mt-2">🌱 {result.motivationalMessage}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
