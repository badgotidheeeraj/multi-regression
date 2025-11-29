import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Extract number from string like "[12345.67]"
  const refine = (result) => {
    const numberMatch = result.match(/\d+(\.\d+)?/);
    const number = numberMatch ? parseFloat(numberMatch[0]).toFixed(2) : "N/A";
    return number;
  };

  const handlePredict = async () => {
    if (!age || !height || !weight) {
      setResult("⚠️ Please fill all fields!");
      setShowModal(true);
      return;
    }

    const query = new URLSearchParams({ age, height, weight }).toString();
    setLoading(true);
    setResult("");
    setShowModal(false);

    try {
      const res = await fetch(`http://127.0.0.1:8000/items/10?${query}`);

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        const message =
          errBody?.detail ||
          JSON.stringify(errBody) ||
          res.statusText ||
          `HTTP ${res.status}`;
        setResult(`❌ Error ${res.status}: ${message}`);
      } else {
        const data = await res.json();
        setResult(`🎉 Prediction: ${JSON.stringify(data.prediction)}`);
      }

      setShowModal(true);
    } catch {
      setResult("❌ Network or parsing error");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-fuchsia-700 via-purple-900 to-black p-5">

    {/* PAPER HEADER */}
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="mb-8 text-center"
    >
      <h1 className="text-4xl font-extrabold text-white drop-shadow-xl">
        📄 Insurance Premium Prediction Report
      </h1>
      <p className="text-gray-300 mt-2 text-sm">
        Multi Regression AI Model based on Age, Height, and Weight
      </p>
    </motion.div>
  
    {/* MAIN CARD */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 10 }}
      className="w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 text-white"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-xl">
          🎉 Hip Hip Huraa! AI Predictor
        </h1>
        <p className="text-sm text-gray-300 mt-2">
          Enter values and watch the magic happen ✨
        </p>
      </div>
  
      {/* INPUTS */}
      <div className="space-y-5">
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          type="number"
          placeholder="Age"
          className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-200 text-white focus:ring-2 focus:ring-pink-400 outline-none"
        />
        <input
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          type="number"
          placeholder="Height (cm)"
          className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-200 text-white focus:ring-2 focus:ring-pink-400 outline-none"
        />
        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          type="number"
          placeholder="Weight (kg)"
          className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-200 text-white focus:ring-2 focus:ring-pink-400 outline-none"
        />
      </div>
  
      {/* BUTTON */}
      <motion.button
        onClick={handlePredict}
        disabled={loading}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-full mt-7 py-3 bg-gradient-to-r from-yellow-300 to-yellow-400 text-black text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50"
      >
        {loading ? "Predicting..." : "🚀 Predict Now"}
      </motion.button>
    </motion.div>
  
    {/* MODAL */}
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
            className="bg-gradient-to-r from-pink-500/40 to-purple-500/40 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 text-white max-w-sm w-full text-center"
          >
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 drop-shadow-lg">
              🔹 Insurance Premium Prediction
            </h2>
            <p className="text-sm text-gray-200 mb-4">
              Based on <span className="font-bold">Age, Height, and Weight</span>
            </p>
  
            {/* Prediction */}
            <p className="mb-5 text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 drop-shadow-lg">
              💰 {refine(result)}
            </p>
  
            {/* Inputs Summary */}
            <div className="text-gray-200 text-sm mb-4">
              <p>🧑 Age: {age}</p>
              <p>📏 Height: {height} cm</p>
              <p>⚖️ Weight: {weight} kg</p>
            </div>
  
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 px-6 py-2 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  
  );
}
