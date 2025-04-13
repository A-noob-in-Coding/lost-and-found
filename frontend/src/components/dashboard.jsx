// src/components/Dashboard.jsx
// import StatsChart from "./statChart.jsx";

export default function Dashboard() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Added responsive grid layout */}
        <StatsChart />
      </div>
    </div>
  );
}
