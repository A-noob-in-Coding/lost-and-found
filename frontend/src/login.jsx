import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const statsChartRef = useRef(null);
  setShowStats
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Instead of showing stats, navigate to the feed page
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 1500);
  };


  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowRegister(false);
      // After registration, redirect to feed as well
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 1500);
  };

  const handleResetPassword = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowForgotPassword(false);
    }, 1500);
  };

  useEffect(() => {
    if (showStats && statsChartRef.current) {
      // Fix: Use a small timeout to ensure the DOM is ready
      setTimeout(() => {
        try {
          const chart = echarts.init(statsChartRef.current);
          const option = {
            animation: false,
            title: {
              text: 'Lost Items Statistics (2025)',
              left: 'center',
              textStyle: {
                color: '#fff'
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'line' // Change from 'shadow' to 'line' to fix the error
              }
            },
            legend: {
              data: ['Found', 'Still Lost'],
              top: 30,
              textStyle: {
                color: '#fff'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              axisLine: {
                lineStyle: {
                  color: '#fff'
                }
              },
              axisLabel: {
                color: '#fff'
              }
            },
            yAxis: {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#fff'
                }
              },
              axisLabel: {
                color: '#fff'
              },
              splitLine: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.1)'
                }
              }
            },
            series: [
              {
                name: 'Found',
                type: 'bar',
                stack: 'total',
                data: [32, 45, 29, 38, 42, 35],
                itemStyle: {
                  color: '#4F46E5'
                }
              },
              {
                name: 'Still Lost',
                type: 'bar',
                stack: 'total',
                data: [12, 18, 9, 15, 19, 13],
                itemStyle: {
                  color: '#A855F7'
                }
              }
            ]
          };
          chart.setOption(option);
          
          const handleResize = () => {
            chart.resize();
          };
          window.addEventListener('resize', handleResize);
          
          return () => {
            chart.dispose();
            window.removeEventListener('resize', handleResize);
          };
        } catch (err) {
          console.error("Chart initialization error:", err);
        }
      }, 100);
    }
  }, [showStats]);


  const recentItems = [
    { id: 1, name: 'MacBook Pro 16"', location: 'CS Building Library', date: '2025-03-27', status: 'Found', owner: 'Ahmed Raza' },
    { id: 2, name: 'Black Leather Wallet', location: 'Cafeteria', date: '2025-03-26', status: 'Found', owner: 'Pending' },
    { id: 3, name: 'Samsung Galaxy S25', location: 'EE Lab 3', date: '2025-03-25', status: 'Found', owner: 'Fatima Khan' },
    { id: 4, name: 'Student ID Card', location: 'Main Entrance', date: '2025-03-24', status: 'Found', owner: 'Pending' },
    { id: 5, name: 'Airpods Pro', location: 'CS Building', date: '2025-03-23', status: 'Lost', owner: 'Zain Malik' }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {!showStats ? (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background Typography */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="text-[20vw] font-black text-black/4 pb-11 leading-none whitespace-nowrap tracking-wider transform -rotate-6 animate-marquee">
                LOST AND FOUND LOST AND FOUND
              </div>
              <div className="text-[15vw] font-black text-black/4 leading-none whitespace-nowrap mt-[-5vw] tracking-wider transform -rotate-6 animate-marquee-reverse">
                FAST NUCES FAST NUCES
              </div>
            </div>
          </div>
          <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden z-10 transition-all duration-300 hover:shadow-3xl">
            <div className="p-8">
              <div className="flex justify-center mb-8">
                <div className="h-16 w-16 rounded-full bg-black flex items-center justify-center shadow-lg">
                  <i className="fas fa-search text-white text-2xl"></i>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-center mb-2 tracking-tight">FAST Lost & Found</h1>
              <p className="text-gray-500 text-center mb-8">Reconnect with your belongings</p>
              {!showRegister ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="relative">
                    <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    {isLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      'Login'
                    )}
                  </button>
                  <div className="flex justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-gray-500 hover:text-black transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRegister(true)}
                      className="text-gray-500 hover:text-black transition-colors cursor-pointer"
                    >
                      Register
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-6">
                  {/* Register form content - unchanged */}
                  <div className="relative">
                    <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <i className="fas fa-id-card absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Student ID"
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                      required
                    />
                  </div>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    {isLoading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      'Register'
                    )}
                  </button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowRegister(false)}
                      className="text-sm text-gray-500 hover:text-black transition-colors cursor-pointer"
                    >
                      Already have an account? Login
                    </button>
                  </div>
                </form>
              )}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
                © 2025 FAST NUCES Lost & Found System
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-black border-b border-white/10 py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <i className="fas fa-search text-white text-xl"></i>
                <h1 className="text-xl font-bold">FAST Lost & Found</h1>
              </div>
              <div className="flex items-center space-x-6">
                <button className="text-gray-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap">
                  <i className="fas fa-plus mr-2"></i>
                  Report Item
                </button>
                <button className="text-gray-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap">
                  <i className="fas fa-bell mr-2"></i>
                  Notifications
                </button>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                    <i className="fas fa-user text-white"></i>
                  </div>
                  <span>Hamza Ali</span>
                </div>
              </div>
            </div>
          </header>
          {/* Main Content */}
          <main className="flex-1 container mx-auto px-4 py-8">
            {/* Dashboard Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
              <p className="text-gray-400">Friday, March 28, 2025</p>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Total Items</h3>
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <i className="fas fa-box text-blue-500"></i>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">248</div>
                <div className="text-sm text-green-500">
                  <i className="fas fa-arrow-up mr-1"></i>
                  12% from last month
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Found Items</h3>
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <i className="fas fa-check text-green-500"></i>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">183</div>
                <div className="text-sm text-green-500">
                  <i className="fas fa-arrow-up mr-1"></i>
                  8% from last month
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Still Lost</h3>
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <i className="fas fa-search text-purple-500"></i>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">65</div>
                <div className="text-sm text-red-500">
                  <i className="fas fa-arrow-down mr-1"></i>
                  5% from last month
                </div>
              </div>
            </div>
            {/* Chart and Recent Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-medium mb-6">Monthly Statistics</h3>
                <div ref={statsChartRef} className="h-80 w-full"></div>
              </div>
              {/* Recent Items */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium">Recent Items</h3>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-white/10">
                        <th className="pb-3 font-medium">Item</th>
                        <th className="pb-3 font-medium">Location</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentItems.map(item => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                          <td className="py-4">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-400">{item.owner === 'Pending' ? 'Owner: Unknown' : `Owner: ${item.owner}`}</div>
                          </td>
                          <td className="py-4 text-gray-300">{item.location}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Found' ? 'bg-green-500/20 text-green-500' : 'bg-purple-500/20 text-purple-500'}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 text-gray-300">{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white shadow-2xl rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-black">Reset Password</h3>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-500 hover:text-black cursor-pointer"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            <div className="relative mb-6">
              <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              />
            </div>
            <button
              className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
