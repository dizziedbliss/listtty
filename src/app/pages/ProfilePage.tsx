import { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Settings, User, Bell, Lock, Palette, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imgDownload1 from '../../imports/MacBookPro161-1/23150e758a0121c122da84e127091bdd7d714e68.png';
import imgYourName from '../../imports/MacBookPro161-1/7d79dd21ad2a81a35b4d25077a54ac17b46223bc.png';

export function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'privacy'>('profile');
  const [username, setUsername] = useState('dizziedbliss');
  const [bio, setBio] = useState('Anime & movie enthusiast 🎬');
  const [email, setEmail] = useState('user@example.com');

  return (
    <div className="min-h-screen pb-32">
      {/* Header with Banner */}
      <div className="relative h-[300px] w-full">
        <img
          src={imgYourName}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b1622]" />

        {/* Profile Picture */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="relative group">
            <img
              src={imgDownload1}
              alt="Profile"
              className="w-[180px] h-[180px] rounded-full border-8 border-[#0b1622] object-cover"
            />
            <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 right-6 bg-[rgba(138,56,245,0.3)] hover:bg-[rgba(138,56,245,0.5)] backdrop-blur-md border-2 border-white/20 rounded-lg px-4 py-2 text-white transition-all"
        >
          Back to Home
        </button>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-8 pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-2 text-white"
          style={{ fontFamily: 'Cabin' }}
        >
          {username}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-400 mb-8"
        >
          {bio}
        </motion.p>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: 'profile', label: 'Profile Info', icon: User },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'privacy', label: 'Privacy', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-[rgba(138,56,245,0.3)] border-purple-500 text-white'
                    : 'bg-[rgba(138,56,245,0.1)] border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-8"
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

              <div>
                <label className="block text-white mb-2 font-semibold">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[rgba(0,0,0,0.3)] border-2 border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-[rgba(0,0,0,0.3)] border-2 border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[rgba(0,0,0,0.3)] border-2 border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[rgba(0,0,0,0.2)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white font-semibold">Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive updates about your watchlist</p>
                    </div>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-gray-600 peer-checked:bg-purple-600 rounded-full peer transition-colors cursor-pointer" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[rgba(0,0,0,0.2)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white font-semibold">Dark Mode</p>
                      <p className="text-sm text-gray-400">Toggle dark theme</p>
                    </div>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-gray-600 peer-checked:bg-purple-600 rounded-full peer transition-colors cursor-pointer" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
                  </label>
                </div>

                <div className="p-4 bg-[rgba(0,0,0,0.2)] rounded-lg">
                  <label className="block text-white mb-2 font-semibold">Default Category</label>
                  <select className="w-full bg-[rgba(0,0,0,0.3)] border-2 border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500">
                    <option value="anime">Anime</option>
                    <option value="movies">Movies</option>
                    <option value="shows">TV Shows</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Privacy Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[rgba(0,0,0,0.2)] rounded-lg">
                  <div>
                    <p className="text-white font-semibold">Profile Visibility</p>
                    <p className="text-sm text-gray-400">Who can see your profile</p>
                  </div>
                  <select className="bg-[rgba(0,0,0,0.3)] border-2 border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500">
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-[rgba(0,0,0,0.2)] rounded-lg">
                  <div>
                    <p className="text-white font-semibold">Watchlist Privacy</p>
                    <p className="text-sm text-gray-400">Control who sees your lists</p>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-full h-full bg-gray-600 peer-checked:bg-purple-600 rounded-full peer transition-colors cursor-pointer" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
                  </label>
                </div>

                <div className="p-4 bg-red-900/20 border-2 border-red-500/30 rounded-lg">
                  <p className="text-white font-semibold mb-2">Danger Zone</p>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
