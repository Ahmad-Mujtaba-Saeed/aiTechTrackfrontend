import React, { useEffect, useState, useRef } from 'react'
import MasterLayout from "../../masterLayout/MasterLayout";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInterviewQuestionById, setParsedFeedback } from "../../features/interview/interviewSlice"
import { baseUrl } from '../../api/axios';
import { Spinner } from "react-bootstrap";
import { Dropdown } from 'bootstrap';
import Swal from "sweetalert2";
import axios from '../../utils/axios';
import "./practiceQuestion.css";

export default function Prepration() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { interviewQuestions, currentQuestion, loading, error, parsedFeedback } = useSelector((state) => state.interview);
    const { data } = useSelector((state) => state.user);
    const [isRecording, setIsRecording] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [question, setQuestion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [hasMicAccess, setHasMicAccess] = useState(false);
    const videoRef = useRef(null);
    const backgroundVideoRef = useRef(null); // Ref for background video
    const boxRef = useRef(null);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [industry, setIndustry] = useState(null);
    const [businessSector, setBusinessSector] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [isBackgroundVideoLoaded, setIsBackgroundVideoLoaded] = useState(false);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [preparationAudioLevel, setPreparationAudioLevel] = useState(0);

    const [showMainVideo, setShowMainVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);

    useEffect(() => {
        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElementList.map(function (dropdownToggleEl) {
            return new Dropdown(dropdownToggleEl);
        });
    }, []);

    const [exitInterview, setExitInterview] = useState(false);
    const exitInterviewRef = useRef(false);

    // Set video URL when currentQuestion is available
    useEffect(() => {
        if (currentQuestion?.question?.title) {
            const url = `${baseUrl}/videos/MPF Interview Questions/${currentQuestion.question.title.replace(/\?+$/, '_')}.mp4`;
            setVideoUrl(url);
            console.log('Video URL set:', url);
        }
    }, [currentQuestion?.question?.title]);

    // Preload the video when URL is available
    useEffect(() => {
        if (videoUrl && backgroundVideoRef.current) {
            const backgroundVideo = backgroundVideoRef.current;
            console.log('Preloading video:', videoUrl);

            backgroundVideo.src = videoUrl;
            backgroundVideo.preload = 'auto';
            backgroundVideo.muted = true;

            const handleLoadedData = () => {
                console.log('Background video loaded successfully');
                setIsBackgroundVideoLoaded(true);
                // Keep it paused but ready
                backgroundVideo.pause();
                backgroundVideo.currentTime = 0;
            };

            const handleCanPlay = () => {
                console.log('Background video can play');
                setIsBackgroundVideoLoaded(true);
            };

            const handleError = (e) => {
                console.error('Failed to load background video:', e);
                console.error('Video error:', backgroundVideo.error);
                setIsBackgroundVideoLoaded(false);
            };

            backgroundVideo.addEventListener('loadeddata', handleLoadedData);
            backgroundVideo.addEventListener('canplay', handleCanPlay);
            backgroundVideo.addEventListener('error', handleError);

            // Load the video
            backgroundVideo.load();

            return () => {
                backgroundVideo.removeEventListener('loadeddata', handleLoadedData);
                backgroundVideo.removeEventListener('canplay', handleCanPlay);
                backgroundVideo.removeEventListener('error', handleError);
            };
        }
    }, [videoUrl]);


    useEffect(() => {
        requestMicrophonePermission();
    }, [])

    // Handle countdown completion
    useEffect(() => {
        if (isReady && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (isReady && countdown === 0) {
            // Switch to main video
            setShowMainVideo(true);
            requestMicrophonePermission();
        }
    }, [isReady, countdown]);

    // Handle main video playback when showMainVideo becomes true
    useEffect(() => {
        console.log('showMainVideo changed:', showMainVideo, 'isBackgroundVideoLoaded:', isBackgroundVideoLoaded);
        if (showMainVideo && videoRef.current && videoUrl) {
            const playMainVideo = async () => {
                try {
                    console.log('Starting main video playback');
                    const mainVideo = videoRef.current;
                    const backgroundVideo = backgroundVideoRef.current;

                    // Use preloaded video if available, otherwise use URL directly
                    if (backgroundVideo && backgroundVideo.src && isBackgroundVideoLoaded) {
                        console.log('Using preloaded video from backgroundVideoRef');
                        mainVideo.src = backgroundVideo.src;
                    } else {
                        console.log('Loading video directly from URL:', videoUrl);
                        mainVideo.src = videoUrl;
                    }
                    mainVideo.currentTime = 0;

                    console.log('Main video src set to:', mainVideo.src);

                    // Wait for the video to be ready
                    if (mainVideo.readyState < 3) {
                        console.log('Waiting for video to be ready...');
                        await new Promise((resolve, reject) => {
                            const timeout = setTimeout(() => reject(new Error('Video load timeout')), 10000);
                            mainVideo.oncanplay = () => {
                                clearTimeout(timeout);
                                resolve();
                            };
                            mainVideo.onerror = () => {
                                clearTimeout(timeout);
                                reject(new Error('Video load error'));
                            };
                        });
                        console.log('Video is ready');
                    } else {
                        console.log('Video already ready, readyState:', mainVideo.readyState);
                    }

                    // Start muted first to comply with autoplay policies
                    mainVideo.muted = true;
                    await mainVideo.play();
                    console.log('Main video started playing (muted)');

                    // Then unmute after it starts playing
                    mainVideo.muted = false;
                    console.log('Main video unmuted');

                    // Request fullscreen
                    if (mainVideo.requestFullscreen) {
                        await mainVideo.requestFullscreen().catch(err => {
                            console.log('Fullscreen request failed:', err);
                        });
                    }

                } catch (error) {
                    console.error('Error playing main video:', error);
                    // If autoplay fails, try playing muted
                    try {
                        const mainVideo = videoRef.current;
                        mainVideo.muted = true;
                        await mainVideo.play();
                        console.log('Fallback: Playing video muted');
                    } catch (fallbackError) {
                        console.error('Fallback also failed:', fallbackError);
                    }
                }
            };

            playMainVideo();
        }
    }, [showMainVideo, videoUrl, isBackgroundVideoLoaded]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Set up audio context and analyzer
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 32;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);

            const recorder = new MediaRecorder(stream);
            let chunks = [];

            // Animation loop for audio level
            const updateAudioLevel = () => {
                if (!analyserRef.current) return;

                analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArrayRef.current[i];
                }
                const average = sum / bufferLength;
                const normalizedLevel = Math.min(Math.max((average - 20) / 50, 0), 1);
                setAudioLevel(normalizedLevel);

                animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
            };

            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);

            recorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            recorder.onstop = async () => {
                if (exitInterviewRef.current) {
                    console.log('Exiting interview, skipping audio upload');
                    return;
                }
                if (exitInterview) {
                    console.log('Exiting interview, skipping audio upload');
                    return;
                }

                if (!chunks.length) {
                    console.log('No audio chunks, skipping upload');
                    return;
                }

                const blob = new Blob(chunks, { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('audio', blob, 'answer.webm');
                formData.append('question_id', id);

                try {
                    // Set initial loading state
                    setLoadingText('Processing your audio...');
                    setIsSubmitting(true);
                    
                    // First API call - Audio transcription
                    const transcriptionResponse = await axios.post('/api/interview/submit-audio', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            console.log(`Upload progress: ${progress}%`);
                        }
                    });

                    if (!transcriptionResponse.data.transcription) {
                        throw new Error('No transcription received from server');
                    }

                    // Update loading state for evaluation
                    setLoadingText('Evaluating your response...');
                    
                    // Second API call - Evaluation
                    const evaluationFormData = new FormData();
                    evaluationFormData.append('audio_time', transcriptionResponse.data.audio_time);
                    evaluationFormData.append('whisper_time', transcriptionResponse.data.whisper_time);
                    evaluationFormData.append('transcription', transcriptionResponse.data.transcription);
                    evaluationFormData.append('audio_path', transcriptionResponse.data.audio_path);
                    evaluationFormData.append('question_id', id);

                    const evaluationResponse = await axios.post('/api/interview/submit-evaluation', evaluationFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });

                    if (!evaluationResponse.data.evaluation) {
                        throw new Error('Failed to evaluate response');
                    }

                    // Store the evaluation data
                    dispatch(setParsedFeedback(evaluationResponse.data));
                    navigate('/question-feedback');

                } catch (error) {
                    console.error('Error:', error);
                    // Set appropriate error message based on the error type
                    const errorMessage = error.response?.data?.error 
                        ? `Error: ${error.response.data.error}`
                        : 'An error occurred while processing your response. Please try again.';
                    
                        // Reset loading state
                        setIsSubmitting(false);
                        setLoadingText('');
                         // Show SweetAlert2 error dialog
                    Swal.fire({
                        title: 'Error',
                        text: errorMessage,
                        icon: 'error',
                        confirmButtonText: 'Retry',
                        showCancelButton: true,
                        cancelButtonText: 'Back to Interviews',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        showLoaderOnConfirm: true,
                        preConfirm: () => {
                            // This function is called when retry is clicked
                            return new Promise((resolve) => {
                                window.location.reload();
                                resolve();
                            });
                        }
                    }).then((result) => {
                        if (result.isDismissed) {
                            // User clicked "Back to Interviews" or clicked outside
                            navigate('/interview'); // Adjust the path as needed
                        }
                        // If user clicks "Retry", the preConfirm will handle it
                    });
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
            setAudioChunks(chunks);
            setIsRecording(true);
        } catch (error) {
            console.error("Microphone error:", error);
        }
    };

    const stopRecording = () => {
        stopMicrophoneMonitoring();
        if (mediaRecorder && isRecording) {
            try {
                mediaRecorder.stop();
                if (mediaRecorder.stream) {
                    mediaRecorder.stream.getTracks().forEach(track => {
                        track.stop();
                    });
                }

                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                    animationFrameRef.current = null;
                }

                if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                    audioContextRef.current.close();
                    audioContextRef.current = null;
                }

                if (analyserRef.current) {
                    analyserRef.current.disconnect();
                    analyserRef.current = null;
                }

                setIsRecording(false);
                setAudioLevel(0);
                setAudioChunks([]);

                console.log('Microphone access has been stopped');
            } catch (error) {
                console.error('Error stopping recording:', error);
            }
        }
    };

    const mediaStreamRef = useRef(null);

    const startMicrophoneMonitoring = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateAudioLevel = () => {
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;
                const normalizedLevel = Math.min(Math.max((average - 20) / 50, 0), 1);
                setPreparationAudioLevel(normalizedLevel);

                requestAnimationFrame(updateAudioLevel);
            };

            updateAudioLevel();

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

        } catch (error) {
            console.error("Microphone monitoring error:", error);
        }
    };

    const stopMicrophoneMonitoring = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (audioContextRef.current) {
            if (audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
            audioContextRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            mediaStreamRef.current = null;
        }

        setPreparationAudioLevel(0);
    };

    useEffect(() => {
        let isActive = true;
        const run = async () => {
            try {
                const ReturnAction = await dispatch(fetchInterviewQuestionById(id)).unwrap();
                if (!isActive) return;
                setIndustry(ReturnAction.industry);
                setBusinessSector(ReturnAction.business_sector);
            } catch (e) {
                // noop
            }
        };
        run();
        return () => { isActive = false; };
    }, [id, dispatch]);

    useEffect(() => {
        if (hasMicAccess) {
            startMicrophoneMonitoring();
        }

        return () => {
            stopMicrophoneMonitoring();
        };
    }, [hasMicAccess]);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    const requestMicrophonePermission = async () => {
        console.log("Requesting mic access");

        if (hasMicAccess) {
            console.log("Microphone access already granted, skipping re-request");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setHasMicAccess(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            setIsReady(false);
            setCountdown(5);
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                setHasMicAccess(false);
            }
        }
    };

    const handleStartInterview = () => {
        console.log('Starting interview, video loaded:', isBackgroundVideoLoaded);
        setIsReady(true);

        // Start playing the background video (muted) during countdown
        // if (backgroundVideoRef.current && isBackgroundVideoLoaded) {
        //     backgroundVideoRef.current.play().then(() => {
        //         console.log('Background video started playing');
        //     }).catch(error => {
        //         console.error('Error playing background video:', error);
        //     });
        // }
    };

    const [nextQuestion, setNextQuestion] = useState(null);

    useEffect(() => {
        const index = interviewQuestions.findIndex(q => q.id == id);
        const nextQuestion = interviewQuestions[index + 1] || null;
        if (nextQuestion) {
            setNextQuestion(nextQuestion);
        }
    }, [interviewQuestions]);

    const handleSkipQuestion = () => {
        if (nextQuestion) {
            window.location.href = `/prepration/${nextQuestion.id}`;
        }
    };

    const handleExitInterview = () => {
        try {
            exitInterviewRef.current = true;
            setExitInterview(true);

            if (mediaRecorder && isRecording) {
                if (exitInterviewRef.current) {
                    mediaRecorder.stream.getTracks().forEach(track => track.stop());
                    return;
                }
                mediaRecorder.stop();
            }

            if (mediaRecorder?.stream) {
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }

            if (audioContextRef.current?.state !== 'closed') {
                audioContextRef.current?.close();
                audioContextRef.current = null;
            }

            if (analyserRef.current) {
                analyserRef.current.disconnect();
                analyserRef.current = null;
            }

            // Stop and reset videos
            if (backgroundVideoRef.current) {
                backgroundVideoRef.current.pause();
                backgroundVideoRef.current.currentTime = 0;
            }
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }

            setIsRecording(false);
            setAudioLevel(0);
            setPreparationAudioLevel(0);
            setAudioChunks([]);
            setMediaRecorder(null);
            setQuestion(null);
            setIsLoading(false);
            setIsReady(false);
            setCountdown(5);
            setHasMicAccess(false);
            setPosition({ x: 50, y: 50 });
            setIndustry(null);
            setBusinessSector(null);
            setIsSubmitting(false);
            setIsVideoLoading(true);
            setShowMainVideo(false);
            setIsBackgroundVideoLoaded(false);

            dataArrayRef.current = null;

            if (document.fullscreenElement) {
                document.exitFullscreen();
            }

            console.log('Interview exited and all resources cleaned up');
        } catch (error) {
            console.error('Error during exit cleanup:', error);
        } finally {
            navigate('/interview');
        }
    };

    if (isLoading) {
        return (
            <MasterLayout>
                <div className="loading-container">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </MasterLayout>
        );
    }

    // Show preparation screen with blurred background video
    if (!showMainVideo) {
        return (
            <MasterLayout>
                {/* Hidden video for preloading */}
                <video
                    ref={backgroundVideoRef}
                    preload="auto"
                    muted
                    playsInline
                    style={{ display: 'none' }}
                />

                {/* Background video with blur effect */}
                <div className="perpration-container">
                    <div className="video-background-container">
                        <video
                            ref={backgroundVideoRef}
                            autoPlay
                            muted
                            playsInline
                            loop
                            className="background-blur-video"
                            style={{
                                filter: 'blur(10px) brightness(0.7)',
                                transform: 'scale(1.1)',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                        <div className="background-overlay"></div>
                    </div>

                    <div className="row mb-3 g-3 feature-cards align-items-center justify-content-center">
                        <div className="col-12 col-xl-5 d-flex justify-content-center">
                            <div className="card border w-100 overflow-hidden position-relative glass-effect">
                                <div className="card-body p-4 d-flex flex-column text-center">
                                    <div className="d-flex justify-content-center mb-3">
                                        <div className="position-relative" style={{ width: '120px', height: '120px' }}>
                                            <svg viewBox="0 0 60 60" className="countdown-ring" style={{ width: '100%', height: '100%' }}>
                                                <circle
                                                    className="countdown-bg"
                                                    cx="30"
                                                    cy="30"
                                                    r="26"
                                                    fill="none"
                                                    stroke="#e9ecef"
                                                    strokeWidth="4"
                                                />
                                                <circle
                                                    className="countdown-progress"
                                                    cx="30"
                                                    cy="30"
                                                    r="26"
                                                    fill="none"
                                                    stroke="#4e73df"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    strokeDasharray="163.36"
                                                    strokeDashoffset={163.36 - (countdown * 27.23)}
                                                    style={{
                                                        transition: 'stroke-dashoffset 1s linear',
                                                        transform: 'rotate(-90deg)',
                                                        transformOrigin: '50% 50%'
                                                    }}
                                                />
                                            </svg>
                                            <div className="position-absolute top-50 start-50 translate-middle text-primary fw-bold" style={{ fontSize: '2rem' }}>
                                                {countdown}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <div className="fw-bold">{data?.name}</div>
                                        <div className="text-secondary small">Candidate</div>
                                    </div>

                                    {hasMicAccess && (
                                        <div className="mb-3">
                                            <div className="fw-semibold mb-1">Answer the question</div>
                                            <div className="mic-meter" aria-label="Microphone level" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={preparationAudioLevel * 100} style={{ height: '10px', background: '#e9ecef', borderRadius: '9999px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${preparationAudioLevel * 100}%`, background: 'linear-gradient(90deg, #20c997, #198754)', transition: 'width 100ms linear' }} />
                                            </div>
                                            <div className={`text-secondary mt-2 ${preparationAudioLevel < 0.2 ? 'text-danger' : ''}`} style={{ fontSize: '0.85rem' }}>
                                                <i className="fas fa-microphone-alt me-2" />
                                                {preparationAudioLevel < 0.2 ? 'Too quiet' : 'Loud and clear'}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <div className="fw-semibold text-dark small mb-1">Current Question</div>
                                        <div className="p-2 bg-light rounded border small">
                                            <span className="fw-bold">#{currentQuestion?.question?.id}: {currentQuestion?.question?.title}</span><br />
                                            <span className="text-secondary">{currentQuestion?.question?.speech}</span>
                                        </div>
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            id="finaliseBtn"
                                            onClick={handleStartInterview}
                                            disabled={isReady || !hasMicAccess || !isBackgroundVideoLoaded}
                                        >
                                            {!isBackgroundVideoLoaded ? 'Loading Video...' : 'I\'m ready'}
                                        </button>
                                    </div>

                                    <div className="d-flex gap-2 mt-3">
                                        <button id="skipBtn" className="btn btn-outline-secondary btn-sm w-100" onClick={handleSkipQuestion} disabled={isReady}>
                                            Skip question
                                        </button>
                                        <button id="exitBtn" className="btn btn-outline-secondary btn-sm w-100" onClick={handleExitInterview} disabled={isReady}>
                                            Exit interview
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MasterLayout>
        );
    }

    // Main interview screen
    return (
        <MasterLayout>
            <div className="row mb-4">
                <div className="col-12 col-xl-12">
                    <div className="card h-100 p-0">
                        <div className="card-body p-0">
                            <div className="ratio ratio-16x9 interview-overlay-wrap">
                                {isVideoLoading && (
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                                        <Spinner animation="border" role="status" variant="primary">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </div>
                                )}

                                {/* Main Video Player */}
                                <div className="video-wrapper">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        controls={false}
                                        disablePictureInPicture
                                        controlsList="nodownload nofullscreen noremoteplayback"
                                        onEnded={startRecording}
                                        onLoadedData={() => {
                                            console.log('Main video loaded');
                                            setIsVideoLoading(false);
                                        }}
                                        onError={(e) => {
                                            console.error('Main video error:', e);
                                            setIsVideoLoading(false);
                                        }}
                                        className={`video-player ${isRecording || isVideoLoading ? 'd-none' : ''}`}
                                    />
                                </div>

                                {/* Filler Video */}
                                <div className="video-wrapper">
                                    <video
                                        src={`${baseUrl}/videos/MPF Interview Filler/Avatar ${currentQuestion?.question?.avatar} FILLER.mp4`}
                                        autoPlay
                                        playsInline
                                        controls={false}
                                        disablePictureInPicture
                                        controlsList="nodownload nofullscreen noremoteplayback"
                                        loop
                                        onLoadedData={() => setIsVideoLoading(false)}
                                        onError={() => setIsVideoLoading(false)}
                                        className={`video-player ${!isRecording || isVideoLoading ? 'd-none' : ''}`}
                                    />
                                </div>

                                {/* Overlay Card */}
                                <div className="card bg-white text-dark border shadow-sm" style={{ position: 'absolute', top: '1rem', left: '1rem', width: '320px', zIndex: 10, borderRadius: '1rem', height: 'auto' }}>
                                    <div className="card-body p-4 d-flex flex-column text-center">
                                        <div className="mb-2">
                                            <div className="fw-bold">{data?.name}</div>
                                            <div className="text-secondary small">Candidate</div>
                                        </div>
                                        <div className="mb-3">
                                            <div className="fw-semibold mb-1">Answer the question</div>
                                            <div className="mic-meter" aria-label="Microphone level" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={audioLevel * 100} style={{ height: '10px', background: '#e9ecef', borderRadius: '9999px', overflow: 'hidden' }}>
                                                <div id="micMeterFill" style={{ height: '100%', width: `${audioLevel * 100}%`, background: 'linear-gradient(90deg, #20c997, #198754)', transition: 'width 100ms linear' }} />
                                            </div>
                                            <div id="micStatus" className={`text-secondary mt-2 ${audioLevel < 0.2 ? 'text-danger' : ''}`} style={{ fontSize: '0.85rem' }}>
                                                <i className="fas fa-microphone-alt me-2" /> {audioLevel < 0.2 ? 'Too quiet' : 'Loud and clear'}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <div className="fw-semibold text-dark small mb-1">Current Question</div>
                                            <div className="p-2 bg-light rounded border small">
                                                <span className="fw-bold">#{currentQuestion?.question?.id}: {currentQuestion?.question?.title}</span> <br />
                                                <span className="text-secondary">{currentQuestion?.question?.description}</span>
                                            </div>
                                        </div>
                                        <div className="d-grid">
                                            <button id="finaliseBtn" className="btn btn-primary btn-sm" onClick={stopRecording} disabled={isSubmitting || !isRecording} >Finalise answer</button>
                                        </div>
                                        <div className="d-flex gap-2 mt-3">
                                            <button id="skipBtn" className="btn btn-outline-secondary btn-sm w-100" onClick={handleSkipQuestion} disabled={isSubmitting} >Skip question</button>
                                            <button id="exitBtn" className="btn btn-outline-secondary btn-sm w-100" onClick={handleExitInterview} disabled={isSubmitting} >Exit interview</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isSubmitting && (
                                <div className="position-fixed top-50 start-50 translate-middle text-center" style={{ zIndex: 1050, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '2rem', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.2)' }}>
                                    <div className="mb-3">
                                        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                                    </div>
                                    <h4>Finalising Your Report</h4>
                                    <p className="text-muted">Please wait while we analyse your response <br></br>{loadingText}...</p>
                                    <div className="progress mt-3" style={{ height: '10px' }}>
                                        <div
                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                            role="progressbar"
                                            style={{ width: '100%' }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
}