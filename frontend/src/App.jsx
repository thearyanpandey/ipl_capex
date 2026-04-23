import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Search, TrendingUp } from 'lucide-react';

// 1. IMPORT YOUR REAL SQL DATA HERE
import playersData from './assets/ipl_database.json'; // Make sure this matches your file name!

export default function App() {
  // Calculator State
  const [discountRate, setDiscountRate] = useState(10);
  const [superstarCost, setSuperstarCost] = useState(15000000);
  const [academyCost, setAcademyCost] = useState(20000000);
  const [undervaluedCost, setUndervaluedCost] = useState(6000000);

  // Table State
  const [searchTerm, setSearchTerm] = useState('');
  const [minSR, setMinSR] = useState(130); // Lowered the default so you can see more players initially

  // NPV Calculation Logic
  const calculateNPV = (initialCost, annualCost) => {
    let npv = -initialCost;
    for (let t = 1; t <= 5; t++) {
      npv -= annualCost / Math.pow(1 + discountRate / 100, t);
    }
    return Math.round(npv);
  };

  const npvA = calculateNPV(0, superstarCost);
  const npvB = calculateNPV(academyCost, undervaluedCost);
  const diff = Math.abs(npvA - npvB);
  
  const chartData = [
    { name: 'Option A (Superstar)', npv: npvA },
    { name: 'Option B (Academy)', npv: npvB }
  ];

  // 2. UPDATED FILTERING LOGIC (Using your SQL keys)
  const filteredPlayers = playersData.filter(p => 
    p.batter.toLowerCase().includes(searchTerm.toLowerCase()) && 
    p.strike_rate >= minSR
  );

  return (
    <div className="min-h-screen bg-white text-wise-black p-6 md:p-12 font-sans selection:bg-wise-green selection:text-wise-darkgreen">
      
      {/* Hero Section */}
      <header className="mb-16 max-w-6xl mx-auto">
        <h1 className="text-[64px] md:text-[96px] font-black leading-[0.85] tracking-tight mb-6">
          Money without <br/> borders. Data <br/> without limits.
        </h1>
        <p className="text-[22px] font-semibold leading-tight text-wise-gray max-w-2xl">
          CapEx Optimization & Player ROI Modeling. Proving the financial superiority of data-driven scouting over legacy superstar contracts.
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT COL: Calculator Input */}
        <div className="bg-wise-light/30 p-8 rounded-[30px] shadow-wise-ring">
          <h2 className="text-[40px] font-black leading-[0.85] mb-8">ROI Model Inputs</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[18px] font-semibold mb-2">Discount Rate: {discountRate}%</label>
              <input type="range" min="5" max="20" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)} 
                className="w-full accent-wise-green" />
            </div>
            <div>
              <label className="block text-[18px] font-semibold mb-2">Superstar Annual Cost: ₹{(superstarCost/10000000).toFixed(1)} Cr</label>
              <input type="range" min="10000000" max="30000000" step="1000000" value={superstarCost} onChange={(e) => setSuperstarCost(e.target.value)} 
                className="w-full accent-wise-green" />
            </div>
            <hr className="border-wise-gray/20" />
            <div>
              <label className="block text-[18px] font-semibold mb-2">Academy Build (Year 0): ₹{(academyCost/10000000).toFixed(1)} Cr</label>
              <input type="range" min="10000000" max="50000000" step="1000000" value={academyCost} onChange={(e) => setAcademyCost(e.target.value)} 
                className="w-full accent-wise-green" />
            </div>
            <div>
              <label className="block text-[18px] font-semibold mb-2">Undervalued Players (Annual): ₹{(undervaluedCost/10000000).toFixed(1)} Cr</label>
              <input type="range" min="2000000" max="15000000" step="1000000" value={undervaluedCost} onChange={(e) => setUndervaluedCost(e.target.value)} 
                className="w-full accent-wise-green" />
            </div>
          </div>
        </div>

        {/* RIGHT COL: Visualization & Results */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-[40px] font-black leading-[0.85] mb-4">5-Year NPV Output</h2>
            <div className="flex items-center gap-4 mb-8">
              <span className="bg-wise-green text-wise-darkgreen px-4 py-1 rounded-full text-[14px] font-semibold tracking-tight uppercase">
                {npvB > npvA ? "Academy Wins" : "Superstar Wins"}
              </span>
              <span className="text-[18px] font-semibold">
                Saves ₹{(diff/10000000).toFixed(2)} Crores
              </span>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 0, left: 20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#0e0f0c', fontWeight: 600}} />
                <Tooltip cursor={{fill: 'transparent'}} formatter={(value) => `₹${(value/10000000).toFixed(2)} Cr`} />
                <Bar dataKey="npv" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.npv === Math.max(npvA, npvB) ? '#9fe870' : '#0e0f0c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SQL Data Table Section */}
      <div className="max-w-6xl mx-auto mt-24">
        <h2 className="text-[64px] font-black leading-[0.85] mb-8">Target Acquisition List.</h2>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-wise-gray w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search player name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-[16px] border shadow-wise-ring focus:outline-none focus:ring-2 focus:ring-wise-green text-[18px] transition-all"
            />
          </div>
          <div className="flex-1 bg-white rounded-[16px] border shadow-wise-ring px-6 py-4 flex flex-col justify-center">
            <label className="text-[14px] font-semibold text-wise-gray mb-1">Minimum Strike Rate: {minSR}</label>
            <input 
              type="range" min="100" max="200" value={minSR} 
              onChange={(e) => setMinSR(e.target.value)}
              className="w-full accent-wise-green"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-[30px] border shadow-wise-ring">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-wise-light/50 border-b border-wise-gray/20 text-[18px]">
                <th className="p-6 font-semibold">Batter</th>
                <th className="p-6 font-semibold">Total Runs</th>
                <th className="p-6 font-semibold">Balls Faced</th>
                <th className="p-6 font-semibold flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Strike Rate</th>
              </tr>
            </thead>
            <tbody>
              {/* 3. UPDATED TABLE MAPPING (Using your SQL keys) */}
              {filteredPlayers.map((player, index) => (
                <tr key={index} className="border-b border-wise-gray/10 hover:bg-wise-light/20 transition-colors">
                  <td className="p-6 text-[18px] font-semibold">{player.batter}</td>
                  <td className="p-6 text-[18px]">{player.total_runs}</td>
                  <td className="p-6 text-[18px]">{player.balls_faced}</td>
                  <td className="p-6 text-[18px] font-bold text-wise-darkgreen">{player.strike_rate}</td>
                </tr>
              ))}
              {filteredPlayers.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-[18px] text-wise-gray">No players match your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}