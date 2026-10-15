(() => {
  const TOTAL_FRAMES = 240;
  const canvas = document.getElementById('scroll-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  const images = new Array(TOTAL_FRAMES);
  let targetProgress = 0;
  let currentProgress = 0;
  let currentRenderedIndex = -1;
  let needsRedraw = true;

  // Frame path helper
  function getFramePath(num) {
    const padded = String(num).padStart(3, '0');
    return `frames/ezgif-frame-${padded}.jpg`;
  }

  // Find nearest loaded frame to guarantee continuous smooth visuals
  function getReadyFrame(idx) {
    if (images[idx] && images[idx].complete && images[idx].naturalWidth > 0) {
      return { frame: images[idx], index: idx };
    }
    // Search backward
    for (let i = idx - 1; i >= 0; i--) {
      if (images[i] && images[i].complete && images[i].naturalWidth > 0) {
        return { frame: images[i], index: i };
      }
    }
    // Search forward
    for (let i = idx + 1; i < TOTAL_FRAMES; i++) {
      if (images[i] && images[i].complete && images[i].naturalWidth > 0) {
        return { frame: images[i], index: i };
      }
    }
    return { frame: null, index: -1 };
  }

  // Draw frame to canvas with object-fit: cover
  function renderFrame(targetIndex) {
    const { frame, index } = getReadyFrame(targetIndex);
    if (!frame) return;

    if (index === currentRenderedIndex && !needsRedraw) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = frame.naturalWidth || 1280;
    const imgH = frame.naturalHeight || 720;

    // Cover math: preserve aspect ratio, fill screen without distorting
    const ratio = Math.max(canvasW / imgW, canvasH / imgH);
    const drawW = imgW * ratio;
    const drawH = imgH * ratio;
    const offsetX = (canvasW - drawW) / 2;
    const offsetY = (canvasH - drawH) / 2;

    ctx.drawImage(frame, offsetX, offsetY, drawW, drawH);

    currentRenderedIndex = index;
    needsRedraw = false;
  }

  // Resize canvas for crisp Retina displays
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    needsRedraw = true;
    const currentFrame = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1)))
    );
    renderFrame(currentFrame);
  }

  // Compute scroll scrub progress across the entire page journey
  function updateScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1;
    const maxScroll = Math.max(1, scrollHeight - window.innerHeight);
    targetProgress = Math.min(1, Math.max(0, scrollTop / maxScroll));
  }

  // Preload all 240 frames in parallel
  function preloadAllFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const idx = i - 1;

      img.onload = () => {
        images[idx] = img;
        if (idx === 0 && currentRenderedIndex === -1) {
          needsRedraw = true;
          renderFrame(0);
        }
      };

      img.src = getFramePath(i);
    }
  }

  // Event Listeners
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Project Carousel Navigation & Drag-to-Scroll
  const projectsTrack = document.getElementById('projects-track');
  const btnPrev = document.getElementById('proj-prev');
  const btnNext = document.getElementById('proj-next');
  const projDots = document.querySelectorAll('#projects-dots .proj-dot');

  if (projectsTrack) {
    const getCardWidth = () => {
      const card = projectsTrack.querySelector('.project-item-card');
      return card ? card.offsetWidth + 28 : 380;
    };

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        projectsTrack.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        projectsTrack.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
      });
    }

    // Update active pagination dot on scroll
    const updateActiveDot = () => {
      const scrollPos = projectsTrack.scrollLeft;
      const cardWidth = getCardWidth();
      const activeIdx = Math.min(projDots.length - 1, Math.max(0, Math.round(scrollPos / cardWidth)));
      projDots.forEach((dot, idx) => {
        if (idx === activeIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    projectsTrack.addEventListener('scroll', updateActiveDot, { passive: true });

    // Click dot to navigate
    projDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const cardWidth = getCardWidth();
        projectsTrack.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
      });
    });

    // Mouse Grab and Drag
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    projectsTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - projectsTrack.offsetLeft;
      scrollStart = projectsTrack.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
    });

    projectsTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - projectsTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      projectsTrack.scrollLeft = scrollStart - walk;
    });
  }

  // Timeline Tab Switcher (Experience vs Education)
  const tabBtnExp = document.getElementById('tab-btn-exp');
  const tabBtnEdu = document.getElementById('tab-btn-edu');
  const contentExp = document.getElementById('content-experience');
  const contentEdu = document.getElementById('content-education');
  const timelineTitle = document.getElementById('timeline-title');

  function switchTimelineTab(tab) {
    if (tab === 'experience') {
      tabBtnExp.classList.add('active');
      tabBtnEdu.classList.remove('active');
      contentExp.classList.add('active');
      contentEdu.classList.remove('active');
      if (timelineTitle) timelineTitle.textContent = 'Experience';
    } else {
      tabBtnEdu.classList.add('active');
      tabBtnExp.classList.remove('active');
      contentEdu.classList.add('active');
      contentExp.classList.remove('active');
      if (timelineTitle) timelineTitle.textContent = 'Education';
    }
  }

  if (tabBtnExp && tabBtnEdu) {
    tabBtnExp.addEventListener('click', () => switchTimelineTab('experience'));
    tabBtnEdu.addEventListener('click', () => switchTimelineTab('education'));
  }

  // ========================================================
  // ORDER CUSTOM PROJECTS VIA EMAIL INTERACTIVITY
  // ========================================================
  const PRIMARY_EMAIL = 'subham.codehub@gmail.com';

  // Copy Primary Email to Clipboard
  const btnCopyPrimary = document.getElementById('btn-copy-primary-email');
  if (btnCopyPrimary) {
    btnCopyPrimary.addEventListener('click', () => {
      navigator.clipboard.writeText(PRIMARY_EMAIL).then(() => {
        const label = btnCopyPrimary.querySelector('.copy-label-text');
        if (label) {
          const originalText = label.textContent;
          label.textContent = 'Copied to Clipboard! ✓';
          btnCopyPrimary.style.borderColor = '#10b981';
          btnCopyPrimary.style.color = '#6ee7b7';
          setTimeout(() => {
            label.textContent = originalText;
            btnCopyPrimary.style.borderColor = '';
            btnCopyPrimary.style.color = '';
          }, 2400);
        }
      }).catch(() => {
        prompt('Copy email:', PRIMARY_EMAIL);
      });
    });
  }

  // ========================================================
  // SUPABASE BACKEND INTEGRATION - INQUIRY FORM SUBMISSION
  // ========================================================
  const SUPABASE_CONFIG = {
    url: 'https://tgcmuawdbvvvwmdkwkag.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY211YXdkYnZ2dndtZGt3a2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNDA2NTgsImV4cCI6MjEwNzYxNjY1OH0.X0eVEi3DSXWNpiqxZVRhxEV9ueuE76Cw2LzWv82-TUE'
  };

  // Initialize official Supabase client if SDK loaded
  let supabaseClient = null;
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }

  const inquiryForm = document.getElementById('inquiry-form');
  const btnSubmitInquiry = document.getElementById('btn-submit-inquiry');
  const formFeedback = document.getElementById('form-feedback');

  function showFeedback(type, title, message) {
    if (!formFeedback) return;
    formFeedback.className = `form-feedback-message ${type}`;
    const iconSvg = type === 'success'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    formFeedback.innerHTML = `
      <div class="feedback-icon-box">${iconSvg}</div>
      <div class="feedback-text-wrap">
        <span class="feedback-title">${title}</span>
        <span class="feedback-desc">${message}</span>
      </div>
    `;
    formFeedback.style.display = 'flex';
    formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('user-name');
      const emailInput = document.getElementById('user-email');
      const phoneInput = document.getElementById('user-number');
      const scalingInput = document.getElementById('scaling-challenge');
      const revenueInput = document.getElementById('annual-revenue');
      const tenureInput = document.getElementById('business-tenure');
      const spendInput = document.getElementById('marketing-spend');
      const paidAdsInput = document.getElementById('paid-ads');

      const payload = {
        name: nameInput ? nameInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        phone: phoneInput ? phoneInput.value.trim() : '',
        scaling_challenge: scalingInput ? scalingInput.value : '',
        annual_revenue: revenueInput ? revenueInput.value : '',
        business_tenure: tenureInput ? tenureInput.value : '',
        marketing_spend: spendInput ? spendInput.value : '',
        paid_ads: paidAdsInput ? paidAdsInput.value : '',
        status: 'new'
      };

      if (!payload.name || !payload.email) {
        showFeedback('error', 'Required Fields Missing', 'Please provide at least your Name and Email address.');
        return;
      }

      // Submit Button Loading state
      const submitTextEl = btnSubmitInquiry ? btnSubmitInquiry.querySelector('.btn-submit-text') : null;
      const originalText = submitTextEl ? submitTextEl.textContent : 'Send Application';
      if (btnSubmitInquiry) {
        btnSubmitInquiry.disabled = true;
        btnSubmitInquiry.classList.add('is-loading');
        if (submitTextEl) submitTextEl.textContent = 'Submitting to Supabase...';
      }
      if (formFeedback) formFeedback.style.display = 'none';

      try {
        let savedSuccessfully = false;

        // Ensure Supabase client is ready if SDK loaded after script run
        if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
          supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        }

        // Method 1: Via Official Supabase JS SDK
        if (supabaseClient) {
          const { error } = await supabaseClient.from('inquiries').insert([payload]);
          if (!error) {
            savedSuccessfully = true;
          } else {
            console.warn('Supabase SDK error, falling back to direct REST API:', error);
          }
        }

        // Method 2: Direct Supabase REST API (high-reliability fallback)
        if (!savedSuccessfully) {
          const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/inquiries`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_CONFIG.anonKey,
              'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            savedSuccessfully = true;
          } else {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || `Server returned status ${response.status}`);
          }
        }

        // Success Feedback
        showFeedback(
          'success',
          'Application Received & Saved to Supabase!',
          `Thank you, ${payload.name}! Your inquiry has been securely stored in our Supabase database. Subham will review your requirements and get in touch within 24 hours.`
        );

        // Reset form inputs
        inquiryForm.reset();

      } catch (err) {
        console.error('Supabase submission error:', err);
        showFeedback(
          'error',
          'Submission Error',
          `Could not connect to Supabase backend (${err.message || 'Network error'}). You can also email Subham directly at ${PRIMARY_EMAIL}.`
        );
      } finally {
        if (btnSubmitInquiry) {
          btnSubmitInquiry.disabled = false;
          btnSubmitInquiry.classList.remove('is-loading');
          if (submitTextEl) submitTextEl.textContent = originalText;
        }
      }
    });
  }

  // Render loop with lerp damping (0.09 gives silky smooth inertia)
  const LERP_SPEED = 0.09;

  function tick() {
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0001) {
      currentProgress += diff * LERP_SPEED;
    } else {
      currentProgress = targetProgress;
    }

    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(currentProgress * (TOTAL_FRAMES - 1)))
    );

    renderFrame(frameIndex);

    requestAnimationFrame(tick);
  }

  // Initialize
  resizeCanvas();
  updateScroll();
  preloadAllFrames();
  requestAnimationFrame(tick);
})();
