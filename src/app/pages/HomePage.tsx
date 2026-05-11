import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoviesData, useShowsData, useAnimeData } from '../hooks/useMediaData';
import { useList } from '../contexts/ListContext';
import svgPaths from '../../imports/MacBookPro161-1/svg-76f5gl44hw';
import imgYourName from '../../imports/MacBookPro161-1/7d79dd21ad2a81a35b4d25077a54ac17b46223bc.png';
import imgDownload1 from '../../imports/MacBookPro161-1/23150e758a0121c122da84e127091bdd7d714e68.png';
import imgAvengers from '../../imports/MacBookPro161-1/e79a63dc0e8757702d36184335982fb4a454da53.png';
import img71NnJu9LiHl1 from '../../imports/MacBookPro161-1/2cb89f56db3ebd840334f96b347c09933f53c13f.png';

interface HomePageProps {
  activeCategory: 'movies' | 'shows' | 'anime';
  onCategoryChange: (category: 'movies' | 'shows' | 'anime') => void;
}

export function HomePage({ activeCategory, onCategoryChange }: HomePageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { lists } = useList();

  const { data: moviesData = [] } = useMoviesData(searchQuery);
  const { data: showsData = [] } = useShowsData(searchQuery);
  const { data: animeData = [] } = useAnimeData(searchQuery);

  const currentData = {
    movies: moviesData,
    shows: showsData,
    anime: animeData,
  }[activeCategory];

  // Filter user lists by media type
  const getListsForType = (type: 'movie' | 'show' | 'anime') => {
    return {
      watching: lists.watching.filter((item) => item.type === type),
      completed: lists.completed.filter((item) => item.type === type),
      dropped: lists.dropped.filter((item) => item.type === type),
      watchlist: lists.watchlist.filter((item) => item.type === type),
    };
  };

  const typeLists = getListsForType(
    activeCategory === 'movies' ? 'movie' : activeCategory === 'shows' ? 'show' : 'anime'
  );

  const handleItemClick = (id: number) => {
    const routeType = activeCategory === 'movies' ? 'movie' : activeCategory === 'shows' ? 'show' : 'anime';
    navigate(`/${routeType}/${id}`);
  };

  return (
    <div className="relative w-full pb-[150px]">
      {/* Profile Header */}
      <div className="bg-[rgba(55,55,55,0.2)] h-[380px] overflow-clip shadow-[0px_11px_12.2px_0px_rgba(0,0,0,0.25)] w-full">
        <div className="absolute h-[972px] left-0 top-[-544px] w-full">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <img alt="" className="absolute max-w-none object-cover size-full" src={imgYourName} />
            <div className="absolute bg-[rgba(0,0,0,0.5)] inset-0" />
          </div>
        </div>

        <div className="relative max-w-[1728px] mx-auto px-10 h-full">
          {/* Profile Picture */}
          <div className="absolute bg-[#a8a8a8] left-[70px] rounded-[25px] size-[285px] top-[43px]">
            <div className="overflow-clip relative rounded-[inherit] size-full">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgDownload1} />
            </div>
            <div aria-hidden="true" className="absolute border-5 border-black border-solid inset-[-2.5px] pointer-events-none rounded-[27.5px]" />
          </div>

          {/* Username */}
          <div className="absolute h-[58px] left-[401px] top-[282px] w-[241px]">
            <p className="absolute font-['Cabin:Bold',sans-serif] font-bold leading-[normal] left-0 text-[48px] text-shadow-[0px_4px_4.5px_rgba(0,0,0,0.25)] text-white top-0 whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              dizziedbliss
            </p>
          </div>

          {/* Edit Profile Button */}
          <button className="absolute bg-[rgba(138,56,245,0.2)] h-[46px] left-[963px] rounded-[10px] top-[294px] w-[228px] border-2 border-black transition-transform hover:scale-105">
            <p className="font-['Cabin:Regular',sans-serif] font-normal text-[32px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              edit profile
            </p>
          </button>

          {/* Share Profile Button */}
          <button className="absolute bg-[rgba(138,56,245,0.2)] h-[46px] left-[1220px] rounded-[10px] top-[294px] w-[228px] border-2 border-black transition-transform hover:scale-105">
            <p className="font-['Cabin:Regular',sans-serif] font-normal text-[32px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              share profile
            </p>
          </button>

          {/* Search Friends */}
          <div className="absolute bg-[rgba(138,56,245,0.2)] h-[46px] left-[1309px] rounded-[10px] top-[43px] w-[349px] border-2 border-black">
            <div className="overflow-clip relative rounded-[inherit] size-full flex items-center px-4">
              <div className="size-[23px] mr-2">
                <svg className="size-full" fill="none" viewBox="0 0 23 23">
                  <g><path d={svgPaths.p11224f00} fill="white" /><path d={svgPaths.p1eb0d700} fill="white" /></g>
                </svg>
              </div>
              <input type="text" placeholder="search friends" className="flex-1 bg-transparent font-['Cabin:Regular',sans-serif] text-[20px] text-white placeholder-white outline-none" style={{ fontVariationSettings: "'wdth' 100" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1580px] mx-auto px-10 mt-12">
        <div className="flex gap-[100px] items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-[50px] flex-1 max-w-[827px]">
            {/* Search Bar */}
            <div className="bg-[rgba(138,56,245,0.2)] h-[44px] rounded-[10px] w-full border-2 border-black">
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
                  className="flex-1 bg-transparent font-['Cabin:Regular',sans-serif] text-[32px] text-white placeholder-white outline-none"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="relative w-full">
              <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[20px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>
                recommendations
              </p>
              <div className="bg-[rgba(138,56,245,0.2)] rounded-[10px] w-full border-2 border-black p-7">
                <div className="flex gap-[20px] overflow-x-auto overflow-y-clip">
                  {currentData.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className="bg-gray-700 h-[295px] shrink-0 w-[225px] rounded overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                    >
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="relative w-full">
              <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[20px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>
                completed
              </p>
              <div className="bg-[rgba(138,56,245,0.2)] rounded-[10px] w-full border-2 border-black p-6">
                <div className="flex gap-[20px] overflow-x-auto overflow-y-clip">
                  {typeLists.completed.length > 0 ? (
                    typeLists.completed.slice(0, 9).map((item) => (
                      <div
                        key={`${item.id}-${item.type}`}
                        onClick={() => handleItemClick(item.id)}
                        className="bg-gray-700 h-[114px] shrink-0 w-[120px] rounded overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                      >
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 py-4">Nothing completed yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Dropped */}
            <div className="relative w-full">
              <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[20px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>
                dropped
              </p>
              <div className="bg-[rgba(138,56,245,0.2)] rounded-[10px] w-full border-2 border-black p-6">
                <div className="flex gap-[20px] overflow-x-auto overflow-y-clip">
                  {typeLists.dropped.length > 0 ? (
                    typeLists.dropped.slice(0, 10).map((item) => (
                      <div
                        key={`${item.id}-${item.type}`}
                        onClick={() => handleItemClick(item.id)}
                        className="bg-gray-700 h-[114px] shrink-0 w-[120px] rounded overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                      >
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 py-4">Nothing dropped yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Currently Watching */}
          <div className="bg-[rgba(138,56,245,0.2)] h-[854px] rounded-[10px] shrink-0 w-[446px] border-2 border-black p-6">
            <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[20px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mt-16 mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>
              currently watching
            </p>

            {/* Currently Watching Card */}
            {typeLists.watching.length > 0 ? (
              typeLists.watching.slice(0, 1).map((item) => (
                <div key={item.id} className="h-[177px] rounded-[6px] w-full border-2 border-black bg-black/20 p-6 mb-8">
                  <div className="flex gap-4">
                    <div className="bg-gray-700 h-[114px] rounded w-[78px] border border-white shadow-[0px_3px_3px_0px_rgba(0,0,0,0.25)] overflow-hidden">
                      <img alt={item.title} className="w-full h-full object-cover rounded" src={item.poster} />
                    </div>
                    <div className="flex-1">
                      <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[20px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mb-2" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {item.title}
                      </p>
                      <p className="font-['Cabin_Condensed:Regular',sans-serif] text-[12px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mb-1">
                        progress: {item.currentEpisode || 0}/{item.episodes || '?'}
                      </p>
                      <p className="font-['Cabin:Regular',sans-serif] font-normal text-[#a2a2a2] text-[10px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {item.year || 'N/A'}
                      </p>
                      <div className="flex gap-3 mt-4">
                        <div className="w-2 h-2 rounded-full bg-[#D9D9D9]" />
                        <div className="w-2 h-2 rounded-full bg-black" />
                        <div className="w-2 h-2 rounded-full bg-[#D9D9D9]" />
                        <div className="w-2 h-2 rounded-full bg-[#D9D9D9]" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-[177px] rounded-[6px] w-full border-2 border-black bg-black/20 p-6 mb-8 flex items-center justify-center">
                <p className="text-gray-400">Nothing currently watching</p>
              </div>
            )}

            <p className="font-['Cabin:Italic',sans-serif] font-normal italic text-[20px] text-shadow-[0px_4px_2.8px_rgba(0,0,0,0.25)] text-white mb-6" style={{ fontVariationSettings: "'wdth' 100" }}>
              watchlist
            </p>

            {/* Watchlist Grid */}
            <div className="rounded-[6px] w-full border-2 border-black bg-black/20 p-4">
              <div className="grid grid-cols-4 gap-4">
                {typeLists.watchlist.length > 0 ? (
                  typeLists.watchlist.slice(0, 6).map((item) => (
                    <div
                      key={`${item.id}-${item.type}`}
                      onClick={() => handleItemClick(item.id)}
                      className="overflow-clip relative hover:scale-105 transition-transform cursor-pointer rounded"
                    >
                      <img alt={item.title} className="w-full h-auto object-cover" src={item.poster} />
                      <div className="absolute bottom-0 w-full bg-[rgba(0,0,0,0.77)] px-1 py-2">
                        <p className="font-['Cabin_Condensed:Regular',sans-serif] text-white text-[10px] text-center truncate">
                          {item.title}
                        </p>
                        <p className="font-['Cabin_Condensed:Regular',sans-serif] text-white text-[7px] text-center">{item.rating || '—'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center py-6 text-gray-400">No items in watchlist</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
