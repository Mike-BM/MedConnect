import React, { useState, useEffect } from 'react';
import { Heart, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

const HEALTH_TIPS = [
  {
    title: "Stay Hydrated",
    content: "Drink at least 8 glasses of water daily to maintain proper body function, support digestion, and keep your skin healthy.",
    category: "Nutrition"
  },
  {
    title: "Regular Exercise",
    content: "Aim for at least 30 minutes of moderate exercise daily. This can include walking, swimming, or cycling to improve cardiovascular health.",
    category: "Fitness"
  },
  {
    title: "Quality Sleep",
    content: "Get 7-9 hours of quality sleep each night. Good sleep is essential for immune function, mental health, and overall well-being.",
    category: "Sleep"
  },
  {
    title: "Balanced Diet",
    content: "Include a variety of fruits, vegetables, whole grains, and lean proteins in your diet for optimal nutrition and energy.",
    category: "Nutrition"
  },
  {
    title: "Mental Health",
    content: "Practice stress management techniques like meditation, deep breathing, or yoga to maintain good mental health.",
    category: "Mental Health"
  },
  {
    title: "Regular Checkups",
    content: "Schedule regular health checkups and screenings to catch potential health issues early and maintain preventive care.",
    category: "Prevention"
  }
];

export default function HealthTips() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % HEALTH_TIPS.length);
    }, 10000); // Change tip every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % HEALTH_TIPS.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + HEALTH_TIPS.length) % HEALTH_TIPS.length);
  };

  const tip = HEALTH_TIPS[currentTip];

  return (
    <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-sm p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Health Tip of the Day</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevTip}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextTip}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="h-4 w-4 text-yellow-300" />
          <h4 className="font-medium">{tip.title}</h4>
          <span className="px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full">
            {tip.category}
          </span>
        </div>
        <p className="text-green-100 text-sm leading-relaxed">
          {tip.content}
        </p>
      </div>

      <div className="flex justify-center space-x-1">
        {HEALTH_TIPS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTip(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentTip ? 'bg-white' : 'bg-white bg-opacity-40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}