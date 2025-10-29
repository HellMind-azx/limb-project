'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getStoredUser } from '@/lib/auth';
import { 
  FiSettings, 
  FiBell, 
  FiPhone, 
  FiTrendingUp, 
  FiTarget,
  FiLoader,
  FiUsers,
  FiClock,
  FiActivity,
  FiSearch,
  FiMenu
} from 'react-icons/fi';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('days');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const storedUser = getStoredUser();
    setUser(storedUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="neu-icon w-32 h-32 flex items-center justify-center">
          <FiLoader className="animate-spin text-primary" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sidebar */}
      <div className="w-20 bg-secondary flex flex-col items-center py-6 space-y-6">
        <div className="neu-icon w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <FiPhone className="text-white" size={20} />
        </div>
        <div className="neu-icon w-12 h-12 rounded-full flex items-center justify-center">
          <FiSettings className="text-secondary" size={20} />
        </div>
        <div className="neu-icon w-12 h-12 rounded-full flex items-center justify-center">
          <FiBell className="text-secondary" size={20} />
        </div>
        <div className="neu-icon w-12 h-12 rounded-full flex items-center justify-center">
          <FiActivity className="text-secondary" size={20} />
        </div>
        <div className="neu-icon w-12 h-12 rounded-full flex items-center justify-center">
          <FiUsers className="text-secondary" size={20} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white">
              nix<span className="text-primary">tho</span>
            </h1>
            <div className="neu-icon w-10 h-10 rounded-full flex items-center justify-center">
              <FiSearch className="text-secondary" size={18} />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-secondary">12 of 15 on work</div>
              <div className="text-sm text-secondary">2 on break</div>
            </div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-accent-2 rounded-full"></div>
              <div className="w-8 h-8 bg-accent-1 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full"></div>
              <div>
                <div className="text-white font-medium">James Radcliffe</div>
                <div className="text-sm text-secondary">Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="neu-card mb-8 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Statistics</h2>
            <div className="flex space-x-2">
              {['Days', 'Weeks', 'Months'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab.toLowerCase()
                      ? 'bg-primary text-white'
                      : 'text-secondary hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex space-x-3 mb-6">
            {Array.from({ length: 13 }, (_, i) => {
              const date = i + 1;
              const day = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i % 7];
              const isSelected = date === 10;
              return (
                <button
                  key={date}
                  className={`w-12 h-12 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'text-secondary hover:text-white hover:bg-tertiary'
                  }`}
                >
                  <div>{date}</div>
                  <div className="text-xs">{day}</div>
                </button>
              );
            })}
          </div>

          {/* Chart Placeholder */}
          <div className="h-64 bg-tertiary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FiTrendingUp className="text-primary mx-auto mb-4" size={48} />
              <div className="text-white font-medium">Activity Chart</div>
              <div className="text-sm text-secondary">7 AM - 10 PM</div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Starting Calls */}
          <div className="neu-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Starting Calls</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-1 rounded-full"></div>
                <div className="text-white">Liam Grayson</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-2 rounded-full"></div>
                <div className="text-white">Mia Jennings</div>
              </div>
            </div>
          </div>

          {/* Break */}
          <div className="neu-card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Break</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-2 rounded-full"></div>
                  <div>
                    <div className="text-white">Jack Linton</div>
                    <div className="text-sm text-secondary">Cigarette brake</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-accent-2 text-black rounded-full text-sm font-medium">
                  00:17
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full"></div>
                  <div>
                    <div className="text-white">Samuel Waters</div>
                    <div className="text-sm text-secondary">Lunch break</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                  00:19
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-1 rounded-full"></div>
                  <div>
                    <div className="text-white">Henry Mercer</div>
                    <div className="text-sm text-secondary">Lunch break</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-accent-1 text-white rounded-full text-sm font-medium">
                  10:51
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-2 rounded-full"></div>
                  <div>
                    <div className="text-white">Amelia Rowann</div>
                    <div className="text-sm text-secondary">Cigarette brake</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-accent-2 text-black rounded-full text-sm font-medium">
                  30:42
                </div>
              </div>
            </div>
          </div>

          {/* Ongoing Calls */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4">Ongoing Calls</h3>
            <div className="space-y-4">
              {/* Call Card 1 */}
              <div className="neu-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent-1 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">Sophia Hayes</div>
                      <div className="text-sm text-secondary">01:54:38</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                    34
                  </div>
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-success" size={16} />
                    <span className="text-sm text-secondary">2h 45m</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiClock className="text-secondary" size={16} />
                    <span className="text-sm text-secondary">3h 10m</span>
                  </div>
                </div>
                <div className="text-sm text-secondary mb-2">
                  David Barr 2, Kilian Schönberger 4, Jörgen Petersen 8
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-accent-2 rounded-full"></div>
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <div className="w-3 h-3 bg-accent-1 rounded-full"></div>
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="text-xs text-secondary">ID 35774</div>
                </div>
              </div>

              {/* Call Card 2 */}
              <div className="neu-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent-2 rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">Owen Darnell</div>
                      <div className="text-sm text-secondary">01:54:38</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                    10
                  </div>
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-success" size={16} />
                    <span className="text-sm text-secondary">3h 10m</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiClock className="text-secondary" size={16} />
                    <span className="text-sm text-secondary">6h 29m</span>
                  </div>
                </div>
                <div className="text-sm text-secondary mb-2">
                  David Barr 2, Kilian Schönberger 4, Jörgen Petersen 8
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-accent-2 rounded-full"></div>
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <div className="w-3 h-3 bg-accent-1 rounded-full"></div>
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="text-xs text-secondary">ID 35774</div>
                </div>
              </div>

              {/* Call Card 3 */}
              <div className="neu-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full"></div>
                    <div>
                      <div className="text-white font-medium">Emma Larkin</div>
                      <div className="text-sm text-secondary">01:51:43</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                    29
                  </div>
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-success" size={16} />
                    <span className="text-sm text-secondary">6h 29m</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiClock className="text-secondary" size={16} />
                    <span className="text-sm text-secondary">2h 45m</span>
                  </div>
                </div>
                <div className="text-sm text-secondary mb-2">
                  David Barr 2, Kilian Schönberger 4, Jörgen Petersen 8
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-accent-2 rounded-full"></div>
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <div className="w-3 h-3 bg-accent-1 rounded-full"></div>
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="text-xs text-secondary">ID 35774</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Card */}
        <div className="mt-8">
          <div className="neu-card p-6 bg-gradient-to-r from-primary to-accent-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-white mb-2">+278k</div>
                <div className="text-white text-lg">Outsourced employees</div>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-white rounded-full"></div>
                <div className="w-8 h-8 bg-white rounded-full"></div>
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
