import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Search, MessageCircle, Users, Check, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  getFriends,
  getFriendRequests,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from '../services/api';

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

export function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || 'anonymous' : 'anonymous';

  // Fetch friends
  const { data: friendsData = [], refetch: refetchFriends } = useQuery({
    queryKey: ['friends', userId],
    queryFn: () => getFriends(userId),
  });

  // Fetch friend requests
  const { data: requestsData = [], refetch: refetchRequests } = useQuery({
    queryKey: ['friendRequests', userId],
    queryFn: () => getFriendRequests(userId),
  });

  // Search users
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['searchUsers', searchQuery],
    queryFn: () => (searchQuery ? searchUsers(searchQuery) : Promise.resolve([])),
    enabled: searchQuery.length > 0,
  });

  const handleSendRequest = async (recipientId: string) => {
    try {
      await sendFriendRequest(userId, recipientId);
      refetchRequests();
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      refetchFriends();
      refetchRequests();
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      refetchRequests();
    } catch (error) {
      console.error('Failed to decline request:', error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await removeFriend(userId, friendId);
      refetchFriends();
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  const friends = Array.isArray(friendsData) ? friendsData : friendsData.friends || [];
  const friendRequests = Array.isArray(requestsData) ? requestsData : requestsData.requests || [];

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
            {friends.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No friends yet. Use the search tab to find people to follow!</p>
              </div>
            ) : (
              friends.map((friend: any, index: number) => (
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
                        src={friend.avatar_url || DEFAULT_AVATAR}
                        alt={friend.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{friend.username}</h3>
                      <p className="text-gray-400 text-sm mb-2">{friend.bio || 'No bio'}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
                        title="Message friend"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveFriend(friend.user_id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                        title="Remove friend"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friendRequests.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No pending friend requests</p>
              </div>
            ) : (
              friendRequests.map((request: any, index: number) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6 hover:border-purple-500 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div>
                      <img
                        src={request.avatar_url || DEFAULT_AVATAR}
                        alt={request.from_username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg">{request.from_username}</h3>
                      <p className="text-gray-400 text-sm mb-4">sent you a friend request</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(request.id)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username..."
                  className="w-full bg-[rgba(138,56,245,0.2)] backdrop-blur-md border-2 border-white/20 rounded-lg pl-14 pr-4 py-4 text-white text-l placeholder-white/60 outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isSearching ? (
                <div className="col-span-full text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : searchResults.length === 0 && searchQuery ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No users found matching "{searchQuery}"</p>
                </div>
              ) : (
                searchResults.map((user: any, index: number) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6 hover:border-purple-500 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={user.avatar_url || DEFAULT_AVATAR}
                        alt={user.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />

                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">{user.username}</h3>
                        <p className="text-gray-400 text-sm mb-4">{user.bio || 'No bio'}</p>

                        <button
                          onClick={() => handleSendRequest(user.user_id)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Add Friend
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
