// // // // import React, { useState } from 'react';
// // // // import { authAPI } from '../api/api';

// // // // function Login({ onLogin }) {
// // // //   const [email, setEmail] = useState('');
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState('');

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
    
// // // //     if (!email.trim()) {
// // // //       setError('Please enter your email');
// // // //       return;
// // // //     }

// // // //     setLoading(true);
// // // //     setError('');

// // // //     try {
// // // //       const response = await authAPI.login(email);
      
// // // //       if (response.data.success) {
// // // //         onLogin(response.data.user);
// // // //       } else {
// // // //         setError('Login failed. Please try again.');
// // // //       }
// // // //     } catch (err) {
// // // //       setError(err.response?.data?.error || 'An error occurred during login');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
// // // //       <div className="card">
// // // //         <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>
// // // //           Stock Dashboard Login
// // // //         </h2>
        
// // // //         <p style={{ marginBottom: '20px', color: '#666', textAlign: 'center' }}>
// // // //           Enter your email to access the real-time stock dashboard
// // // //         </p>

// // // //         {error && <div className="error">{error}</div>}

// // // //         <form onSubmit={handleSubmit}>
// // // //           <div style={{ marginBottom: '20px' }}>
// // // //             <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
// // // //               Email Address
// // // //             </label>
// // // //             <input
// // // //               type="email"
// // // //               id="email"
// // // //               className="input"
// // // //               value={email}
// // // //               onChange={(e) => setEmail(e.target.value)}
// // // //               placeholder="Enter your email"
// // // //               disabled={loading}
// // // //             />
// // // //           </div>

// // // //           <button
// // // //             type="submit"
// // // //             className="btn btn-primary"
// // // //             style={{ width: '100%' }}
// // // //             disabled={loading}
// // // //           >
// // // //             {loading ? 'Logging in...' : 'Login / Sign Up'}
// // // //           </button>
// // // //         </form>

// // // //         <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
// // // //           <p>Supported Stocks:</p>
// // // //           <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
// // // //             <li>• GOOG - Alphabet Inc. (Google)</li>
// // // //             <li>• TSLA - Tesla Inc.</li>
// // // //             <li>• AMZN - Amazon.com Inc.</li>
// // // //             <li>• META - Meta Platforms Inc.</li>
// // // //             <li>• NVDA - NVIDIA Corporation</li>
// // // //           </ul>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default Login;


// // // import React, { useState, useEffect } from 'react';
// // // import { authAPI } from '../api/api';

// // // function Login({ onLogin }) {
// // //   const [email, setEmail] = useState('');
// // //   const [otp, setOtp] = useState('');
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState('');
// // //   const [success, setSuccess] = useState('');
// // //   const [showOtpInput, setShowOtpInput] = useState(false);
// // //   const [otpSent, setOtpSent] = useState(false);
// // //   const [resendTimer, setResendTimer] = useState(0);
// // //   const [isVerifying, setIsVerifying] = useState(false);

// // //   // Handle resend OTP timer
// // //   useEffect(() => {
// // //     let timer;
// // //     if (resendTimer > 0) {
// // //       timer = setTimeout(() => {
// // //         setResendTimer(prev => prev - 1);
// // //       }, 1000);
// // //     }
// // //     return () => clearTimeout(timer);
// // //   }, [resendTimer]);

// // //   // Format timer display
// // //   const formatTimer = (seconds) => {
// // //     const mins = Math.floor(seconds / 60);
// // //     const secs = seconds % 60;
// // //     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
// // //   };

// // //   const handleSendOtp = async (e) => {
// // //     e?.preventDefault();
    
// // //     if (!email.trim()) {
// // //       setError('Please enter your email');
// // //       return;
// // //     }

// // //     // Basic email validation
// // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // //     if (!emailRegex.test(email)) {
// // //       setError('Please enter a valid email address');
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError('');
// // //     setSuccess('');

// // //     try {
// // //       const response = await authAPI.sendOtp(email);
      
// // //       if (response.data.success) {
// // //         setSuccess(`OTP sent to ${email}`);
// // //         setShowOtpInput(true);
// // //         setOtpSent(true);
// // //         setResendTimer(60); // 60 seconds cooldown
// // //       } else {
// // //         setError(response.data.error || 'Failed to send OTP. Please try again.');
// // //       }
// // //     } catch (err) {
// // //       setError(err.response?.data?.error || 'Network error. Please check your connection.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleVerifyOtp = async (e) => {
// // //     e.preventDefault();
    
// // //     if (!otp.trim()) {
// // //       setError('Please enter the OTP');
// // //       return;
// // //     }

// // //     if (otp.length < 4) {
// // //       setError('OTP must be at least 4 digits');
// // //       return;
// // //     }

// // //     setIsVerifying(true);
// // //     setError('');
// // //     setSuccess('');

// // //     try {
// // //       const response = await authAPI.verifyOtp(email, otp);
      
// // //       if (response.data.success) {
// // //         setSuccess('OTP verified successfully!');
// // //         // Store user data and token
// // //         localStorage.setItem('userToken', response.data.token);
// // //         localStorage.setItem('userData', JSON.stringify(response.data.user));
        
// // //         // Call onLogin with user data after a short delay
// // //         setTimeout(() => {
// // //           onLogin(response.data.user);
// // //         }, 1000);
// // //       } else {
// // //         setError(response.data.error || 'Invalid OTP. Please try again.');
// // //       }
// // //     } catch (err) {
// // //       setError(err.response?.data?.error || 'Verification failed. Please try again.');
// // //     } finally {
// // //       setIsVerifying(false);
// // //     }
// // //   };

// // //   const handleResendOtp = async () => {
// // //     if (resendTimer > 0) {
// // //       setError(`Please wait ${resendTimer} seconds before resending OTP`);
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setError('');
// // //     setSuccess('');

// // //     try {
// // //       const response = await authAPI.resendOtp(email);
      
// // //       if (response.data.success) {
// // //         setSuccess(`New OTP sent to ${email}`);
// // //         setResendTimer(60); // Reset timer
// // //       } else {
// // //         setError(response.data.error || 'Failed to resend OTP. Please try again.');
// // //       }
// // //     } catch (err) {
// // //       setError(err.response?.data?.error || 'Network error. Please try again.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleResetForm = () => {
// // //     setEmail('');
// // //     setOtp('');
// // //     setShowOtpInput(false);
// // //     setOtpSent(false);
// // //     setResendTimer(0);
// // //     setError('');
// // //     setSuccess('');
// // //   };

// // //   return (
// // //     <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
// // //       <div className="card" style={{
// // //         padding: '30px',
// // //         borderRadius: '12px',
// // //         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
// // //         background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
// // //       }}>
// // //         <div style={{ textAlign: 'center', marginBottom: '25px' }}>
// // //           <h2 style={{ 
// // //             marginBottom: '10px', 
// // //             color: '#2c3e50',
// // //             fontSize: '28px',
// // //             fontWeight: '700'
// // //           }}>
// // //             📈 Stock Dashboard
// // //           </h2>
// // //           <p style={{ 
// // //             color: '#7f8c8d', 
// // //             fontSize: '14px',
// // //             marginBottom: '5px'
// // //           }}>
// // //             {showOtpInput ? 'Enter OTP to continue' : 'Enter email to get started'}
// // //           </p>
// // //           <div style={{
// // //             height: '3px',
// // //             width: '50px',
// // //             background: 'linear-gradient(90deg, #3498db, #2ecc71)',
// // //             margin: '0 auto',
// // //             borderRadius: '2px'
// // //           }}></div>
// // //         </div>

// // //         {/* Success Message */}
// // //         {success && (
// // //           <div style={{
// // //             backgroundColor: '#d4edda',
// // //             color: '#155724',
// // //             padding: '12px 15px',
// // //             borderRadius: '8px',
// // //             marginBottom: '20px',
// // //             fontSize: '14px',
// // //             border: '1px solid #c3e6cb',
// // //             display: 'flex',
// // //             alignItems: 'center',
// // //             gap: '8px'
// // //           }}>
// // //             <span style={{ fontSize: '18px' }}>✓</span>
// // //             {success}
// // //           </div>
// // //         )}

// // //         {/* Error Message */}
// // //         {error && (
// // //           <div style={{
// // //             backgroundColor: '#f8d7da',
// // //             color: '#721c24',
// // //             padding: '12px 15px',
// // //             borderRadius: '8px',
// // //             marginBottom: '20px',
// // //             fontSize: '14px',
// // //             border: '1px solid #f5c6cb',
// // //             display: 'flex',
// // //             alignItems: 'center',
// // //             gap: '8px'
// // //           }}>
// // //             <span style={{ fontSize: '18px' }}>⚠️</span>
// // //             {error}
// // //           </div>
// // //         )}

// // //         {/* Email Input Form */}
// // //         {!showOtpInput ? (
// // //           <form onSubmit={handleSendOtp}>
// // //             <div style={{ marginBottom: '25px' }}>
// // //               <label htmlFor="email" style={{ 
// // //                 display: 'block', 
// // //                 marginBottom: '8px',
// // //                 fontWeight: '600',
// // //                 color: '#2c3e50',
// // //                 fontSize: '14px'
// // //               }}>
// // //                 Email Address
// // //               </label>
// // //               <input
// // //                 type="email"
// // //                 id="email"
// // //                 value={email}
// // //                 onChange={(e) => setEmail(e.target.value)}
// // //                 placeholder="Enter your email"
// // //                 disabled={loading}
// // //                 style={{
// // //                   width: '100%',
// // //                   padding: '14px',
// // //                   borderRadius: '8px',
// // //                   border: '2px solid #e0e0e0',
// // //                   fontSize: '14px',
// // //                   transition: 'border-color 0.3s',
// // //                   boxSizing: 'border-box'
// // //                 }}
// // //                 onFocus={(e) => e.target.style.borderColor = '#3498db'}
// // //                 onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
// // //               />
// // //             </div>

// // //             <button
// // //               type="submit"
// // //               disabled={loading}
// // //               style={{
// // //                 width: '100%',
// // //                 padding: '14px',
// // //                 background: 'linear-gradient(90deg, #3498db, #2ecc71)',
// // //                 color: 'white',
// // //                 border: 'none',
// // //                 borderRadius: '8px',
// // //                 fontSize: '16px',
// // //                 fontWeight: '600',
// // //                 cursor: 'pointer',
// // //                 transition: 'transform 0.2s, opacity 0.2s',
// // //                 marginBottom: '15px'
// // //               }}
// // //               onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
// // //               onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
// // //               onMouseDown={(e) => e.target.style.opacity = '0.8'}
// // //               onMouseUp={(e) => e.target.style.opacity = '1'}
// // //             >
// // //               {loading ? (
// // //                 <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
// // //                   <span className="spinner-border spinner-border-sm"></span>
// // //                   Sending OTP...
// // //                 </span>
// // //               ) : (
// // //                 <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
// // //                   <span style={{ fontSize: '18px' }}>📧</span>
// // //                   Send OTP
// // //                 </span>
// // //               )}
// // //             </button>
// // //           </form>
// // //         ) : (
// // //           /* OTP Verification Form */
// // //           <form onSubmit={handleVerifyOtp}>
// // //             <div style={{ marginBottom: '25px' }}>
// // //               <label style={{ 
// // //                 display: 'block', 
// // //                 marginBottom: '8px',
// // //                 fontWeight: '600',
// // //                 color: '#2c3e50',
// // //                 fontSize: '14px'
// // //               }}>
// // //                 Enter OTP sent to: <span style={{ color: '#3498db' }}>{email}</span>
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 id="otp"
// // //                 value={otp}
// // //                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
// // //                 placeholder="Enter 6-digit OTP"
// // //                 disabled={isVerifying}
// // //                 maxLength={6}
// // //                 style={{
// // //                   width: '100%',
// // //                   padding: '14px',
// // //                   borderRadius: '8px',
// // //                   border: '2px solid #e0e0e0',
// // //                   fontSize: '20px',
// // //                   textAlign: 'center',
// // //                   letterSpacing: '8px',
// // //                   fontWeight: '600',
// // //                   transition: 'border-color 0.3s',
// // //                   boxSizing: 'border-box'
// // //                 }}
// // //                 onFocus={(e) => e.target.style.borderColor = '#3498db'}
// // //                 onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
// // //               />
// // //               <div style={{
// // //                 display: 'flex',
// // //                 justifyContent: 'space-between',
// // //                 marginTop: '10px',
// // //                 fontSize: '13px'
// // //               }}>
// // //                 <button
// // //                   type="button"
// // //                   onClick={handleResendOtp}
// // //                   disabled={resendTimer > 0 || loading}
// // //                   style={{
// // //                     background: 'none',
// // //                     border: 'none',
// // //                     color: resendTimer > 0 ? '#95a5a6' : '#3498db',
// // //                     cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
// // //                     fontWeight: '600',
// // //                     padding: '5px 10px',
// // //                     borderRadius: '4px',
// // //                     transition: 'background-color 0.2s'
// // //                   }}
// // //                   onMouseEnter={(e) => {
// // //                     if (resendTimer === 0) {
// // //                       e.target.style.backgroundColor = '#f0f8ff';
// // //                     }
// // //                   }}
// // //                   onMouseLeave={(e) => {
// // //                     e.target.style.backgroundColor = 'transparent';
// // //                   }}
// // //                 >
// // //                   {resendTimer > 0 ? `Resend OTP in ${formatTimer(resendTimer)}` : '↻ Resend OTP'}
// // //                 </button>
// // //                 <button
// // //                   type="button"
// // //                   onClick={handleResetForm}
// // //                   style={{
// // //                     background: 'none',
// // //                     border: 'none',
// // //                     color: '#e74c3c',
// // //                     cursor: 'pointer',
// // //                     fontWeight: '600',
// // //                     padding: '5px 10px',
// // //                     borderRadius: '4px',
// // //                     transition: 'background-color 0.2s'
// // //                   }}
// // //                   onMouseEnter={(e) => e.target.style.backgroundColor = '#fff5f5'}
// // //                   onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
// // //                 >
// // //                   ✕ Change Email
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             <div style={{ display: 'flex', gap: '10px' }}>
// // //               <button
// // //                 type="submit"
// // //                 disabled={isVerifying || otp.length < 4}
// // //                 style={{
// // //                   flex: 1,
// // //                   padding: '14px',
// // //                   background: 'linear-gradient(90deg, #2ecc71, #27ae60)',
// // //                   color: 'white',
// // //                   border: 'none',
// // //                   borderRadius: '8px',
// // //                   fontSize: '16px',
// // //                   fontWeight: '600',
// // //                   cursor: (isVerifying || otp.length < 4) ? 'not-allowed' : 'pointer',
// // //                   opacity: (isVerifying || otp.length < 4) ? 0.7 : 1,
// // //                   transition: 'transform 0.2s, opacity 0.2s'
// // //                 }}
// // //                 onMouseEnter={(e) => {
// // //                   if (!isVerifying && otp.length >= 4) {
// // //                     e.target.style.transform = 'translateY(-2px)';
// // //                   }
// // //                 }}
// // //                 onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
// // //               >
// // //                 {isVerifying ? (
// // //                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
// // //                     <span className="spinner-border spinner-border-sm"></span>
// // //                     Verifying...
// // //                   </span>
// // //                 ) : (
// // //                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
// // //                     <span style={{ fontSize: '18px' }}>✓</span>
// // //                     Verify OTP
// // //                   </span>
// // //                 )}
// // //               </button>
// // //             </div>
// // //           </form>
// // //         )}

// // //         {/* OTP Tips */}
// // //         {showOtpInput && (
// // //           <div style={{
// // //             marginTop: '25px',
// // //             padding: '15px',
// // //             backgroundColor: '#f8f9fa',
// // //             borderRadius: '8px',
// // //             border: '1px solid #e9ecef',
// // //             fontSize: '13px'
// // //           }}>
// // //             <div style={{ 
// // //               fontWeight: '600', 
// // //               color: '#2c3e50',
// // //               marginBottom: '8px',
// // //               display: 'flex',
// // //               alignItems: 'center',
// // //               gap: '6px'
// // //             }}>
// // //               <span style={{ fontSize: '16px' }}>💡</span>
// // //               OTP Tips:
// // //             </div>
// // //             <ul style={{ 
// // //               margin: '0', 
// // //               paddingLeft: '20px',
// // //               color: '#7f8c8d',
// // //               lineHeight: '1.6'
// // //             }}>
// // //               <li>Check your email inbox (and spam folder)</li>
// // //               <li>OTP is valid for 10 minutes</li>
// // //               <li>Enter the 6-digit code received</li>
// // //             </ul>
// // //           </div>
// // //         )}

// // //         {/* Stock Information */}
// // //         <div style={{ 
// // //           marginTop: '25px',
// // //           paddingTop: '20px',
// // //           borderTop: '2px solid #f0f0f0'
// // //         }}>
// // //           <div style={{ 
// // //             fontWeight: '600', 
// // //             color: '#2c3e50',
// // //             marginBottom: '12px',
// // //             fontSize: '15px',
// // //             display: 'flex',
// // //             alignItems: 'center',
// // //             gap: '8px'
// // //           }}>
// // //             <span style={{ fontSize: '18px' }}>📊</span>
// // //             Supported Stocks:
// // //           </div>
// // //           <div style={{
// // //             display: 'grid',
// // //             gridTemplateColumns: 'repeat(2, 1fr)',
// // //             gap: '10px',
// // //             fontSize: '13px'
// // //           }}>
// // //             <div style={{
// // //               padding: '10px',
// // //               backgroundColor: '#e8f4fc',
// // //               borderRadius: '6px',
// // //               border: '1px solid #d6e9f8'
// // //             }}>
// // //               <span style={{ fontWeight: '600', color: '#3498db' }}>GOOG</span>
// // //               <div style={{ color: '#7f8c8d', fontSize: '12px' }}>Alphabet</div>
// // //             </div>
// // //             <div style={{
// // //               padding: '10px',
// // //               backgroundColor: '#e8f6e8',
// // //               borderRadius: '6px',
// // //               border: '1px solid #d6ecd6'
// // //             }}>
// // //               <span style={{ fontWeight: '600', color: '#2ecc71' }}>TSLA</span>
// // //               <div style={{ color: '#7f8c8d', fontSize: '12px' }}>Tesla</div>
// // //             </div>
// // //             <div style={{
// // //               padding: '10px',
// // //               backgroundColor: '#fef5e7',
// // //               borderRadius: '6px',
// // //               border: '1px solid #fdebd0'
// // //             }}>
// // //               <span style={{ fontWeight: '600', color: '#f39c12' }}>AMZN</span>
// // //               <div style={{ color: '#7f8c8d', fontSize: '12px' }}>Amazon</div>
// // //             </div>
// // //             <div style={{
// // //               padding: '10px',
// // //               backgroundColor: '#f4ecf7',
// // //               borderRadius: '6px',
// // //               border: '1px solid #e8daef'
// // //             }}>
// // //               <span style={{ fontWeight: '600', color: '#8e44ad' }}>META</span>
// // //               <div style={{ color: '#7f8c8d', fontSize: '12px' }}>Meta</div>
// // //             </div>
// // //             <div style={{
// // //               padding: '10px',
// // //               backgroundColor: '#eaf2f8',
// // //               borderRadius: '6px',
// // //               border: '1px solid #d4e6f1',
// // //               gridColumn: 'span 2'
// // //             }}>
// // //               <span style={{ fontWeight: '600', color: '#2980b9' }}>NVDA</span>
// // //               <div style={{ color: '#7f8c8d', fontSize: '12px' }}>NVIDIA</div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Footer */}
// // //         <div style={{ 
// // //           marginTop: '20px',
// // //           textAlign: 'center',
// // //           fontSize: '12px',
// // //           color: '#95a5a6',
// // //           paddingTop: '15px',
// // //           borderTop: '1px solid #ecf0f1'
// // //         }}>
// // //           <p>Real-time stock data with WebSocket updates</p>
// // //           <p style={{ fontSize: '11px', opacity: 0.7 }}>
// // //             By logging in, you agree to our Terms of Service
// // //           </p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default Login;

// // import React, { useState, useEffect, useRef } from 'react';
// // import { authAPI } from '../api/api';

// // function Login({ onLogin }) {
// //   const [email, setEmail] = useState('');
// //   const [otp, setOtp] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');
// //   const [showOtpInput, setShowOtpInput] = useState(false);
// //   const [otpSent, setOtpSent] = useState(false);
// //   const [resendTimer, setResendTimer] = useState(0);
// //   const [isVerifying, setIsVerifying] = useState(false);
// //   const videoRef = useRef(null);
// //   const containerRef = useRef(null);

// //   // Handle video loading and play with automatic restart
// //   useEffect(() => {
// //     const video = videoRef.current;
    
// //     if (video) {
// //       // Set video attributes for autoplay
// //       video.autoplay = true;
// //       video.muted = true;
// //       video.loop = true;
// //       video.playsInline = true;
// //       video.preload = "auto";
      
// //       // Set video source
// //       video.src = '/stock.mp4';
      
// //       // Handle video play promise
// //       const playVideo = () => {
// //         const playPromise = video.play();
        
// //         if (playPromise !== undefined) {
// //           playPromise
// //             .then(() => {
// //               console.log("Video is playing");
// //             })
// //             .catch(error => {
// //               console.log("Auto-play was prevented:", error);
// //               // Show play button if needed
// //             });
// //         }
// //       };
      
// //       // Try to play when video is ready
// //       const handleCanPlay = () => {
// //         playVideo();
// //       };
      
// //       // Ensure video loops properly
// //       const handleEnded = () => {
// //         video.currentTime = 0;
// //         video.play();
// //       };
      
// //       video.addEventListener('canplay', handleCanPlay);
// //       video.addEventListener('ended', handleEnded);
// //       video.addEventListener('error', (e) => {
// //         console.error("Video error:", e);
// //       });
      
// //       // Force load the video
// //       video.load();
      
// //       // Try to play after a short delay
// //       const timeoutId = setTimeout(() => {
// //         if (video.paused) {
// //           playVideo();
// //         }
// //       }, 500);
      
// //       // Cleanup
// //       return () => {
// //         clearTimeout(timeoutId);
// //         video.removeEventListener('canplay', handleCanPlay);
// //         video.removeEventListener('ended', handleEnded);
// //         video.pause();
// //       };
// //     }
// //   }, []);

// //   // Alternative: Force play on user interaction
// //   useEffect(() => {
// //     const handleUserInteraction = () => {
// //       const video = videoRef.current;
// //       if (video && video.paused) {
// //         video.play().catch(e => console.log("Play failed:", e));
// //       }
// //     };
    
// //     // Add click event to entire document
// //     document.addEventListener('click', handleUserInteraction);
// //     document.addEventListener('keydown', handleUserInteraction);
// //     document.addEventListener('touchstart', handleUserInteraction);
    
// //     return () => {
// //       document.removeEventListener('click', handleUserInteraction);
// //       document.removeEventListener('keydown', handleUserInteraction);
// //       document.removeEventListener('touchstart', handleUserInteraction);
// //     };
// //   }, []);

// //   // Handle resend OTP timer
// //   useEffect(() => {
// //     let timer;
// //     if (resendTimer > 0) {
// //       timer = setTimeout(() => {
// //         setResendTimer(prev => prev - 1);
// //       }, 1000);
// //     }
// //     return () => clearTimeout(timer);
// //   }, [resendTimer]);

// //   // Format timer display
// //   const formatTimer = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
// //   };

// //   const handleSendOtp = async (e) => {
// //     e?.preventDefault();
    
// //     if (!email.trim()) {
// //       setError('Please enter your email');
// //       return;
// //     }

// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(email)) {
// //       setError('Please enter a valid email address');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');
// //     setSuccess('');

// //     try {
// //       const response = await authAPI.sendOtp(email);
      
// //       if (response.data.success) {
// //         setSuccess(`OTP sent to ${email}`);
// //         setShowOtpInput(true);
// //         setOtpSent(true);
// //         setResendTimer(60);
// //       } else {
// //         setError(response.data.error || 'Failed to send OTP. Please try again.');
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.error || 'Network error. Please check your connection.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleVerifyOtp = async (e) => {
// //     e.preventDefault();
    
// //     if (!otp.trim()) {
// //       setError('Please enter the OTP');
// //       return;
// //     }

// //     if (otp.length < 4) {
// //       setError('OTP must be at least 4 digits');
// //       return;
// //     }

// //     setIsVerifying(true);
// //     setError('');
// //     setSuccess('');

// //     try {
// //       const response = await authAPI.verifyOtp(email, otp);
      
// //       if (response.data.success) {
// //         setSuccess('OTP verified successfully!');
// //         localStorage.setItem('userToken', response.data.token);
// //         localStorage.setItem('userData', JSON.stringify(response.data.user));
        
// //         setTimeout(() => {
// //           onLogin(response.data.user);
// //         }, 1000);
// //       } else {
// //         setError(response.data.error || 'Invalid OTP. Please try again.');
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.error || 'Verification failed. Please try again.');
// //     } finally {
// //       setIsVerifying(false);
// //     }
// //   };

// //   const handleResendOtp = async () => {
// //     if (resendTimer > 0) {
// //       setError(`Please wait ${resendTimer} seconds before resending OTP`);
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');
// //     setSuccess('');

// //     try {
// //       const response = await authAPI.resendOtp(email);
      
// //       if (response.data.success) {
// //         setSuccess(`New OTP sent to ${email}`);
// //         setResendTimer(60);
// //       } else {
// //         setError(response.data.error || 'Failed to resend OTP. Please try again.');
// //       }
// //     } catch (err) {
// //       setError(err.response?.data?.error || 'Network error. Please try again.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleResetForm = () => {
// //     setEmail('');
// //     setOtp('');
// //     setShowOtpInput(false);
// //     setOtpSent(false);
// //     setResendTimer(0);
// //     setError('');
// //     setSuccess('');
// //   };

// //   // Manual video play trigger
// //   const handlePlayVideo = () => {
// //     if (videoRef.current) {
// //       videoRef.current.play().catch(e => {
// //         console.log("Manual play failed:", e);
// //       });
// //     }
// //   };

// //   return (
// //     <div 
// //       ref={containerRef}
// //       style={{
// //         position: 'relative',
// //         minHeight: '100vh',
// //         display: 'flex',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         overflow: 'hidden',
// //         padding: '20px',
// //         background: '#000'
// //       }}
// //     >
// //       {/* Video Background */}
// //       <video
// //         ref={videoRef}
// //         autoPlay
// //         muted
// //         loop
// //         playsInline
// //         preload="auto"
// //         style={{
// //           position: 'fixed',
// //           top: '50%',
// //           left: '50%',
// //           minWidth: '100%',
// //           minHeight: '100%',
// //           width: 'auto',
// //           height: 'auto',
// //           transform: 'translate(-50%, -50%)',
// //           objectFit: 'cover',
// //           zIndex: 0,
// //           filter: 'brightness(0.4) contrast(1.2)',
// //           pointerEvents: 'none'
// //         }}
// //       >
// //         <source src="/stock.mp4" type="video/mp4" />
// //         Your browser does not support HTML5 video.
// //       </video>

// //       {/* Dark overlay for better readability */}
// //       <div style={{
// //         position: 'fixed',
// //         top: 0,
// //         left: 0,
// //         right: 0,
// //         bottom: 0,
// //         backgroundColor: 'rgba(0, 0, 0, 0.6)',
// //         zIndex: 1
// //       }} />

// //       {/* Login Card */}
// //       <div style={{ 
// //         maxWidth: '450px',
// //         width: '100%',
// //         position: 'relative',
// //         zIndex: 2,
// //         animation: 'fadeInUp 0.6s ease-out'
// //       }}>
// //         <div style={{
// //           padding: '35px',
// //           borderRadius: '20px',
// //           boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
// //           background: 'rgba(255, 255, 255, 0.95)',
// //           backdropFilter: 'blur(10px)',
// //           border: '1px solid rgba(255, 255, 255, 0.3)'
// //         }}>
// //           <div style={{ textAlign: 'center', marginBottom: '30px' }}>
// //             <div style={{
// //               width: '70px',
// //               height: '70px',
// //               background: 'linear-gradient(135deg, #3498db, #2ecc71)',
// //               borderRadius: '50%',
// //               display: 'flex',
// //               alignItems: 'center',
// //               justifyContent: 'center',
// //               margin: '0 auto 20px',
// //               boxShadow: '0 10px 30px rgba(52, 152, 219, 0.4)'
// //             }}>
// //               <span style={{ fontSize: '32px', color: 'white' }}>📈</span>
// //             </div>
// //             <h2 style={{ 
// //               marginBottom: '10px', 
// //               color: '#2c3e50',
// //               fontSize: '28px',
// //               fontWeight: '700',
// //               background: 'linear-gradient(90deg, #3498db, #2ecc71)',
// //               WebkitBackgroundClip: 'text',
// //               WebkitTextFillColor: 'transparent'
// //             }}>
// //               Stock Dashboard
// //             </h2>
// //             <p style={{ 
// //               color: '#7f8c8d', 
// //               fontSize: '14px',
// //               marginBottom: '5px'
// //             }}>
// //               {showOtpInput ? 'Enter OTP to continue' : 'Enter email to get started'}
// //             </p>
// //           </div>

// //           {/* Success Message */}
// //           {success && (
// //             <div style={{
// //               backgroundColor: 'rgba(212, 237, 218, 0.95)',
// //               color: '#155724',
// //               padding: '12px 15px',
// //               borderRadius: '10px',
// //               marginBottom: '20px',
// //               fontSize: '14px',
// //               border: '1px solid #c3e6cb',
// //               display: 'flex',
// //               alignItems: 'center',
// //               gap: '8px'
// //             }}>
// //               <span style={{ fontSize: '18px' }}>✓</span>
// //               {success}
// //             </div>
// //           )}

// //           {/* Error Message */}
// //           {error && (
// //             <div style={{
// //               backgroundColor: 'rgba(248, 215, 218, 0.95)',
// //               color: '#721c24',
// //               padding: '12px 15px',
// //               borderRadius: '10px',
// //               marginBottom: '20px',
// //               fontSize: '14px',
// //               border: '1px solid #f5c6cb',
// //               display: 'flex',
// //               alignItems: 'center',
// //               gap: '8px'
// //             }}>
// //               <span style={{ fontSize: '18px' }}>⚠️</span>
// //               {error}
// //             </div>
// //           )}

// //           {/* Email Input Form */}
// //           {!showOtpInput ? (
// //             <form onSubmit={handleSendOtp}>
// //               <div style={{ marginBottom: '25px' }}>
// //                 <label htmlFor="email" style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '600',
// //                   color: '#2c3e50',
// //                   fontSize: '14px'
// //                 }}>
// //                   Email Address
// //                 </label>
// //                 <input
// //                   type="email"
// //                   id="email"
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   placeholder="Enter your email"
// //                   disabled={loading}
// //                   style={{
// //                     width: '100%',
// //                     padding: '16px',
// //                     borderRadius: '12px',
// //                     border: '2px solid #e0e0e0',
// //                     fontSize: '14px',
// //                     transition: 'all 0.3s',
// //                     boxSizing: 'border-box',
// //                     background: 'rgba(255, 255, 255, 0.9)',
// //                     backdropFilter: 'blur(5px)'
// //                   }}
// //                   onFocus={(e) => {
// //                     e.target.style.borderColor = '#3498db';
// //                     e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
// //                   }}
// //                   onBlur={(e) => {
// //                     e.target.style.borderColor = '#e0e0e0';
// //                     e.target.style.boxShadow = 'none';
// //                   }}
// //                 />
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 style={{
// //                   width: '100%',
// //                   padding: '16px',
// //                   background: 'linear-gradient(90deg, #3498db, #2ecc71)',
// //                   color: 'white',
// //                   border: 'none',
// //                   borderRadius: '12px',
// //                   fontSize: '16px',
// //                   fontWeight: '600',
// //                   cursor: loading ? 'not-allowed' : 'pointer',
// //                   transition: 'all 0.3s',
// //                   marginBottom: '15px',
// //                   boxShadow: '0 10px 30px rgba(52, 152, 219, 0.3)',
// //                   opacity: loading ? 0.7 : 1
// //                 }}
// //                 onMouseEnter={(e) => {
// //                   if (!loading) {
// //                     e.target.style.transform = 'translateY(-3px)';
// //                     e.target.style.boxShadow = '0 15px 35px rgba(52, 152, 219, 0.4)';
// //                   }
// //                 }}
// //                 onMouseLeave={(e) => {
// //                   e.target.style.transform = 'translateY(0)';
// //                   e.target.style.boxShadow = '0 10px 30px rgba(52, 152, 219, 0.3)';
// //                 }}
// //               >
// //                 {loading ? (
// //                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
// //                     <span style={{
// //                       width: '16px',
// //                       height: '16px',
// //                       border: '2px solid rgba(255,255,255,0.3)',
// //                       borderTopColor: 'white',
// //                       borderRadius: '50%',
// //                       animation: 'spin 1s linear infinite'
// //                     }}></span>
// //                     Sending OTP...
// //                   </span>
// //                 ) : (
// //                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
// //                     <span style={{ fontSize: '18px' }}>📧</span>
// //                     Send OTP
// //                   </span>
// //                 )}
// //               </button>
// //             </form>
// //           ) : (
// //             /* OTP Verification Form */
// //             <form onSubmit={handleVerifyOtp}>
// //               <div style={{ marginBottom: '25px' }}>
// //                 <label style={{ 
// //                   display: 'block', 
// //                   marginBottom: '8px',
// //                   fontWeight: '600',
// //                   color: '#2c3e50',
// //                   fontSize: '14px'
// //                 }}>
// //                   Enter OTP sent to: <span style={{ color: '#3498db' }}>{email}</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   id="otp"
// //                   value={otp}
// //                   onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
// //                   placeholder="Enter 6-digit OTP"
// //                   disabled={isVerifying}
// //                   maxLength={6}
// //                   style={{
// //                     width: '100%',
// //                     padding: '16px',
// //                     borderRadius: '12px',
// //                     border: '2px solid #e0e0e0',
// //                     fontSize: '22px',
// //                     textAlign: 'center',
// //                     letterSpacing: '10px',
// //                     fontWeight: '600',
// //                     transition: 'all 0.3s',
// //                     boxSizing: 'border-box',
// //                     background: 'rgba(255, 255, 255, 0.9)',
// //                     backdropFilter: 'blur(5px)'
// //                   }}
// //                   onFocus={(e) => {
// //                     e.target.style.borderColor = '#3498db';
// //                     e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
// //                   }}
// //                   onBlur={(e) => {
// //                     e.target.style.borderColor = '#e0e0e0';
// //                     e.target.style.boxShadow = 'none';
// //                   }}
// //                 />
// //                 <div style={{
// //                   display: 'flex',
// //                   justifyContent: 'space-between',
// //                   marginTop: '12px',
// //                   fontSize: '13px'
// //                 }}>
// //                   <button
// //                     type="button"
// //                     onClick={handleResendOtp}
// //                     disabled={resendTimer > 0 || loading}
// //                     style={{
// //                       background: 'none',
// //                       border: 'none',
// //                       color: resendTimer > 0 ? '#95a5a6' : '#3498db',
// //                       cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
// //                       fontWeight: '600',
// //                       padding: '8px 12px',
// //                       borderRadius: '6px',
// //                       transition: 'all 0.2s'
// //                     }}
// //                     onMouseEnter={(e) => {
// //                       if (resendTimer === 0) {
// //                         e.target.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
// //                       }
// //                     }}
// //                     onMouseLeave={(e) => {
// //                       e.target.style.backgroundColor = 'transparent';
// //                     }}
// //                   >
// //                     {resendTimer > 0 ? `Resend OTP in ${formatTimer(resendTimer)}` : '↻ Resend OTP'}
// //                   </button>
// //                   <button
// //                     type="button"
// //                     onClick={handleResetForm}
// //                     style={{
// //                       background: 'none',
// //                       border: 'none',
// //                       color: '#e74c3c',
// //                       cursor: 'pointer',
// //                       fontWeight: '600',
// //                       padding: '8px 12px',
// //                       borderRadius: '6px',
// //                       transition: 'all 0.2s'
// //                     }}
// //                     onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.1)'}
// //                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
// //                   >
// //                     ✕ Change Email
// //                   </button>
// //                 </div>
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={isVerifying || otp.length < 4}
// //                 style={{
// //                   width: '100%',
// //                   padding: '16px',
// //                   background: 'linear-gradient(90deg, #2ecc71, #27ae60)',
// //                   color: 'white',
// //                   border: 'none',
// //                   borderRadius: '12px',
// //                   fontSize: '16px',
// //                   fontWeight: '600',
// //                   cursor: (isVerifying || otp.length < 4) ? 'not-allowed' : 'pointer',
// //                   opacity: (isVerifying || otp.length < 4) ? 0.7 : 1,
// //                   transition: 'all 0.3s',
// //                   boxShadow: '0 10px 30px rgba(46, 204, 113, 0.3)'
// //                 }}
// //                 onMouseEnter={(e) => {
// //                   if (!isVerifying && otp.length >= 4) {
// //                     e.target.style.transform = 'translateY(-3px)';
// //                     e.target.style.boxShadow = '0 15px 35px rgba(46, 204, 113, 0.4)';
// //                   }
// //                 }}
// //                 onMouseLeave={(e) => {
// //                   e.target.style.transform = 'translateY(0)';
// //                   e.target.style.boxShadow = '0 10px 30px rgba(46, 204, 113, 0.3)';
// //                 }}
// //               >
// //                 {isVerifying ? (
// //                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
// //                     <span style={{
// //                       width: '16px',
// //                       height: '16px',
// //                       border: '2px solid rgba(255,255,255,0.3)',
// //                       borderTopColor: 'white',
// //                       borderRadius: '50%',
// //                       animation: 'spin 1s linear infinite'
// //                     }}></span>
// //                     Verifying...
// //                   </span>
// //                 ) : (
// //                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
// //                     <span style={{ fontSize: '18px' }}>✓</span>
// //                     Verify OTP
// //                   </span>
// //                 )}
// //               </button>
// //             </form>
// //           )}

// //           {/* Stock Information */}
// //           <div style={{ 
// //             marginTop: '30px',
// //             paddingTop: '20px',
// //             borderTop: '1px solid rgba(0, 0, 0, 0.1)'
// //           }}>
// //             <div style={{ 
// //               fontWeight: '600', 
// //               color: '#2c3e50',
// //               marginBottom: '15px',
// //               fontSize: '15px',
// //               display: 'flex',
// //               alignItems: 'center',
// //               gap: '8px',
// //               justifyContent: 'center'
// //             }}>
// //               <span style={{ fontSize: '18px' }}>📊</span>
// //               Real-time Stock Tracking
// //             </div>
// //             <div style={{
// //               display: 'grid',
// //               gridTemplateColumns: 'repeat(3, 1fr)',
// //               gap: '10px',
// //               fontSize: '12px'
// //             }}>
// //               {[
// //                 { symbol: 'GOOG', name: 'Google', color: '#3498db' },
// //                 { symbol: 'TSLA', name: 'Tesla', color: '#2ecc71' },
// //                 { symbol: 'AMZN', name: 'Amazon', color: '#f39c12' },
// //                 { symbol: 'META', name: 'Meta', color: '#8e44ad' },
// //                 { symbol: 'NVDA', name: 'NVIDIA', color: '#e74c3c' },
// //                 { symbol: 'AAPL', name: 'Apple', color: '#2c3e50' }
// //               ].map((stock, index) => (
// //                 <div 
// //                   key={stock.symbol}
// //                   style={{
// //                     padding: '10px',
// //                     background: 'rgba(255, 255, 255, 0.7)',
// //                     borderRadius: '8px',
// //                     border: '1px solid rgba(0, 0, 0, 0.1)',
// //                     textAlign: 'center',
// //                     backdropFilter: 'blur(5px)',
// //                     transition: 'transform 0.2s'
// //                   }}
// //                   onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
// //                   onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
// //                 >
// //                   <div style={{ 
// //                     fontWeight: '700', 
// //                     color: stock.color,
// //                     fontSize: '14px',
// //                     marginBottom: '4px'
// //                   }}>
// //                     {stock.symbol}
// //                   </div>
// //                   <div style={{ color: '#7f8c8d', fontSize: '11px' }}>
// //                     {stock.name}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Footer */}
// //           <div style={{ 
// //             marginTop: '25px',
// //             textAlign: 'center',
// //             fontSize: '12px',
// //             color: '#95a5a6',
// //             paddingTop: '15px',
// //             borderTop: '1px solid rgba(0, 0, 0, 0.1)'
// //           }}>
// //             <p>Real-time data with WebSocket updates</p>
// //             <p style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px' }}>
// //               Secure login with OTP verification
// //             </p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Video Play Helper Button (hidden unless needed) */}
// //       <button
// //         onClick={handlePlayVideo}
// //         style={{
// //           position: 'fixed',
// //           bottom: '20px',
// //           right: '20px',
// //           padding: '8px 16px',
// //           background: 'rgba(52, 152, 219, 0.8)',
// //           color: 'white',
// //           border: 'none',
// //           borderRadius: '8px',
// //           fontSize: '12px',
// //           cursor: 'pointer',
// //           zIndex: 3,
// //           opacity: 0.5,
// //           transition: 'opacity 0.3s'
// //         }}
// //         onMouseEnter={(e) => e.target.style.opacity = '1'}
// //         onMouseLeave={(e) => e.target.style.opacity = '0.5'}
// //       >
// //         ▶ Play Video
// //       </button>

// //       {/* Add CSS animations */}
// //       <style jsx>{`
// //         @keyframes fadeInUp {
// //           from {
// //             opacity: 0;
// //             transform: translateY(20px);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }
        
// //         @keyframes spin {
// //           0% { transform: rotate(0deg); }
// //           100% { transform: rotate(360deg); }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }

// // export default Login;

// import React, { useState, useEffect, useRef } from 'react';
// import { authAPI } from '../api/api';

// function Login({ onLogin }) {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showOtpInput, setShowOtpInput] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [resendTimer, setResendTimer] = useState(0);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const videoRef = useRef(null);

//   // Handle video loading and play
//   useEffect(() => {
//     const video = videoRef.current;
    
//     if (video) {
//       // Set video attributes for autoplay
//       video.autoplay = true;
//       video.muted = true;
//       video.loop = true;
//       video.playsInline = true;
//       video.preload = "auto";
      
//       // Set video source
//       video.src = '/stock.mp4';
      
//       // Handle video play
//       const playVideo = () => {
//         const playPromise = video.play();
        
//         if (playPromise !== undefined) {
//           playPromise
//             .then(() => {
//               console.log("Video is playing");
//             })
//             .catch(error => {
//               console.log("Auto-play was prevented:", error);
//             });
//         }
//       };
      
//       // Try to play when video is ready
//       const handleCanPlay = () => {
//         playVideo();
//       };
      
//       video.addEventListener('canplay', handleCanPlay);
//       video.addEventListener('error', (e) => {
//         console.error("Video error:", e);
//       });
      
//       // Force load the video
//       video.load();
      
//       // Try to play after a short delay
//       const timeoutId = setTimeout(() => {
//         if (video.paused) {
//           playVideo();
//         }
//       }, 500);
      
//       // Cleanup
//       return () => {
//         clearTimeout(timeoutId);
//         video.removeEventListener('canplay', handleCanPlay);
//       };
//     }
//   }, []);

//   // Handle user interaction for browsers that block autoplay
//   useEffect(() => {
//     const handleUserInteraction = () => {
//       const video = videoRef.current;
//       if (video && video.paused) {
//         video.play().catch(e => console.log("Play failed:", e));
//       }
//     };
    
//     // Add click event to entire document
//     document.addEventListener('click', handleUserInteraction);
    
//     return () => {
//       document.removeEventListener('click', handleUserInteraction);
//     };
//   }, []);

//   // Handle resend OTP timer
//   useEffect(() => {
//     let timer;
//     if (resendTimer > 0) {
//       timer = setTimeout(() => {
//         setResendTimer(prev => prev - 1);
//       }, 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendTimer]);

//   // Format timer display
//   const formatTimer = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleSendOtp = async (e) => {
//     e?.preventDefault();
    
//     if (!email.trim()) {
//       setError('Please enter your email');
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await authAPI.sendOtp(email);
      
//       if (response.data.success) {
//         setSuccess(`OTP sent to ${email}`);
//         setShowOtpInput(true);
//         setOtpSent(true);
//         setResendTimer(60);
//       } else {
//         setError(response.data.error || 'Failed to send OTP. Please try again.');
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || 'Network error. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
    
//     if (!otp.trim()) {
//       setError('Please enter the OTP');
//       return;
//     }

//     if (otp.length < 4) {
//       setError('OTP must be at least 4 digits');
//       return;
//     }

//     setIsVerifying(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await authAPI.verifyOtp(email, otp);
      
//       if (response.data.success) {
//         setSuccess('OTP verified successfully!');
//         localStorage.setItem('userToken', response.data.token);
//         localStorage.setItem('userData', JSON.stringify(response.data.user));
        
//         setTimeout(() => {
//           onLogin(response.data.user);
//         }, 1000);
//       } else {
//         setError(response.data.error || 'Invalid OTP. Please try again.');
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || 'Verification failed. Please try again.');
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     if (resendTimer > 0) {
//       setError(`Please wait ${resendTimer} seconds before resending OTP`);
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await authAPI.resendOtp(email);
      
//       if (response.data.success) {
//         setSuccess(`New OTP sent to ${email}`);
//         setResendTimer(60);
//       } else {
//         setError(response.data.error || 'Failed to resend OTP. Please try again.');
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || 'Network error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResetForm = () => {
//     setEmail('');
//     setOtp('');
//     setShowOtpInput(false);
//     setOtpSent(false);
//     setResendTimer(0);
//     setError('');
//     setSuccess('');
//   };

//   return (
//     <div style={{
//       position: 'relative',
//       minHeight: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       overflow: 'hidden',
//       padding: '20px'
//     }}>
//       {/* Video Background - Less blur, more visible */}
//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         loop
//         playsInline
//         preload="auto"
//         style={{
//           position: 'fixed',
//           top: '50%',
//           left: '50%',
//           minWidth: '100%',
//           minHeight: '100%',
//           width: 'auto',
//           height: 'auto',
//           transform: 'translate(-50%, -50%)',
//           objectFit: 'cover',
//           zIndex: 0,
//           filter: 'brightness(0.7)', // Reduced from 0.4 to 0.7 for more brightness
//           opacity: 1
//         }}
//       >
//         <source src="/stock.mp4" type="video/mp4" />
//         Your browser does not support HTML5 video.
//       </video>

//       {/* Lighter overlay for better readability but still showing video */}
//       <div style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         backgroundColor: 'rgba(0, 0, 0, 0.3)', // Reduced from 0.6 to 0.3
//         zIndex: 1
//       }} />

//       {/* Login Card */}
//       <div style={{ 
//         maxWidth: '450px',
//         width: '100%',
//         position: 'relative',
//         zIndex: 2,
//         animation: 'fadeInUp 0.6s ease-out'
//       }}>
//         <div style={{
//           padding: '35px',
//           borderRadius: '20px',
//           boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
//           background: 'rgba(255, 255, 255, 0.95)',
//           backdropFilter: 'blur(8px)', // Reduced blur from 10px to 8px
//           border: '1px solid rgba(255, 255, 255, 0.3)'
//         }}>
//           <div style={{ textAlign: 'center', marginBottom: '30px' }}>
//             <div style={{
//               width: '70px',
//               height: '70px',
//               background: 'linear-gradient(135deg, #3498db, #2ecc71)',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               margin: '0 auto 20px',
//               boxShadow: '0 10px 30px rgba(52, 152, 219, 0.4)'
//             }}>
//               <span style={{ fontSize: '32px', color: 'white' }}>📈</span>
//             </div>
//             <h2 style={{ 
//               marginBottom: '10px', 
//               color: '#2c3e50',
//               fontSize: '28px',
//               fontWeight: '700',
//               background: 'linear-gradient(90deg, #3498db, #2ecc71)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent'
//             }}>
//               Stock Dashboard
//             </h2>
//             <p style={{ 
//               color: '#7f8c8d', 
//               fontSize: '14px',
//               marginBottom: '5px'
//             }}>
//               {showOtpInput ? 'Enter OTP to continue' : 'Enter email to get started'}
//             </p>
//           </div>

//           {/* Success Message */}
//           {success && (
//             <div style={{
//               backgroundColor: 'rgba(212, 237, 218, 0.95)',
//               color: '#155724',
//               padding: '12px 15px',
//               borderRadius: '10px',
//               marginBottom: '20px',
//               fontSize: '14px',
//               border: '1px solid #c3e6cb',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px'
//             }}>
//               <span style={{ fontSize: '18px' }}>✓</span>
//               {success}
//             </div>
//           )}

//           {/* Error Message */}
//           {error && (
//             <div style={{
//               backgroundColor: 'rgba(248, 215, 218, 0.95)',
//               color: '#721c24',
//               padding: '12px 15px',
//               borderRadius: '10px',
//               marginBottom: '20px',
//               fontSize: '14px',
//               border: '1px solid #f5c6cb',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px'
//             }}>
//               <span style={{ fontSize: '18px' }}>⚠️</span>
//               {error}
//             </div>
//           )}

//           {/* Email Input Form */}
//           {!showOtpInput ? (
//             <form onSubmit={handleSendOtp}>
//               <div style={{ marginBottom: '25px' }}>
//                 <label htmlFor="email" style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '600',
//                   color: '#2c3e50',
//                   fontSize: '14px'
//                 }}>
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email"
//                   disabled={loading}
//                   style={{
//                     width: '100%',
//                     padding: '16px',
//                     borderRadius: '12px',
//                     border: '2px solid #e0e0e0',
//                     fontSize: '14px',
//                     transition: 'all 0.3s',
//                     boxSizing: 'border-box',
//                     background: 'rgba(255, 255, 255, 0.95)',
//                     backdropFilter: 'blur(5px)'
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = '#3498db';
//                     e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = '#e0e0e0';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 style={{
//                   width: '100%',
//                   padding: '16px',
//                   background: 'linear-gradient(90deg, #3498db, #2ecc71)',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '12px',
//                   fontSize: '16px',
//                   fontWeight: '600',
//                   cursor: loading ? 'not-allowed' : 'pointer',
//                   transition: 'all 0.3s',
//                   marginBottom: '15px',
//                   boxShadow: '0 10px 30px rgba(52, 152, 219, 0.3)',
//                   opacity: loading ? 0.7 : 1
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!loading) {
//                     e.target.style.transform = 'translateY(-3px)';
//                     e.target.style.boxShadow = '0 15px 35px rgba(52, 152, 219, 0.4)';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.transform = 'translateY(0)';
//                   e.target.style.boxShadow = '0 10px 30px rgba(52, 152, 219, 0.3)';
//                 }}
//               >
//                 {loading ? (
//                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
//                     <span style={{
//                       width: '16px',
//                       height: '16px',
//                       border: '2px solid rgba(255,255,255,0.3)',
//                       borderTopColor: 'white',
//                       borderRadius: '50%',
//                       animation: 'spin 1s linear infinite'
//                     }}></span>
//                     Sending OTP...
//                   </span>
//                 ) : (
//                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
//                     <span style={{ fontSize: '18px' }}>📧</span>
//                     Send OTP
//                   </span>
//                 )}
//               </button>
//             </form>
//           ) : (
//             /* OTP Verification Form */
//             <form onSubmit={handleVerifyOtp}>
//               <div style={{ marginBottom: '25px' }}>
//                 <label style={{ 
//                   display: 'block', 
//                   marginBottom: '8px',
//                   fontWeight: '600',
//                   color: '#2c3e50',
//                   fontSize: '14px'
//                 }}>
//                   Enter OTP sent to: <span style={{ color: '#3498db' }}>{email}</span>
//                 </label>
//                 <input
//                   type="text"
//                   id="otp"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
//                   placeholder="Enter 6-digit OTP"
//                   disabled={isVerifying}
//                   maxLength={6}
//                   style={{
//                     width: '100%',
//                     padding: '16px',
//                     borderRadius: '12px',
//                     border: '2px solid #e0e0e0',
//                     fontSize: '22px',
//                     textAlign: 'center',
//                     letterSpacing: '10px',
//                     fontWeight: '600',
//                     transition: 'all 0.3s',
//                     boxSizing: 'border-box',
//                     background: 'rgba(255, 255, 255, 0.95)',
//                     backdropFilter: 'blur(5px)'
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = '#3498db';
//                     e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = '#e0e0e0';
//                     e.target.style.boxShadow = 'none';
//                   }}
//                 />
//                 <div style={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   marginTop: '12px',
//                   fontSize: '13px'
//                 }}>
//                   <button
//                     type="button"
//                     onClick={handleResendOtp}
//                     disabled={resendTimer > 0 || loading}
//                     style={{
//                       background: 'none',
//                       border: 'none',
//                       color: resendTimer > 0 ? '#95a5a6' : '#3498db',
//                       cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
//                       fontWeight: '600',
//                       padding: '8px 12px',
//                       borderRadius: '6px',
//                       transition: 'all 0.2s'
//                     }}
//                     onMouseEnter={(e) => {
//                       if (resendTimer === 0) {
//                         e.target.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       e.target.style.backgroundColor = 'transparent';
//                     }}
//                   >
//                     {resendTimer > 0 ? `Resend OTP in ${formatTimer(resendTimer)}` : '↻ Resend OTP'}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleResetForm}
//                     style={{
//                       background: 'none',
//                       border: 'none',
//                       color: '#e74c3c',
//                       cursor: 'pointer',
//                       fontWeight: '600',
//                       padding: '8px 12px',
//                       borderRadius: '6px',
//                       transition: 'all 0.2s'
//                     }}
//                     onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(231, 76, 60, 0.1)'}
//                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                   >
//                     ✕ Change Email
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isVerifying || otp.length < 4}
//                 style={{
//                   width: '100%',
//                   padding: '16px',
//                   background: 'linear-gradient(90deg, #2ecc71, #27ae60)',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '12px',
//                   fontSize: '16px',
//                   fontWeight: '600',
//                   cursor: (isVerifying || otp.length < 4) ? 'not-allowed' : 'pointer',
//                   opacity: (isVerifying || otp.length < 4) ? 0.7 : 1,
//                   transition: 'all 0.3s',
//                   boxShadow: '0 10px 30px rgba(46, 204, 113, 0.3)'
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isVerifying && otp.length >= 4) {
//                     e.target.style.transform = 'translateY(-3px)';
//                     e.target.style.boxShadow = '0 15px 35px rgba(46, 204, 113, 0.4)';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.transform = 'translateY(0)';
//                   e.target.style.boxShadow = '0 10px 30px rgba(46, 204, 113, 0.3)';
//                 }}
//               >
//                 {isVerifying ? (
//                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
//                     <span style={{
//                       width: '16px',
//                       height: '16px',
//                       border: '2px solid rgba(255,255,255,0.3)',
//                       borderTopColor: 'white',
//                       borderRadius: '50%',
//                       animation: 'spin 1s linear infinite'
//                     }}></span>
//                     Verifying...
//                   </span>
//                 ) : (
//                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
//                     <span style={{ fontSize: '18px' }}>✓</span>
//                     Verify OTP
//                   </span>
//                 )}
//               </button>
//             </form>
//           )}

//           {/* Stock Information */}
//           <div style={{ 
//             marginTop: '30px',
//             paddingTop: '20px',
//             borderTop: '1px solid rgba(0, 0, 0, 0.1)'
//           }}>
//             <div style={{ 
//               fontWeight: '600', 
//               color: '#2c3e50',
//               marginBottom: '15px',
//               fontSize: '15px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//               justifyContent: 'center'
//             }}>
//               <span style={{ fontSize: '18px' }}>📊</span>
//               Real-time Stock Tracking
//             </div>
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(3, 1fr)',
//               gap: '10px',
//               fontSize: '12px'
//             }}>
//               {[
//                 { symbol: 'GOOG', name: 'Google', color: '#3498db' },
//                 { symbol: 'TSLA', name: 'Tesla', color: '#2ecc71' },
//                 { symbol: 'AMZN', name: 'Amazon', color: '#f39c12' },
//                 { symbol: 'META', name: 'Meta', color: '#8e44ad' },
//                 { symbol: 'NVDA', name: 'NVIDIA', color: '#e74c3c' },
//                 { symbol: 'AAPL', name: 'Apple', color: '#2c3e50' }
//               ].map((stock, index) => (
//                 <div 
//                   key={stock.symbol}
//                   style={{
//                     padding: '10px',
//                     background: 'rgba(255, 255, 255, 0.9)',
//                     borderRadius: '8px',
//                     border: '1px solid rgba(0, 0, 0, 0.1)',
//                     textAlign: 'center',
//                     backdropFilter: 'blur(4px)',
//                     transition: 'transform 0.2s'
//                   }}
//                   onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
//                   onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
//                 >
//                   <div style={{ 
//                     fontWeight: '700', 
//                     color: stock.color,
//                     fontSize: '14px',
//                     marginBottom: '4px'
//                   }}>
//                     {stock.symbol}
//                   </div>
//                   <div style={{ color: '#7f8c8d', fontSize: '11px' }}>
//                     {stock.name}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Footer */}
//           <div style={{ 
//             marginTop: '25px',
//             textAlign: 'center',
//             fontSize: '12px',
//             color: '#95a5a6',
//             paddingTop: '15px',
//             borderTop: '1px solid rgba(0, 0, 0, 0.1)'
//           }}>
//             <p>Real-time data with WebSocket updates</p>
//             <p style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px' }}>
//               Secure login with OTP verification
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Add CSS animations */}
//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default Login;

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
            <p>Real-time data with WebSocket updates</p>
            <p style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px' }}>
              Secure login with OTP verification
            </p>
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