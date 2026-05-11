export interface MediaItem {
  id: number;
  title: string;
  poster: string;
  year: string;
  progress?: string;
  type: 'movie' | 'show' | 'anime';
}

export const mockMovies: MediaItem[] = [
  { id: 1, title: 'Avengers: Endgame', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400', year: '2019', progress: '0/1', type: 'movie' },
  { id: 2, title: 'Inception', poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400', year: '2010', type: 'movie' },
  { id: 3, title: 'The Dark Knight', poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400', year: '2008', type: 'movie' },
  { id: 4, title: 'Interstellar', poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400', year: '2014', type: 'movie' },
  { id: 5, title: 'Pulp Fiction', poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400', year: '1994', type: 'movie' },
  { id: 6, title: 'The Matrix', poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400', year: '1999', type: 'movie' },
];

export const mockShows: MediaItem[] = [
  { id: 11, title: 'Breaking Bad', poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400', year: '2008', progress: '5/5', type: 'show' },
  { id: 12, title: 'Stranger Things', poster: 'https://images.unsplash.com/photo-1574267432644-f087aa7c3b58?w=400', year: '2016', type: 'show' },
  { id: 13, title: 'The Crown', poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400', year: '2016', type: 'show' },
  { id: 14, title: 'Black Mirror', poster: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400', year: '2011', type: 'show' },
  { id: 15, title: 'The Mandalorian', poster: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=400', year: '2019', type: 'show' },
  { id: 16, title: 'The Witcher', poster: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400', year: '2019', type: 'show' },
];

export const mockAnime: MediaItem[] = [
  { id: 21, title: 'Attack on Titan', poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400', year: '2013', progress: '4/4', type: 'anime' },
  { id: 22, title: 'Your Name', poster: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400', year: '2016', type: 'anime' },
  { id: 23, title: 'Demon Slayer', poster: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400', year: '2019', type: 'anime' },
  { id: 24, title: 'Jujutsu Kaisen', poster: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400', year: '2020', type: 'anime' },
  { id: 25, title: 'One Punch Man', poster: 'https://images.unsplash.com/photo-1612196808214-b8e1d5a6e31d?w=400', year: '2015', type: 'anime' },
  { id: 26, title: 'Death Note', poster: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400', year: '2006', type: 'anime' },
];

export const watchlistItems: MediaItem[] = [
  { id: 31, title: 'Captain Marvel', poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400', year: '2019', type: 'movie' },
  { id: 32, title: 'Thor: Ragnarok', poster: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400', year: '2017', type: 'movie' },
  { id: 33, title: 'Black Panther', poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400', year: '2018', type: 'movie' },
  { id: 34, title: 'Spider-Man', poster: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=400', year: '2021', type: 'movie' },
  { id: 35, title: 'Doctor Strange', poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400', year: '2016', type: 'movie' },
  { id: 36, title: 'Guardians', poster: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400', year: '2014', type: 'movie' },
];
