import { motion } from 'motion/react';
import { TrendingUp, Clock, Star, Award, Calendar, BarChart3 } from 'lucide-react';

export function StatsPage() {
  const stats = {
    totalWatched: 156,
    totalHours: 2340,
    averageScore: 8.2,
    completionRate: 78,
    daysWatched: 97.5,
    episodesWatched: 1872,
  };

  const genreDistribution = [
    { name: 'Action', count: 45, color: '#8A38F5' },
    { name: 'Comedy', count: 38, color: '#C77DFF' },
    { name: 'Drama', count: 32, color: '#E0AAFF' },
    { name: 'Romance', count: 28, color: '#9D4EDD' },
    { name: 'Sci-Fi', count: 13, color: '#5A189A' },
  ];

  const recentActivity = [
    { date: '2024-05-10', action: 'Completed', title: 'Attack on Titan', episodes: 87 },
    { date: '2024-05-09', action: 'Watched', title: 'Demon Slayer', episodes: 3 },
    { date: '2024-05-08', action: 'Added', title: 'Jujutsu Kaisen', episodes: 0 },
    { date: '2024-05-07', action: 'Watched', title: 'Your Name', episodes: 1 },
  ];

  const monthlyProgress = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 15 },
    { month: 'Mar', count: 18 },
    { month: 'Apr', count: 14 },
    { month: 'May', count: 10 },
  ];

  const maxMonthly = Math.max(...monthlyProgress.map((m) => m.count));

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-[1400px] mx-auto px-8 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Cabin' }}>
            Statistics
          </h1>
          <p className="text-gray-400 text-lg">Your watching habits and achievements</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-purple-600 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Watched</p>
                <p className="text-4xl font-bold text-white">{stats.totalWatched}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Days Watched</p>
                <p className="text-4xl font-bold text-white">{stats.daysWatched}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-yellow-600 p-3 rounded-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Average Score</p>
                <p className="text-4xl font-bold text-white">{stats.averageScore}/10</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Genre Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Genre Distribution</h2>
            </div>
            <div className="space-y-4">
              {genreDistribution.map((genre, index) => (
                <div key={genre.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white">{genre.name}</span>
                    <span className="text-gray-400">{genre.count} titles</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(genre.count / stats.totalWatched) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: genre.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Monthly Progress</h2>
            </div>
            <div className="flex items-end justify-between gap-4 h-48">
              {monthlyProgress.map((month, index) => (
                <div key={month.month} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.count / maxMonthly) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg min-h-[20px]"
                  />
                  <p className="text-white text-sm mt-2">{month.month}</p>
                  <p className="text-gray-400 text-xs">{month.count}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Achievements</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🎬', title: '100 Club', desc: 'Watched 100+ titles' },
              { icon: '⭐', title: 'Critic', desc: 'Rated 50+ shows' },
              { icon: '🔥', title: 'Streak Master', desc: '30 day streak' },
              { icon: '🏆', title: 'Completionist', desc: 'Finished 10 series' },
            ].map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-[rgba(138,56,245,0.2)] border-2 border-purple-500/30 rounded-lg p-4 text-center hover:border-purple-500 transition-colors"
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="text-white font-bold text-sm">{achievement.title}</p>
                <p className="text-gray-400 text-xs mt-1">{achievement.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-[rgba(138,56,245,0.15)] backdrop-blur-xl border-2 border-white/10 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-[rgba(0,0,0,0.2)] rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {activity.action === 'Completed' && '✅'}
                    {activity.action === 'Watched' && '👁️'}
                    {activity.action === 'Added' && '➕'}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{activity.title}</p>
                    <p className="text-gray-400 text-sm">
                      {activity.action} • {activity.episodes} episodes
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">{activity.date}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
