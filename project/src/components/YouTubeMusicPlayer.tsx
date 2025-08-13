import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, Volume2, Search } from 'lucide-react';

const YOUTUBE_API_KEY = 'AIzaSyBn9wzEhM319bx_sLBl8SH4hqhkvtC9RjM';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

export function YouTubeMusicPlayer() {
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<YouTubeVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const relaxingPlaylists = [
    'relaxing study music',
    'meditation music',
    'nature sounds for stress relief',
    'calm piano music',
    'ambient music for focus',
    'stress relief music',
    'peaceful instrumental music'
  ];

  const searchYouTubeVideos = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('YouTube API request failed');
      }

      const data = await response.json();
      
      const videos: YouTubeVideo[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        duration: 'Unknown'
      }));

      setPlaylist(videos);
    } catch (error) {
      console.error('Failed to search YouTube videos:', error);
      // Fallback to predefined relaxing videos
      setPlaylist([
        {
          id: 'jfKfPfyJRdk',
          title: 'Relaxing Music for Stress Relief',
          thumbnail: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg',
          duration: '3:00:00'
        },
        {
          id: 'lFcSrYw-ARY',
          title: 'Peaceful Piano Music',
          thumbnail: 'https://img.youtube.com/vi/lFcSrYw-ARY/mqdefault.jpg',
          duration: '2:00:00'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRandomPlaylist = () => {
    const randomQuery = relaxingPlaylists[Math.floor(Math.random() * relaxingPlaylists.length)];
    searchYouTubeVideos(randomQuery);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchYouTubeVideos(searchQuery + ' relaxing music');
    }
  };

  const playVideo = (video: YouTubeVideo) => {
    setCurrentVideo(video);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (currentVideo && playlist.length > 0) {
      const currentIndex = playlist.findIndex(v => v.id === currentVideo.id);
      const nextIndex = (currentIndex + 1) % playlist.length;
      playVideo(playlist[nextIndex]);
    }
  };

  useEffect(() => {
    loadRandomPlaylist();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Music className="w-5 h-5 text-green-500" />
        Relaxing Music
      </h3>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for relaxing music..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </form>

      {/* Current Player */}
      {currentVideo && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-4">
            <img
              src={currentVideo.thumbnail}
              alt={currentVideo.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 line-clamp-2">
                {currentVideo.title}
              </h4>
              <p className="text-sm text-gray-500">{currentVideo.duration}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={togglePlayPause}
              className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={playNext}
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="70"
                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* YouTube Embed */}
          {isPlaying && (
            <div className="mt-4">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&controls=1`}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          )}
        </div>
      )}

      {/* Playlist */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-700">Relaxing Playlist</h4>
          <button
            onClick={loadRandomPlaylist}
            disabled={isLoading}
            className="text-sm text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {playlist.map((video) => (
            <div
              key={video.id}
              onClick={() => playVideo(video)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                currentVideo?.id === video.id
                  ? 'bg-green-100 border border-green-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {video.title}
                </p>
                <p className="text-sm text-gray-500">{video.duration}</p>
              </div>
              {currentVideo?.id === video.id && isPlaying && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {playlist.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No music found. Try searching for something else!</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-blue-800 text-sm text-center">
          🎵 Listen to calming music to reduce stress and improve focus during study sessions
        </p>
      </div>
    </div>
  );
}