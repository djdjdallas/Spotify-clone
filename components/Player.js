import React, {useEffect, useState} from 'react'
import { useSession } from 'next-auth/react'
import useSpotify from '../hooks/useSpotify'
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from "../hooks/useSongInfo";
import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, SwitchHorizontalIcon, VolumeDownIcon, VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/outline';

function Player() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [ currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
    const [ isPlaying, setIsPlaying ] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    const songInfo = useSongInfo();
    const fetchCurrentSong = () => {
        if( !songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                console.log('Now playing: ', data.body?.item);
                setCurrentIdTrack(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing)
                });
            });
        }
    };
    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true)
            }
        })
    }

    useEffect(() => {
        if( spotifyApi.getAccessToken() && !currentTrackId)
        {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackIdState, spotifyApi, session])
    

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white 
    grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
        <div>
            <img className='hidden md:inline cursor-pointer h-10 w-10' src={songInfo?.album?.images?.[0]?.url}  alt='album image' /> 
            <div className='text-white'>
                <h3>{songInfo?.name}</h3>
                <p>{songInfo?.artists?.[0].name}</p>
            </div>
        </div>

        <div className='flex items-center justify-evenly'>
            <SwitchHorizontalIcon className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out' />
            <RewindIcon className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out' />
            {isPlaying ? (
                <PauseIcon onClick={handlePlayPause} className='w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out' />
            ) : (
                <PlayIcon onClick={handlePlayPause} className='w-10 h-10 cursor-pointer hover:scale-125 transition transform duration-100 ease-out' />
            )}
            <FastForwardIcon  className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out' />
            <ReplyIcon className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out' />
        </div>
        <div className='flex items-center space-x-3
        md:space-x-4 justify-end'>
            <VolumeOffIcon className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out'/>
             <input className='w-14 md:w-28' type='range' value='' min={0} max={100} /> 
            <VolumeUpIcon className='w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100 ease-out' /> 
        </div>
    </div>
  );
}

export default Player;