import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Search, MessageCircle, Users } from 'lucide-react';
import imgDownload1 from '../../imports/MacBookPro161-1/23150e758a0121c122da84e127091bdd7d714e68.png';

interface Friend {
  id: number;
  username: string;
  avatar: string;
  status: 'online' | 'offline';
  watching: string;
  mutualFriends: number;
}

export function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock friends data
  const friends: Friend[] = [
    {
      id: 1,
      username: 'animelover123',
      avatar: imgDownload1,
      status: 'online',
      watching: 'Attack on Titan',
      mutualFriends: 5,
    },
    {
      id: 2,
      username: 'otakuking',
      avatar: imgDownload1,
      status: 'online',
      watching: 'Demon Slayer',
      mutualFriends: 3,
    },
    {
      id: 3,
      username: 'mangafan99',
      avatar: imgDownload1,
      status: 'offline',
      watching: 'Your Name',
      mutualFriends: 8,
    },
    {
      id: 4,
      username: 'weebmaster',
      avatar: imgDownload1,
      status: 'offline',
      watching: 'Jujutsu Kaisen',
      mutualFriends: 2,
    },
  ];

  const friendRequests = [
    { id: 5, username: 'newuser123', avatar: imgDownload1, mutualFriends: 1 },
    { id: 6, username: 'animeenthusiast', avatar: imgDownload1, mutualFriends: 4 },
  ];

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-[1200px] mx-auto px-8 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Cabin' }}>
            Friends
          </h1>
          <p className="text-gray-400 text-lg">Connect with fellow anime and movie enthusiasts</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${
              activeTab === 'friends'
                ? 'bg-[rgba(138,56,245,0.3)] border-purple-500 text-white'
                : 'bg-[rgba(138,56,245,0.1)] border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            <Users className="w-5 h-5" />
            My Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${
              activeTab === 'requests'
                ? 'bg-[rgba(138,56,245,0.3)] border-purple-500 text-white'
                : 'bg-[rgba(138,56,245,0.1)] border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            Requests ({friendRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all ${
              activeTab === 'search'
                ? 'bg-[rgba(138,56,245,0.3)] border-purple-500 text-white'
                : 'bg-[rgba(138,56,245,0.1)] border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            <Search className="w-5 h-5" />
            Find Friends
          </button>
        </div>

        {/* Content */}
        {activeTab === 'friends' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.username}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0b1622] ${
                        friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{friend.username}</h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {friend.mutualFriends} mutual friends
                    </p>
                    <p className="text-purple-400 text-sm">Currently watching: {friend.watching}</p>
                  </div>

                  <button className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-4">
            {friendRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={request.avatar}
                    alt={request.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{request.username}</h3>
                    <p className="text-gray-400 text-sm">{request.mutualFriends} mutual friends</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                      Accept
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'search' && (
          <div>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by username..."
                className="w-full bg-[rgba(138,56,245,0.2)] backdrop-blur-md border-2 border-white/20 rounded-lg pl-14 pr-4 py-4 text-white text-xl placeholder-white/60 outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{user.username}</h3>
                      <p className="text-gray-400 text-sm">{user.mutualFriends} mutual friends</p>
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <UserPlus className="w-4 h-4" />
                      Add Friend
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
