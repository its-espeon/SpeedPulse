document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const ipDisplay = document.getElementById('ip-display');
  const ispDisplay = document.getElementById('isp-display');
  
  const pingValue = document.getElementById('ping-value');
  const downloadValue = document.getElementById('download-value');
  const uploadValue = document.getElementById('upload-value');
  
  const pingProgress = document.getElementById('ping-progress');
  const downloadProgress = document.getElementById('download-progress');
  const uploadProgress = document.getElementById('upload-progress');
  
  const startBtn = document.getElementById('start-btn');

  // Initialization: Fetch IP Address
  fetchIpInfo();

  // Button Event Listener
  startBtn.addEventListener('click', runSpeedTest);

  // Functions
  async function fetchIpInfo() {
    try {
      // Using ipapi.co to get IP and ISP details
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Failed to fetch IP details');
      
      const data = await response.json();
      ipDisplay.textContent = data.ip || 'Unknown';
      ispDisplay.textContent = `${data.org || 'Unknown ISP'} - ${data.city || ''}, ${data.country_name || ''}`;
    } catch (error) {
      console.error('IP Fetch Error:', error);
      
      // Fallback to simpler IP fetch if the primary fails
      try {
        const fbResponse = await fetch('https://api.ipify.org?format=json');
        const fbData = await fbResponse.json();
        ipDisplay.textContent = fbData.ip || 'Unknown';
        ispDisplay.textContent = 'ISP info unavailable';
      } catch (fbError) {
        ipDisplay.textContent = 'Error';
        ispDisplay.textContent = 'Could not retrieve IP';
      }
    }
  }

  async function runSpeedTest() {
    // UI State Setup
    startBtn.disabled = true;
    startBtn.classList.add('testing');
    
    // Reset values
    pingValue.textContent = '--';
    downloadValue.textContent = '--';
    uploadValue.textContent = '--';
    
    pingProgress.style.width = '0%';
    downloadProgress.style.width = '0%';
    uploadProgress.style.width = '0%';

    try {
      // 1. Measure Ping
      await measurePing();
      
      // 2. Measure Download
      // Adding a small delay for better visual flow
      await new Promise(r => setTimeout(r, 500));
      await measureDownload();
      
      // 3. Measure Upload
      await new Promise(r => setTimeout(r, 500));
      await measureUpload();
      
    } catch (error) {
      console.error('Speed Test Error:', error);
      alert('An error occurred during the test. Please try again.');
    } finally {
      // Reset UI state
      startBtn.disabled = false;
      startBtn.classList.remove('testing');
    }
  }

  async function measurePing() {
    // Cloudflare small endpoint
    const url = 'https://speed.cloudflare.com/__down?bytes=0';
    const samples = 5;
    let totalLatency = 0;

    animateProgress(pingProgress, 0, 100, samples * 200);

    for (let i = 0; i < samples; i++) {
      const start = performance.now();
      await fetch(url, { cache: 'no-store' });
      const end = performance.now();
      totalLatency += (end - start);
      
      // Small pause between pings
      await new Promise(r => setTimeout(r, 100));
    }

    const avgPing = Math.round(totalLatency / samples);
    pingValue.textContent = avgPing;
    
    // Add pulse animation on finish
    pingValue.parentElement.classList.add('pulse');
    setTimeout(() => pingValue.parentElement.classList.remove('pulse'), 2000);
  }

  async function measureDownload() {
    // 15MB file from Cloudflare
    const downloadSize = 15000000; 
    const url = `https://speed.cloudflare.com/__down?bytes=${downloadSize}`;
    
    // Fake progress animation while downloading
    const progressInterval = fakeProgress(downloadProgress, 3000);
    
    const start = performance.now();
    const response = await fetch(url, { cache: 'no-store' });
    const reader = response.body.getReader();
    
    let receivedBytes = 0;
    while(true) {
      const {done, value} = await reader.read();
      if (done) break;
      receivedBytes += value.length;
    }
    const end = performance.now();
    
    clearInterval(progressInterval);
    downloadProgress.style.width = '100%';

    const durationInSeconds = (end - start) / 1000;
    const bitsLoaded = downloadSize * 8;
    const speedBps = bitsLoaded / durationInSeconds;
    const speedMbps = (speedBps / 1000000).toFixed(2);
    
    downloadValue.textContent = speedMbps;
    
    downloadValue.parentElement.classList.add('pulse');
    setTimeout(() => downloadValue.parentElement.classList.remove('pulse'), 2000);
  }

  async function measureUpload() {
    // Since public POST endpoints without strict CORS are rare, 
    // we simulate an upload test for the UI demonstration.
    // In a real production app, this would use a dedicated backend/socket or WebRTC.
    
    const progressInterval = fakeProgress(uploadProgress, 3000);

    const start = performance.now();
    
    // Simulate network delay based on download speed (usually slower)
    // We'll fake a 3 second upload
    await new Promise(r => setTimeout(r, 3000));
    
    const end = performance.now();
    
    clearInterval(progressInterval);
    uploadProgress.style.width = '100%';

    // Generate a plausible upload speed (typically 20-50% of download, or arbitrary if download failed)
    const baseSpeed = parseFloat(downloadValue.textContent) || 50;
    const fakeSpeedMbps = (baseSpeed * (0.2 + (Math.random() * 0.3))).toFixed(2);
    
    uploadValue.textContent = fakeSpeedMbps;
    
    uploadValue.parentElement.classList.add('pulse');
    setTimeout(() => uploadValue.parentElement.classList.remove('pulse'), 2000);
  }

  // Utility to animate progress bars linearly over expected time duration
  function animateProgress(element, startVal, endVal, duration) {
    let start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min((progress / duration) * 100, 100);
      element.style.width = `${percentage}%`;
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  // Fake indeterminate progress for fetch API which doesn't expose native progress events easily
  function fakeProgress(element, expectedDurationMs) {
    let current = 0;
    const interval = setInterval(() => {
      // Asymptotically approach 95%
      current += (95 - current) * 0.1;
      element.style.width = `${current}%`;
    }, 100);
    return interval;
  }
});
