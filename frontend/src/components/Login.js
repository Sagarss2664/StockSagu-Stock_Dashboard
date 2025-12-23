import React, { useState, useEffect, useRef } from 'react';
import { authAPI } from '../api/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const videoRef = useRef(null);

  // Handle video loading and play
  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      // Set video attributes for autoplay
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      
      // Set video source
      video.src = '/stock.mp4';
      
      // Handle video play
      const playVideo = () => {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Video is playing");
            })
            .catch(error => {
              console.log("Auto-play was prevented:", error);
            });
        }
      };
      
      // Try to play when video is ready
      const handleCanPlay = () => {
        playVideo();
      };
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', (e) => {
        console.error("Video error:", e);
      });
      
      // Force load the video
      video.load();
      
      // Try to play after a short delay
      const timeoutId = setTimeout(() => {
        if (video.paused) {
          playVideo();
        }
      }, 500);
      
      // Cleanup
      return () => {
        clearTimeout(timeoutId);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  // Handle user interaction for browsers that block autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      const video = videoRef.current;
      if (video && video.paused) {
        video.play().catch(e => console.log("Play failed:", e));
      }
    };
    
    // Add click event to entire document
    document.addEventListener('click', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  // Handle resend OTP timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.sendOtp(email);
      
      if (response.data.success) {
        setSuccess(`OTP sent to ${email}`);
        setShowOtpInput(true);
        setOtpSent(true);
        setResendTimer(60);
      } else {
        setError(response.data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.length < 4) {
      setError('OTP must be at least 4 digits');
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.verifyOtp(email, otp);
      
      if (response.data.success) {
        setSuccess('OTP verified successfully!');
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        
        setTimeout(() => {
          onLogin(response.data.user);
        }, 1000);
      } else {
        setError(response.data.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) {
      setError(`Please wait ${resendTimer} seconds before resending OTP`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.resendOtp(email);
      
      if (response.data.success) {
        setSuccess(`New OTP sent to ${email}`);
        setResendTimer(60);
      } else {
        setError(response.data.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setEmail('');
    setOtp('');
    setShowOtpInput(false);
    setOtpSent(false);
    setResendTimer(0);
    setError('');
    setSuccess('');
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* Video Background - Less blur, more visible */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'brightness(0.7)', // Reduced from 0.4 to 0.7 for more brightness
          opacity: 1
        }}
      >
        <source src="/stock.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* Lighter overlay for better readability but still showing video */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Reduced from 0.6 to 0.3
        zIndex: 1
      }} />

      {/* Login Card */}
      <div style={{ 
        maxWidth: '450px',
        width: '100%',
        position: 'relative',
        zIndex: 2,
        animation: 'fadeInUp 0.6s ease-out'
      }}>
        <div style={{
          padding: '35px',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)', // Reduced blur from 10px to 8px
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #3498db, #2ecc71)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 10px 30px rgba(52, 152, 219, 0.4)',
              overflow: 'hidden'
            }}>
              {/* Logo image replacing emoji */}
              <img
                src="/logo.png" // Update this path to your logo file
                alt="Stock Dashboard Logo"
                style={{
                  width: '42px',
                  height: '42px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <h2 style={{ 
              marginBottom: '10px', 
              color: '#2c3e50',
              fontSize: '28px',
              fontWeight: '700',
              background: 'linear-gradient(90deg, #3498db, #2ecc71)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Stock Dashboard
            </h2>
            <p style={{ 
              color: '#7f8c8d', 
              fontSize: '14px',
              marginBottom: '5px'
            }}>
              {showOtpInput ? 'Enter OTP to continue' : 'Enter email to get started'}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div style={{
              backgroundColor: 'rgba(212, 237, 218, 0.95)',
              color: '#155724',
              padding: '12px 15px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #c3e6cb',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '18px' }}>✓</span>
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(248, 215, 218, 0.95)',
              color: '#721c24',
              padding: '12px 15px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #f5c6cb',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Email Input Form */}
          {!showOtpInput ? (
            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: '25px' }}>
                <label htmlFor="email" style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '14px'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid #e0e0e0',
                    fontSize: '14px',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(5px)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3498db';
                    e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(90deg, #3498db, #2ecc71)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  marginBottom: '15px',
                  boxShadow: '0 10px 30px rgba(52, 152, 219, 0.3)',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 15px 35px rgba(52, 152, 219, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(52, 152, 219, 0.3)';
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></span>
                    Sending OTP...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>📧</span>
                    Send OTP
                  </span>
                )}
              </button>
            </form>
          ) : (
            /* OTP Verification Form */
            <form onSubmit={handleVerifyOtp}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  fontSize: '14px'
                }}>
                  Enter OTP sent to: <span style={{ color: '#3498db' }}>{email}</span>
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  disabled={isVerifying}
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid #e0e0e0',
                    fontSize: '22px',
                    textAlign: 'center',
                    letterSpacing: '10px',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(5px)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3498db';
                    e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                  fontSize: '13px'
                }}>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendTimer > 0 ? '#95a5a6' : '#3498db',
                      cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (resendTimer === 0) {
                        e.target.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    {resendTimer > 0 ? `Resend OTP in ${formatTimer(resendTimer)}` : '↻ Resend OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e74c3c',
                      cursor: 'pointer',
                      fontWeight: '600',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    ✕ Change Email
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying || otp.length < 4}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(90deg, #2ecc71, #27ae60)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: (isVerifying || otp.length < 4) ? 'not-allowed' : 'pointer',
                  opacity: (isVerifying || otp.length < 4) ? 0.7 : 1,
                  transition: 'all 0.3s',
                  boxShadow: '0 10px 30px rgba(46, 204, 113, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isVerifying && otp.length >= 4) {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 15px 35px rgba(46, 204, 113, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(46, 204, 113, 0.3)';
                }}
              >
                {isVerifying ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></span>
                    Verifying...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>✓</span>
                    Verify OTP
                  </span>
                )}
              </button>
            </form>
          )}

          {/* Stock Information */}
          <div style={{ 
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              fontWeight: '600', 
              color: '#2c3e50',
              marginBottom: '15px',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '18px' }}>📊</span>
              Real-time Stock Tracking
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              fontSize: '12px'
            }}>
              {[
                { symbol: 'GOOG', name: 'Google', color: '#3498db' },
                { symbol: 'TSLA', name: 'Tesla', color: '#2ecc71' },
                { symbol: 'AMZN', name: 'Amazon', color: '#f39c12' },
                { symbol: 'META', name: 'Meta', color: '#8e44ad' },
                { symbol: 'NVDA', name: 'NVIDIA', color: '#e74c3c' },
                { symbol: 'AAPL', name: 'Apple', color: '#2c3e50' }
              ].map((stock, index) => (
                <div 
                  key={stock.symbol}
                  style={{
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    backdropFilter: 'blur(4px)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <div style={{ 
                    fontWeight: '700', 
                    color: stock.color,
                    fontSize: '14px',
                    marginBottom: '4px'
                  }}>
                    {stock.symbol}
                  </div>
                  <div style={{ color: '#7f8c8d', fontSize: '11px' }}>
                    {stock.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: '25px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#95a5a6',
            paddingTop: '15px',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ marginBottom: '5px' }}>Real-time data with WebSocket updates</p>
            <p style={{ fontSize: '11px', opacity: 0.7, marginBottom: '5px' }}>
              Secure login with OTP verification
            </p>
            
            {/* Developer Information */}
            <div style={{ 
              marginTop: '15px',
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(4px)'
            }}>
              <p style={{ 
                fontWeight: '600', 
                color: '#2c3e50',
                marginBottom: '8px',
                fontSize: '13px'
              }}>
                Sagar Subhas Shegunashi
              </p>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'center',
                fontSize: '11px'
              }}>
                <a 
                  href="https://sagarss2664.github.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#3498db',
                    textDecoration: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  <span style={{ fontSize: '14px' }}>🌐</span>
                  Portfolio: https://sagarss2664.github.io/
                </a>
                
                <a 
                  href="https://github.com/Sagarss2664/StockSagu-Stock_Dashboard.git" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#333',
                    textDecoration: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(51, 51, 51, 0.1)';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  <img 
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
                    alt="GitHub" 
                    style={{
                      width: '14px',
                      height: '14px',
                      filter: 'invert(0.3)'
                    }}
                  />
                  GitHub Repository
                </a>
              </div>
              
              <p style={{ 
                marginTop: '8px',
                fontSize: '10px',
                opacity: 0.6
              }}>
                © {new Date().getFullYear()} Stock Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Login;