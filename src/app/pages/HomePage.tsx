import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoviesData, useShowsData, useAnimeData } from '../hooks/useMediaData';
import { useList } from '../contexts/ListContext';
import { useToast } from '../contexts/ToastContext';
import { ChevronLeft, ChevronRight, Plus, Check, Star, Users, Settings } from 'lucide-react';
import svgPaths from '../../imports/MacBookPro161-1/svg-76f5gl44hw';
import imgYourName from '../../imports/MacBookPro161-1/7d79dd21ad2a81a35b4d25077a54ac17b46223bc.png';
import imgDownload1 from '../../imports/MacBookPro161-1/23150e758a0121c122da84e127091bdd7d714e68.png';
import RecommendationCarousel from '../components/RecommendationCarousel';
import PreviewModal from '../components/PreviewModal';

interface HomePageProps {
  activeCategory: 'movies' | 'shows' | 'anime';
  onCategoryChange: (category: 'movies' | 'shows' | 'anime') => void;
}

export function HomePage({ activeCategory, onCategoryChange }: HomePageProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [watchingIndex, setWatchingIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [showAllDropped, setShowAllDropped] = useState(false);
  const { lists, updateProgress, addToList, undoLastProgress, updateRating, getItemList } = useList();
  const [recRatings, setRecRatings] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('recommendation_ratings');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [pendingRatings, setPendingRatings] = useState<Record<string, number>>({});
  const [saveTimeout, setSaveTimeout] = useState<Record<string, NodeJS.Timeout>>({});

  const { data: moviesData = [] } = useMoviesData(searchQuery);
  const { data: showsData = [] } = useShowsData(searchQuery);
  const { data: animeData = [] } = useAnimeData(searchQuery);

  const currentData = {
    movies: moviesData,
    shows: showsData,
    anime: animeData,
  }[activeCategory];

  const getRecKey = (id: number, type: 'movie' | 'show' | 'anime') => `${type}-${id}`;

  const setRecommendationRating = (id: number, type: 'movie' | 'show' | 'anime', rating: number) => {
    const key = getRecKey(id, type);
    const next = { ...recRatings, [key]: rating };
    setRecRatings(next);
    try {
      localStorage.setItem('recommendation_ratings', JSON.stringify(next));
    } catch (error) {
      console.error('Failed saving recommendation ratings:', error);
    }
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<any | null>(null);
  const [showQuickRate, setShowQuickRate] = useState(true);
  const [ratingPrompt, setRatingPrompt] = useState<{ id: number; type: string; title: string } | null>(null);
  const [ratingInput, setRatingInput] = useState<number>(0);

  const openPreview = (item: any) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };
  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewItem(null);
  };

  const viewDetails = (id: number, type: string) => {
    const routeType = type === 'movie' ? 'movie' : type === 'show' ? 'show' : 'anime';
    navigate(`/${routeType}/${id}`);
    closePreview();
  };

  const getListsForType = (type: 'movie' | 'show' | 'anime') => ({
    watching: lists.watching.filter((item) => item.type === type),
    completed: lists.completed.filter((item) => item.type === type),
    dropped: lists.dropped.filter((item) => item.type === type),
    watchlist: lists.watchlist.filter((item) => item.type === type),
  });

  const typeLists = getListsForType(
    activeCategory === 'movies' ? 'movie' : activeCategory === 'shows' ? 'show' : 'anime'
  );

  const handleItemClick = (itemOrId: any) => {
    // Open preview for clicked item (itemOrId may be a MediaItem or an id)
    if (typeof itemOrId === 'object') return openPreview(itemOrId);
    const id = Number(itemOrId);
    const routeType = activeCategory === 'movies' ? 'movie' : activeCategory === 'shows' ? 'show' : 'anime';
    navigate(`/${routeType}/${id}`);
  };

  const personalizedRecommendations = useMemo(() => {
    const listType = activeCategory === 'movies' ? 'movie' : activeCategory === 'shows' ? 'show' : 'anime';
    const allUserItems = [...lists.watching, ...lists.completed, ...lists.dropped, ...lists.watchlist]
      .filter((item) => item.type === listType);

    const consumed = new Set(allUserItems.map((item) => item.id));
    const likedHistory = [...lists.completed, ...lists.watching]
      .filter((item) => item.type === listType)
      .filter((item) => {
        const inCompleted = lists.completed.some(c => c.id === item.id);
        const rating = item.rating || 0;
        return rating >= 3 || inCompleted;
      });

    const tokenWeight = new Map<string, number>();
    const decadeWeight = new Map<string, number>();
    const stopWords = new Set(['the', 'and', 'of', 'to', 'a', 'in', 'on', 'for', 'with', 'part', 'season']);

    likedHistory.forEach((item) => {
      const w = Math.max(1, item.rating || 3);
      const words = item.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 2 && !stopWords.has(word));

      words.forEach((word) => {
        tokenWeight.set(word, (tokenWeight.get(word) || 0) + w);
      });

      const yearNum = Number(item.year);
      if (!isNaN(yearNum) && yearNum > 1900) {
        const decade = `${Math.floor(yearNum / 10) * 10}`;
        decadeWeight.set(decade, (decadeWeight.get(decade) || 0) + w);
      }
    });

    const scored = currentData
      .filter((item) => {
        const key = getRecKey(item.id, item.type);
        const recRating = recRatings[key] || 0;
        if (recRating > 0 && recRating < 1.5) return false;
        return !consumed.has(item.id);
      })
      .map((item, index) => {
        const key = getRecKey(item.id, item.type);
        const recRating = recRatings[key] || 0;

        const words = item.title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter((word) => word.length > 2 && !stopWords.has(word));

        let titleAffinity = 0;
        words.forEach((word) => {
          titleAffinity += tokenWeight.get(word) || 0;
        });
        titleAffinity = Math.sqrt(titleAffinity);

        const yearNum = Number(item.year);
        let yearAffinity = 0;
        if (!isNaN(yearNum) && yearNum > 1900) {
          const decade = `${Math.floor(yearNum / 10) * 10}`;
          yearAffinity = decadeWeight.get(decade) || 0;
        }

        const feedbackBoost = recRating > 0 ? Math.pow(recRating, 1.5) * 8 : 0;
        const trendBoost = Math.max(0, currentData.length - index) / Math.max(1, currentData.length) * 0.5;
        const score = titleAffinity * 1.2 + yearAffinity * 0.8 + feedbackBoost + trendBoost;

        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 12);
  }, [activeCategory, currentData, lists.completed, lists.dropped, lists.watching, lists.watchlist, recRatings]);

  return (
    <>
      <div className="relative w-full pb-[150px]">
      {/* Profile Header */}
      <div className="bg-[rgba(255,255,255,0.035)] h-[380px] overflow-clip shadow-[0px_11px_12.2px_0px_rgba(0,0,0,0.25)] w-full border-b border-white/5">
        <div className="absolute h-[972px] left-0 top-[-544px] w-full">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <img alt="" className="absolute max-w-none object-cover size-full" src={imgYourName} />
            <div className="absolute bg-gradient-to-b from-black/35 via-black/55 to-[#050505] inset-0" />
          </div>
        </div>

        <div className="relative max-w-[1728px] mx-auto px-10 h-full">
          <div className="absolute right-[70px] top-[42px] z-20 flex items-center gap-3">
            <button
              onClick={() => navigate('/friends')}
              className="bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-white text-sm flex items-center gap-2 transition-colors"
            >
              <Users className="w-4 h-4" />
              Friends
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-white text-sm flex items-center gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          <div className="absolute bg-[#a8a8a8] left-[70px] rounded-[25px] size-[285px] top-[43px]">
            <div className="overflow-clip relative rounded-[inherit] size-full">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgDownload1} />
            </div>
            <div aria-hidden="true" className="absolute border-5 border-black border-solid inset-[-2.5px] pointer-events-none rounded-[27.5px]" />
          </div>

          <div className="absolute h-[58px] left-[401px] top-[282px] w-[241px]">
            <p className="absolute font-['Cabin:Bold',sans-serif] font-bold leading-[normal] left-0 text-[48px] text-shadow-[0px_4px_4.5px_rgba(0,0,0,0.25)] text-white top-0 whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              dizziedbliss
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1580px] mx-auto px-8 mt-10 relative z-10">
        <div className="flex gap-[60px] items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-[32px] flex-1 max-w-[760px]">
            {/* Search Bar */}
            <div className="bg-[rgba(255,255,255,0.06)] h-[40px] rounded-[12px] w-full border border-white/10 relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
              <div className="overflow-clip relative rounded-[inherit] size-full flex items-center px-4">
                <div className="size-[23px] mr-3">
                  <svg className="size-full" fill="none" viewBox="0 0 23 23">
                    <g><path d={svgPaths.p11224f00} fill="white" /><path d={svgPaths.p1eb0d700} fill="white" /></g>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent font-['Cabin:Regular',sans-serif] text-[28px] text-white placeholder-white outline-none"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="relative w-full">
              <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[20px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>
                recommendations for you
              </p>
              <div className="bg-[rgba(255,255,255,0.06)] rounded-[16px] w-full border border-white/10 p-5">
                <RecommendationCarousel
                  items={personalizedRecommendations}
                  visibleCount={4}
                  gap={14}
                  itemWidth={170}
                  itemHeight={238}
                  onItemClick={(item) => {
                    const routeType = item.type === 'movie' ? 'movie' : item.type === 'show' ? 'show' : 'anime';
                    navigate(`/${routeType}/${item.id}`);
                  }}
                />
              </div>
            </div>

            {/* Completed */}
            <div className="relative w-full">
              <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[20px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>
                completed
              </p>
              <div className="bg-[rgba(255,255,255,0.06)] rounded-[16px] w-full border border-white/10 p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[14px]">
                  {(showAllCompleted ? typeLists.completed : typeLists.completed.slice(0, 8)).map((item) => (
                    <div
                      key={`${item.id}-${item.type}`}
                      className="group relative bg-gray-700 aspect-[2/3] rounded overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => navigate(`/${activeCategory === 'movies' ? 'movie' : activeCategory === 'shows' ? 'show' : 'anime'}/${item.id}`)}
                    >
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-2 text-center">
                        <h3 className="text-white text-center font-bold text-sm">{item.title}</h3>
                        <div className="mt-2 text-sm text-yellow-300 font-semibold">{item.rating ? Number(item.rating).toFixed(1) : '—'}</div>
                        {item.addedDate && (<div className="text-[11px] text-gray-300 mt-1">added {new Date(item.addedDate).toLocaleDateString()}</div>)}
                      </div>
                    </div>
                  ))}
                </div>
                {typeLists.completed.length > 8 && (
                  <button onClick={() => setShowAllCompleted(!showAllCompleted)} className="text-white/65 mt-4 hover:text-white transition-colors">{showAllCompleted ? 'Show Less' : 'Show More'}</button>
                )}
                {typeLists.completed.length === 0 && (<div className="text-gray-400 py-4 col-span-full">Nothing completed yet</div>)}
              </div>
            </div>

            {/* Dropped */}
            <div className="relative w-full">
              <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[20px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>
                dropped
              </p>
              <div className="bg-[rgba(255,255,255,0.06)] rounded-[16px] w-full border border-white/10 p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[20px]">
                  {(showAllDropped ? typeLists.dropped : typeLists.dropped.slice(0, 8)).map((item) => (
                    <div key={`${item.id}-${item.type}`} className="group relative bg-gray-700 aspect-[2/3] rounded overflow-hidden hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate(`/${activeCategory === 'movies' ? 'movie' : activeCategory === 'shows' ? 'show' : 'anime'}/${item.id}`)}>
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-2 text-center">
                        <h3 className="text-white text-center font-bold text-sm">{item.title}</h3>
                        {item.addedDate && (<div className="text-[11px] text-gray-300 mt-1">added {new Date(item.addedDate).toLocaleDateString()}</div>)}
                      </div>
                    </div>
                  ))}
                </div>
                {typeLists.dropped.length > 8 && (<button onClick={() => setShowAllDropped(!showAllDropped)} className="text-white/65 mt-4 hover:text-white transition-colors">{showAllDropped ? 'Show Less' : 'Show More'}</button>)}
                {typeLists.dropped.length === 0 && (<div className="text-gray-400 py-4 col-span-full">Nothing dropped yet</div>)}
              </div>
            </div>
          </div>

          {/* Right Column - Currently Watching & Watchlist */}
          <div className="shrink-0 w-[420px] space-y-6">
            <div className="bg-[rgba(255,255,255,0.06)] rounded-[16px] border border-white/10 p-6">
              <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[20px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>currently watching</p>
              {/* Currently Watching Card */}
              {typeLists.watching.length > 0 ? (
                (() => {
                  const safeIndex = Math.max(0, Math.min(watchingIndex, typeLists.watching.length - 1));
                  const item = typeLists.watching[safeIndex];
                  const isLastEpisode = !!(item?.episodes && item.currentEpisode === item.episodes);
                  return (
                    <div key={item.id} className="h-auto rounded-[16px] w-full border border-white/10 bg-[rgba(255,255,255,0.05)] p-6">
                      <div className="flex gap-4">
                        <div className="bg-gray-700 h-[140px] rounded w-[96px] border border-white shadow-lg overflow-hidden flex-shrink-0"><img alt={item?.title} className="w-full h-full object-cover rounded" src={item?.poster} /></div>
                        <div className="flex-1">
                          <h3 className="font-['Cabin:Bold',sans-serif] font-bold text-[16px] text-white mb-2">{item?.title}</h3>
                          <p className="text-gray-400 text-sm mb-4">{item?.year || 'N/A'}</p>
                          <div className="mb-4">
                            <p className="text-gray-300 text-xs mb-2">Progress</p>
                            <div className="flex items-center gap-2">
                              <button onClick={() => { if (item && item.type !== 'movie' && (item.currentEpisode || 0) > 0) { const newEpisode = Math.max(0, (item.currentEpisode || 0) - 1); updateProgress(item.id, item.type, newEpisode); addToast({ message: `Updated to ep ${newEpisode}. Undo?`, type: 'undo', action: { label: 'Undo', onClick: () => undoLastProgress() }, duration: 6000, }); } }} className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs transition-colors" title="Previous Ep">−</button>
                              <span className="text-white/80 font-semibold text-sm">{item ? `${item.currentEpisode || 0}/${item.episodes || '?'}` : `0/?`}</span>
                              <button onClick={() => { if (!item) return; if (item.type === 'movie') { addToList('completed', { ...item }); addToast({ message: 'Moved to completed. Undo?', type: 'success', action: { label: 'Undo', onClick: () => undoLastProgress() }, duration: 6000 }); } else { if (item.episodes && item.currentEpisode === item.episodes) { setShowConfirm(true); } else { const newEpisode = (item.currentEpisode || 0) + 1; updateProgress(item.id, item.type, newEpisode); addToast({ message: `Updated to ep ${newEpisode}. Undo?`, type: 'undo', action: { label: 'Undo', onClick: () => undoLastProgress() }, duration: 6000 }); } } }} className="bg-white text-black hover:bg-white/90 px-3 py-1 rounded text-xs transition-colors flex items-center gap-1" title="Next Ep">{item.type === 'movie' ? (<><Check className="w-3 h-3" />Completed</>) : isLastEpisode ? (<><Check className="w-3 h-3" />Done</>) : (<><Plus className="w-3 h-3" />Next</>)}</button>
                            </div>
                          </div>
                          {showConfirm && (<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"><div className="bg-[rgba(8,8,8,0.96)] border border-white/10 rounded-2xl p-6 max-w-sm shadow-2xl"><h3 className="text-white font-bold mb-2">Move to Completed?</h3><p className="text-gray-300 text-sm mb-4">This is the last episode. Move to completed list?</p><div className="flex gap-3"><button onClick={() => { setShowConfirm(false); addToList('completed', { ...item }); addToast({ message: 'Moved to completed. Undo?', type: 'success', action: { label: 'Undo', onClick: () => undoLastProgress() }, duration: 6000 }); }} className="flex-1 bg-white text-black hover:bg-white/90 px-4 py-2 rounded transition-colors text-sm">Confirm</button><button onClick={() => setShowConfirm(false)} className="flex-1 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded transition-colors text-sm">Cancel</button></div></div></div>)}
                        </div>
                      </div>
                      {typeLists.watching.length > 1 && (<div className="flex items-center justify-center gap-2 mt-4"><button onClick={() => setWatchingIndex((i) => (i - 1 + typeLists.watching.length) % typeLists.watching.length)} className="p-2 hover:bg-purple-600 rounded-lg transition-colors text-gray-400 hover:text-white" title="Previous"><ChevronLeft className="w-5 h-5" /></button><div className="flex gap-1">{typeLists.watching.map((_, i) => (<button key={i} onClick={() => setWatchingIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === watchingIndex ? 'bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'}`} title={`Jump to ${i + 1}`} />))}</div><button onClick={() => setWatchingIndex((i) => (i + 1) % typeLists.watching.length)} className="p-2 hover:bg-purple-600 rounded-lg transition-colors text-gray-400 hover:text-white" title="Next"><ChevronRight className="w-5 h-5" /></button></div>)}
                    </div>
                  );
                })()
              ) : (
                <div className="h-auto rounded-[16px] w-full border border-white/10 bg-[rgba(255,255,255,0.05)] p-6 mb-8 flex items-center justify-center"><p className="text-gray-400">Nothing currently watching</p></div>
              )}
            </div>

            {([...lists.completed, ...lists.watching, ...lists.dropped]
              .filter((it) => it.type === (activeCategory === 'movies' ? 'movie' : activeCategory === 'shows' ? 'show' : 'anime'))
              .filter((it) => !it.rating)
              .length > 0) && (
              <div className="bg-[rgba(255,255,255,0.06)] rounded-[16px] border border-white/10 p-4">
                <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[14px] text-white mb-3" style={{ fontVariationSettings: "'wdth' 100" }}>Rate watched items</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[...lists.completed, ...lists.watching, ...lists.dropped]
                    .filter((it) => it.type === (activeCategory === 'movies' ? 'movie' : activeCategory === 'shows' ? 'show' : 'anime'))
                    .filter((it) => !it.rating)
                    .slice(0, 8)
                    .map((it) => {
                      const key = getRecKey(it.id, it.type);
                      const current = recRatings[key] || 0;
                      return (
                        <div key={key} className="flex-shrink-0 space-y-2">
                          <div className="w-20 h-28 bg-gray-700 rounded overflow-hidden">
                            <img src={it.poster} alt={it.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex items-center gap-1 px-1">
                            <input
                              type="range"
                              min={0}
                              max={5}
                              step={0.1}
                              value={pendingRatings[getRecKey(it.id, it.type)] ?? current}
                              onChange={(e) => {
                                const val = Number(parseFloat(e.target.value).toFixed(1));
                                const key = getRecKey(it.id, it.type);
                                setPendingRatings((prev) => ({ ...prev, [key]: val }));
                                
                                if (saveTimeout[key]) clearTimeout(saveTimeout[key]);
                                const newTimeout = setTimeout(() => {
                                  setRecommendationRating(it.id, it.type, val);
                                  if (val > 0) {
                                    updateRating(it.id, it.type, val);
                                    addToast({
                                      message: `Rated ${val.toFixed(1)} ⭐. Undo?`,
                                      type: 'success',
                                      action: { label: 'Undo', onClick: () => {
                                        setPendingRatings((prev) => {
                                          const next = { ...prev };
                                          delete next[key];
                                          return next;
                                        });
                                        updateRating(it.id, it.type, 0);
                                        setRecommendationRating(it.id, it.type, 0);
                                      }},
                                      duration: 5000,
                                    });
                                  }
                                  setSaveTimeout((prev) => {
                                    const next = { ...prev };
                                    delete next[key];
                                    return next;
                                  });
                                }, 800);
                                setSaveTimeout((prev) => ({ ...prev, [key]: newTimeout }));
                              }}
                              className="w-12"
                            />
                            <span className="text-xs font-semibold text-white w-6 text-right">{(pendingRatings[getRecKey(it.id, it.type)] ?? current).toFixed(1)}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            <div className="bg-[rgba(255,255,255,0.06)] rounded-[16px] border border-white/10 p-6">
              <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[20px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>watchlist</p>
              <div className="grid grid-cols-2 gap-4">
                {typeLists.watchlist.map((item) => (
                  <div key={`${item.id}-${item.type}`} className="group relative bg-white/5 aspect-[2/3] rounded overflow-hidden hover:scale-105 transition-transform cursor-pointer" onClick={() => openPreview(item)}>
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-2 text-center">
                        <h3 className="text-white text-center font-bold text-sm">{item.title}</h3>
                        <div className="mt-2 text-sm text-white font-semibold">{item.rating ? Number(item.rating).toFixed(1) : '—'}</div>
                        {item.addedDate && (<div className="text-[11px] text-gray-300 mt-1">added {new Date(item.addedDate).toLocaleDateString()}</div>)}
                    </div>
                  </div>
                ))}
                {typeLists.watchlist.length === 0 && (<div className="text-gray-400 py-4 col-span-full">Nothing in watchlist</div>)}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
      <PreviewModal
        open={previewOpen}
        item={previewItem}
        onClose={closePreview}
        onAddToList={(list, item) => {
          addToList(list as any, { ...item, id: Number(item.id), type: item.type });
          addToast({ message: `Added to ${list}`, type: 'success', duration: 4000 });
          closePreview();
        }}
        onRate={(id, type, rating) => {
          updateRating(id, type, rating);
          // also tune recommendation ratings so recs immediately reflect user feedback
          setRecommendationRating(id, type as any, rating);
          addToast({ message: `Rated ${rating.toFixed(1)}`, type: 'success', duration: 3000 });
          // reflect in previewItem
          setPreviewItem((prev: any) => prev ? { ...prev, rating } : prev);
        }}
        getItemList={(id, type) => getItemList(id, type)}
        onViewDetails={(id, type) => viewDetails(id, type)}
      />
    </>
  );
}
