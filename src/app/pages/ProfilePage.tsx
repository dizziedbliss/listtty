import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Settings, User, Bell, Lock, Palette, Save, Github, Globe, Link2, RefreshCw, CheckCircle2, ArrowUpRight, Link as LinkIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import imgDownload1 from '../../imports/MacBookPro161-1/23150e758a0121c122da84e127091bdd7d714e68.png';
import imgYourName from '../../imports/MacBookPro161-1/7d79dd21ad2a81a35b4d25077a54ac17b46223bc.png';
import type { ListItem } from '../contexts/ListContext';
import { useList } from '../contexts/ListContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../services/supabaseClient';
import {
  getAniListAuthUrl,
  getAniListStatus,
  importAniListLibrary,
  syncAniListLibrary,
  unlinkAniListAccount,
  getUserProfile,
  updateUserProfile,
} from '../services/api';

export function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'privacy'>('profile');
  const { mergeExternalLists } = useList();
  const { addToast } = useToast();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') || 'anonymous' : 'anonymous';
  const [username, setUsername] = useState('dizziedbliss');
  const [bio, setBio] = useState('Anime & movie enthusiast 🎬');
  const [email, setEmail] = useState('user@example.com');
  const [displayName, setDisplayName] = useState('dizziedbliss');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [googleConnected, setGoogleConnected] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [anilistLibrary, setAnilistLibrary] = useState<Array<Record<string, any>>>([]);
  const [anilistActionState, setAniListActionState] = useState<'idle' | 'linking' | 'importing' | 'syncing' | 'unlinking'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const { data: anilistStatusData, refetch: refetchAniListStatus } = useQuery({
    queryKey: ['anilist-status', userId],
    queryFn: () => getAniListStatus(userId),
  });

  const { data: userProfileData } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => getUserProfile(userId),
  });

  useEffect(() => {
    if (!userProfileData) return;
    setUsername(userProfileData.username || userId);
    setDisplayName(userProfileData.username || userId);
    setBio(userProfileData.bio || 'Anime & movie enthusiast 🎬');
    setEmail(userProfileData.email || 'user@example.com');
    setAvatarUrl(userProfileData.avatar_url || '');
  }, [userProfileData, userId]);

  // Check Supabase auth state for OAuth providers
  useEffect(() => {
    const checkAuthProviders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.identities) {
          const has_google = user.identities.some((id: any) => id.provider === 'google');
          const has_github = user.identities.some((id: any) => id.provider === 'github');
          setGoogleConnected(has_google);
          setGithubConnected(has_github);
        }
      } catch (error) {
        console.error('Failed to check auth providers:', error);
      }
    };
    checkAuthProviders();
  }, []);

  const anilistConnected = Boolean(anilistStatusData?.connected);
  const anilistAccount = anilistStatusData?.account;

  const mapAniListStatusToListType = (status?: string) => {
    switch (status) {
      case 'CURRENT':
        return 'watching' as const;
      case 'COMPLETED':
        return 'completed' as const;
      case 'DROPPED':
        return 'dropped' as const;
      default:
        return 'watchlist' as const;
    }
  };

  const mergeAniListLibraryIntoLists = (items: Array<Record<string, any>>) => {
    const syncedAt = new Date().toISOString();
    const nextLists: {
      watchlist: ListItem[];
      watching: ListItem[];
      completed: ListItem[];
      dropped: ListItem[];
    } = {
      watchlist: [],
      watching: [],
      completed: [],
      dropped: [],
    };

    items.forEach((item) => {
      const listType = mapAniListStatusToListType(item.status);
      const progress = item.progress !== undefined && item.progress !== null ? String(item.progress) : undefined;
      const parsedProgress = typeof item.progress === 'number' ? item.progress : Number(item.progress);
      nextLists[listType].push({
        id: Number(item.id),
        type: 'anime',
        title: item.title,
        poster: item.coverImage || '',
        year: item.seasonYear ? String(item.seasonYear) : undefined,
        addedDate: item.updatedAt || syncedAt,
        progress: progress || undefined,
        rating: typeof item.score === 'number' ? item.score : Number(item.score) || undefined,
        episodes: item.episodes ? Number(item.episodes) : undefined,
        currentEpisode: Number.isFinite(parsedProgress) ? parsedProgress : undefined,
        genres: Array.isArray(item.genres) ? item.genres : [],
      });
    });

    mergeExternalLists(nextLists);
  };

  const handleConnectPlatform = (account: 'google' | 'github') => {
    setStatusMessage(`Open the auth page to sign in with ${account === 'google' ? 'Google' : 'GitHub'}. If Supabase does not have that provider enabled, the button cannot complete the OAuth flow.`);
    navigate('/auth');
  };

  const handleLinkAniList = async () => {
    try {
      setAniListActionState('linking');
      const frontendClientId = (import.meta as any).env?.VITE_ANILIST_CLIENT_ID?.trim();
      const frontendRedirectUri = (import.meta as any).env?.VITE_ANILIST_REDIRECT_URI?.trim();
      const response = await getAniListAuthUrl(userId, frontendClientId, frontendRedirectUri);
      const authUrl = response.authUrl as string | undefined;
      if (!authUrl) {
        throw new Error('AniList auth url was not returned');
      }
      window.open(authUrl, '_blank', 'noopener,noreferrer');
      setAniListActionState('idle');
    } catch (error) {
      console.error('Failed to start AniList auth:', error);
      setStatusMessage(error instanceof Error ? error.message : 'AniList login is not configured on the server yet.');
      setAniListActionState('idle');
    }
  };

  const handleImportAniList = async () => {
    try {
      setAniListActionState('importing');
      const response = await importAniListLibrary(userId);
      setAnilistLibrary(response.lists || []);
      mergeAniListLibraryIntoLists(response.lists || []);
      await refetchAniListStatus();
      setAniListActionState('idle');
    } catch (error) {
      console.error('Failed to import AniList library:', error);
      setStatusMessage(error instanceof Error ? error.message : 'Failed to import AniList library.');
      setAniListActionState('idle');
    }
  };

  const handleSyncAniList = async () => {
    try {
      setAniListActionState('syncing');
      const rawLists = typeof window !== 'undefined' ? localStorage.getItem('user_lists') : null;
      const parsedLists = rawLists ? JSON.parse(rawLists) : {};
      const lists = ['watching', 'completed', 'watchlist', 'dropped']
        .map((status) => {
          const entries = Array.isArray(parsedLists?.[status]) ? parsedLists[status] : [];
          return {
            status,
            items: entries.filter((entry: Record<string, any>) => entry?.type === 'anime').map((entry: Record<string, any>) => ({
              id: entry.id,
              progress: entry.progress ?? entry.currentEpisode ?? 0,
              rating: entry.rating ?? entry.score ?? 0,
            })),
          };
        })
        .filter((list) => list.items.length > 0);

      await syncAniListLibrary(userId, lists);
      await refetchAniListStatus();
      setAniListActionState('idle');
    } catch (error) {
      console.error('Failed to sync AniList library:', error);
      setStatusMessage(error instanceof Error ? error.message : 'Failed to sync AniList library.');
      setAniListActionState('idle');
    }
  };

  const handleUnlinkAniList = async () => {
    try {
      setAniListActionState('unlinking');
      await unlinkAniListAccount(userId);
      setAnilistLibrary([]);
      await refetchAniListStatus();
      setAniListActionState('idle');
    } catch (error) {
      console.error('Failed to unlink AniList account:', error);
      setStatusMessage(error instanceof Error ? error.message : 'Failed to unlink AniList account.');
      setAniListActionState('idle');
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(userId, {
        username: displayName || username || userId,
        bio,
        email,
        avatar_url: avatarUrl,
      });
      setUsername(displayName || username || userId);
      setStatusMessage('Profile saved');
      addToast({ message: 'Profile saved', type: 'success', duration: 3000 });
    } catch (error) {
      console.error('Failed to save profile:', error);
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save profile.');
      addToast({ message: 'Failed to save profile', type: 'error', duration: 4000 });
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header with Banner */}
      <div className="relative h-[300px] w-full">
        <img
          src={imgYourName}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/35 to-[#050505]" />

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

        <div className="absolute top-6 right-6 flex items-center gap-3">
          <button
            onClick={() => navigate('/friends')}
            className="bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 text-white transition-all"
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className="bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 text-white transition-all"
          >
            <Settings className="w-4 h-4 inline-block mr-2" />
            Settings
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 text-white transition-all"
          >
            Back to Home
          </button>
        </div>
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
          {statusMessage && (
            <div className="mb-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              {statusMessage}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                  <p className="text-sm text-gray-400">Keep your public identity minimal and polished.</p>
                </div>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10 transition-colors"
                >
                  Account Settings
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Avatar URL</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-white/30 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <button onClick={handleSaveProfile} className="w-full bg-white hover:bg-white/90 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                  <p className="text-sm text-gray-400">Connect accounts and keep your anime data in sync.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncAniList}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm border border-white/10 flex items-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {anilistActionState === 'syncing' ? 'Syncing...' : 'Sync AniList'}
                  </button>
                  {anilistConnected && (
                    <button
                      onClick={handleUnlinkAniList}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm border border-white/10 transition-colors"
                    >
                      Unlink
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Link2 className="w-5 h-5 text-white/80" />
                    <h3 className="text-white font-semibold">Connected Accounts</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'google', label: 'Google', helper: 'Sign-in and profile identity', icon: Globe, action: () => handleConnectPlatform('google') },
                      { id: 'github', label: 'GitHub', helper: 'Developer account linking', icon: Github, action: () => handleConnectPlatform('github') },
                      {
                        id: 'anilist',
                        label: 'AniList',
                        helper: 'Anime lists, progress, and scores',
                        icon: Link2,
                        action: anilistConnected ? handleUnlinkAniList : handleLinkAniList,
                      },
                    ].map((account) => {
                      const key = account.id as 'google' | 'github' | 'anilist';
                      let linked = false;
                      if (key === 'google') {
                        linked = googleConnected;
                      } else if (key === 'github') {
                        linked = githubConnected;
                      } else if (key === 'anilist') {
                        linked = anilistConnected;
                      }
                      const Icon = account.icon;
                      return (
                        <div key={account.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-white/80" />
                              <p className="text-white font-medium">{account.label}</p>
                            </div>
                            <p className="text-xs text-gray-400">{account.helper}</p>
                          </div>
                          <button
                            onClick={account.action}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              linked ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/15'
                            }`}
                          >
                            {linked ? (key === 'anilist' ? 'Linked' : 'Connected') : key === 'anilist' ? 'Link' : 'Connect'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-white/80" />
                    <h3 className="text-white font-semibold">AniList Library</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-gray-300">
                      <p className="font-semibold text-white mb-1">What this does</p>
                      <p>Link AniList, import your anime library into this page, and push local anime progress and scores back to AniList when you update them here.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleImportAniList}
                        disabled={!anilistConnected || anilistActionState === 'importing'}
                        className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                        {anilistActionState === 'importing' ? 'Importing...' : 'Import Library'}
                      </button>
                      <button
                        onClick={() => {
                          if (!anilistLibrary.length) return;
                          mergeAniListLibraryIntoLists(anilistLibrary);
                        }}
                        disabled={anilistLibrary.length === 0}
                        className="w-full bg-white/10 text-white hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Merge Imported
                      </button>
                      <button
                        onClick={handleLinkAniList}
                        className="w-full bg-white/10 text-white hover:bg-white/15 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/10 col-span-2"
                      >
                        <LinkIcon className="w-5 h-5" />
                        {anilistConnected ? 'Re-link AniList' : 'Link AniList'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>Status</span>
                      <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-white/80" />
                        {anilistConnected ? 'Linked' : 'Not linked'}
                      </span>
                    </div>

                    {anilistAccount && (
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{anilistAccount.username}</span>
                        <span>{anilistAccount.lastSyncedAt ? `Last synced ${new Date(anilistAccount.lastSyncedAt).toLocaleString()}` : 'Not synced yet'}</span>
                      </div>
                    )}

                    {anilistLibrary.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <p className="text-white font-semibold text-sm">Imported Anime</p>
                        <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                          {anilistLibrary.slice(0, 8).map((item) => (
                            <div key={`${item.id}-${item.title}`} className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-2">
                              <div className="aspect-[2/3] rounded-md overflow-hidden bg-black/30 border border-white/10 mb-2">
                                {item.coverImage ? (
                                  <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover" />
                                ) : null}
                              </div>
                              <p className="text-sm text-white font-medium line-clamp-2">{item.title}</p>
                              <p className="text-xs text-gray-400">{item.status} • {item.progress ?? 0} eps</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[rgba(0,0,0,0.2)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-white/80" />
                    <div>
                      <p className="text-white font-semibold">Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive updates about your watchlist</p>
                    </div>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-gray-600 peer-checked:bg-white rounded-full peer transition-colors cursor-pointer" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[rgba(0,0,0,0.2)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-white/80" />
                    <div>
                      <p className="text-white font-semibold">Dark Mode</p>
                      <p className="text-sm text-gray-400">Toggle dark theme</p>
                    </div>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-full h-full bg-gray-600 peer-checked:bg-white rounded-full peer transition-colors cursor-pointer" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform" />
                  </label>
                </div>

                <div className="p-4 bg-[rgba(0,0,0,0.2)] rounded-lg">
                  <label className="block text-white mb-2 font-semibold">Default Category</label>
                  <select className="w-full bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-white/30">
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
                  <select className="bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-white/30">
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
                    <div className="w-full h-full bg-gray-600 peer-checked:bg-white rounded-full peer transition-colors cursor-pointer" />
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
