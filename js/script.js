/**
 * CHATLY ART & CRAFT MARKETPLACE - CORE JAVASCRIPT ENGINE
 * No Emojis - Pure Material Symbols and Clean Architecture
 */

// ==========================================================================
// 1. UNIQUE ART & CRAFT PRELOADER ENGINE
// ==========================================================================
(function initArtisanPreloader() {
  const navEntry = window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  const isReload = navEntry ? navEntry.type === 'reload' : (window.performance && performance.navigation && performance.navigation.type === 1);
  const shouldSkip = sessionStorage.getItem('skip_artisan_preloader') === 'true' || isReload;

  if (shouldSkip) {
    sessionStorage.removeItem('skip_artisan_preloader');
    document.documentElement.classList.add('no-preloader');
    const preloader = document.getElementById('artisan-preloader');
    if (preloader) {
      preloader.style.display = 'none';
      preloader.dataset.dismissed = 'true';
    }
    window.dispatchEvent(new CustomEvent('artisanCurtainOpened'));
    return;
  }

  const startTime = performance.now();
  const minDisplayTime = 1500; // Minimum 1.5s display

  function hidePreloader() {
    const preloader = document.getElementById('artisan-preloader');
    if (!preloader || preloader.dataset.dismissed === 'true') return;
    preloader.dataset.dismissed = 'true';

    const elapsed = performance.now() - startTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsed);

    setTimeout(() => {
      // Trigger Stage 6: Handcrafted Split-Paper Curtain Reveal
      preloader.classList.add('preloader-revealed');
      window.dispatchEvent(new CustomEvent('artisanCurtainOpened'));
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.style.display = 'none';
        }
      }, 950);
    }, remainingTime);
  }

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }

  // Safety fallback
  setTimeout(hidePreloader, 3200);
})();

// ==========================================================================
// 2. AUTHENTICATION & USER SESSION MANAGER (localStorage)
// ==========================================================================
const AuthManager = {
  SESSION_KEY: 'chatly_session',
  USERS_KEY: 'chatly_users',

  init() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const defaultUsers = [
        {
          name: 'Kumar Pandian',
          email: 'kumarpandian@gmail.com',
          role: 'Buyer',
          password: 'password123'
        },
        {
          name: 'Amara Okafor',
          email: 'amaraokafor@gmail.com',
          role: 'Seller',
          password: 'password123'
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }

    if (!this.getCurrentSession()) {
      this.setSession({
        name: 'Kumar Pandian',
        email: 'kumarpandian@gmail.com',
        role: 'Buyer',
        isLoggedIn: true
      });
    }
  },

  getCurrentSession() {
    try {
      const session = localStorage.getItem(this.SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      return null;
    }
  },

  setSession(user) {
    const sessionData = {
      name: user.name || 'Kumar Pandian',
      email: user.email || 'kumarpandian@gmail.com',
      role: user.role || 'Buyer',
      isLoggedIn: true,
      timestamp: Date.now()
    };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    return sessionData;
  },

  clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  getInitials(name) {
    if (!name) return 'KP';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  },

  registerUser(name, email, role, password) {
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    const newUser = { name, email, role, password };

    if (existingIndex >= 0) {
      users[existingIndex] = newUser;
    } else {
      users.push(newUser);
    }
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  loginUser(email, password, selectedRole) {
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      const autoName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).trim() || 'Artisan Member';
      user = {
        name: autoName,
        email: email,
        role: selectedRole || 'Buyer',
        password: password
      };
      users.push(user);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    if (selectedRole) {
      user.role = selectedRole;
    }

    this.setSession(user);
    return user;
  }
};

AuthManager.init();

// ==========================================================================
// 3. TOAST NOTIFICATION UTILITY (DISABLED)
// ==========================================================================
function showArtisanToast(message, iconName = 'verified') {
  // Popups disabled per user instruction: "dont show this kind of pop ups"
  return;
}

// ==========================================================================
// 4. HEADER & PUBLIC NAVIGATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Drawer Toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileToggle.classList.toggle('open');
      mobileDrawer.classList.toggle('open');
    });

    // Close when clicking outside of drawer
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('open');
        mobileDrawer.classList.remove('open');
      }
    });

    // Close when clicking any nav link inside drawer
    mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Header scroll shadow
  const header = document.querySelector('.public-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Highlight active public nav link (both desktop and mobile)
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu .nav-link, .mobile-drawer .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Setup Public components
  initHeroBgSlideshow();
  initHeroWordAnimations();
  setupArtworkTabs();
  setupFaqAccordion();
  setupContactForm();
  setupAuthForms();
  setupDashboard();
  initCtaWordAnimations();
  initScrollAnimations();
  initCustomSelects();
});

// ==========================================================================
// 4b. HERO LIVE BACKGROUND IMAGES SLIDESHOW (2-SECOND CONTINUOUS CYCLE)
// ==========================================================================
function initHeroBgSlideshow() {
  const slideshow = document.getElementById('hero-bg-slideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.hero-bg-slide');
  if (slides.length <= 1) return;

  let currentIndex = 0;
  setInterval(() => {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
  }, 2000); // Exactly 2 seconds continuous cycle
}

// ==========================================================================
// 4c. HERO SUBTITLE WORD-BY-WORD STAGGER ENTRANCE (RIGHT TO LEFT)
// ==========================================================================
function initHeroWordAnimations() {
  const heroSentences = document.querySelectorAll('.hero-words-sentence, .hero-subtitle-arranged');
  heroSentences.forEach(sentence => {
    if (sentence.querySelectorAll('.hero-word-right').length > 0) return;
    const text = sentence.textContent.trim().replace(/\s+/g, ' ');
    if (!text) return;
    const words = text.split(' ');
    sentence.innerHTML = words.map((w, idx) => `<span class="hero-word-right" style="--w-idx: ${idx};">${w}</span>`).join(' ');
  });
}

// ==========================================================================
// 5. ARTWORK TABS & WISHLIST
// ==========================================================================
function setupArtworkTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const artworkCards = document.querySelectorAll('.artwork-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      artworkCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Wishlist heart buttons
  document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      btn.classList.toggle('active');
      const isSaved = btn.classList.contains('active');
      const iconSpan = btn.querySelector('.material-symbols-outlined');
      if (iconSpan) {
        iconSpan.textContent = isSaved ? 'favorite' : 'favorite_border';
      }
      showArtisanToast(isSaved ? 'Artwork added to your Wishlist!' : 'Artwork removed from Wishlist', 'favorite');
    });
  });
}

// ==========================================================================
// 6. FAQ ACCORDION
// ==========================================================================
function setupFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.faq-item');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ==========================================================================
// 7. CONTACT FORM VALIDATION
// ==========================================================================
function setupContactForm() {
  const contactForm = document.getElementById('chatly-contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    let isValid = true;

    if (!nameInput.value.trim()) {
      nameInput.classList.add('is-invalid');
      isValid = false;
    } else {
      nameInput.classList.remove('is-invalid');
      nameInput.classList.add('is-valid');
    }

    if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
      emailInput.classList.add('is-invalid');
      isValid = false;
    } else {
      emailInput.classList.remove('is-invalid');
      emailInput.classList.add('is-valid');
    }

    if (!subjectInput.value.trim()) {
      subjectInput.classList.add('is-invalid');
      isValid = false;
    } else {
      subjectInput.classList.remove('is-invalid');
      subjectInput.classList.add('is-valid');
    }

    if (!messageInput.value.trim()) {
      messageInput.classList.add('is-invalid');
      isValid = false;
    } else {
      messageInput.classList.remove('is-invalid');
      messageInput.classList.add('is-valid');
    }

    if (isValid) {
      window.location.href = '404.html';
    }
  });
}

// ==========================================================================
// 7b. CUSTOM ARTISAN DROPDOWN ENGINE (NO NATIVE HTML DROPDOWNS)
// ==========================================================================
function initCustomSelects() {
  // 1. Auto-enhance any standard <select> that has not yet been converted
  document.querySelectorAll('select.form-control:not(.custom-select-native)').forEach(select => {
    if (select.closest('.custom-select-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    if (select.id) wrapper.id = select.id + '-wrapper';

    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.classList.add('custom-select-native');
    select.setAttribute('tabindex', '-1');
    select.setAttribute('aria-hidden', 'true');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const selectedOption = select.options[select.selectedIndex] || select.options[0];
    const initialText = selectedOption ? selectedOption.text : 'Select an option...';
    const isPlaceholder = !select.value;

    trigger.innerHTML = `
      <span class="custom-select-text ${isPlaceholder ? 'is-placeholder' : ''}">${initialText}</span>
      <span class="material-symbols-outlined custom-select-arrow">expand_more</span>
    `;
    wrapper.appendChild(trigger);

    const menu = document.createElement('div');
    menu.className = 'custom-select-menu';
    menu.setAttribute('role', 'listbox');

    Array.from(select.options).forEach((opt, idx) => {
      const optDiv = document.createElement('div');
      optDiv.className = 'custom-select-option';
      if (!opt.value && idx === 0) optDiv.classList.add('is-placeholder');
      if (opt.selected && opt.value) optDiv.classList.add('selected');
      optDiv.dataset.value = opt.value;
      optDiv.setAttribute('role', 'option');
      optDiv.innerHTML = `<span>${opt.text}</span>`;
      menu.appendChild(optDiv);
    });

    wrapper.appendChild(menu);
  });

  // 2. Bind event handlers to all .custom-select-wrapper components
  const wrappers = document.querySelectorAll('.custom-select-wrapper');
  wrappers.forEach(wrapper => {
    if (wrapper.dataset.customSelectBound === 'true') return;
    wrapper.dataset.customSelectBound = 'true';

    const nativeSelect = wrapper.querySelector('.custom-select-native');
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const textSpan = wrapper.querySelector('.custom-select-text');
    const menu = wrapper.querySelector('.custom-select-menu');
    const options = wrapper.querySelectorAll('.custom-select-option');

    if (!trigger || !menu) return;

    // Toggle dropdown open / close
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('open');

      // Close all other open dropdowns
      document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
        if (w !== wrapper) {
          w.classList.remove('open');
          const t = w.querySelector('.custom-select-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        wrapper.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        wrapper.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Handle option click
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = opt.dataset.value ?? '';
        const labelText = opt.querySelector('span:not(.material-symbols-outlined)')?.textContent?.trim() || opt.textContent.trim();

        options.forEach(o => o.classList.remove('selected'));
        if (value) {
          opt.classList.add('selected');
        }

        if (textSpan) {
          textSpan.textContent = labelText;
          if (!value) {
            textSpan.classList.add('is-placeholder');
          } else {
            textSpan.classList.remove('is-placeholder');
          }
        }

        if (nativeSelect) {
          nativeSelect.value = value;
          nativeSelect.classList.remove('is-invalid');
          nativeSelect.classList.add('is-valid');
          wrapper.classList.remove('is-invalid');
          wrapper.classList.add('is-valid');
          nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
          nativeSelect.dispatchEvent(new Event('input', { bubbles: true }));
        }

        wrapper.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    // Form reset synchronization
    const parentForm = wrapper.closest('form');
    if (parentForm) {
      parentForm.addEventListener('reset', () => {
        setTimeout(() => {
          options.forEach(o => o.classList.remove('selected'));
          const defaultOpt = options[0];
          if (defaultOpt) {
            const labelText = defaultOpt.querySelector('span:not(.material-symbols-outlined)')?.textContent?.trim() || defaultOpt.textContent.trim();
            if (textSpan) {
              textSpan.textContent = labelText;
              textSpan.classList.add('is-placeholder');
            }
          }
          wrapper.classList.remove('is-invalid', 'is-valid');
        }, 15);
      });
    }

    // Observer for validation states on underlying select
    if (nativeSelect) {
      const observer = new MutationObserver(() => {
        if (nativeSelect.classList.contains('is-invalid')) {
          wrapper.classList.add('is-invalid');
          wrapper.classList.remove('is-valid');
        } else if (nativeSelect.classList.contains('is-valid')) {
          wrapper.classList.remove('is-invalid');
          wrapper.classList.add('is-valid');
        } else {
          wrapper.classList.remove('is-invalid', 'is-valid');
        }
      });
      observer.observe(nativeSelect, { attributes: true, attributeFilter: ['class'] });
    }
  });
}

// Global click-outside listener
document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-select-wrapper')) {
    document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
      w.classList.remove('open');
      const t = w.querySelector('.custom-select-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
});

// Global Escape key listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.custom-select-wrapper.open').forEach(w => {
      w.classList.remove('open');
      const t = w.querySelector('.custom-select-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
});

window.initCustomSelects = initCustomSelects;

// ==========================================================================
// 8. AUTH PAGES: LOGIN, SIGNUP & FORGOT PASSWORD
// ==========================================================================
function setupAuthForms() {
  const roleButtons = document.querySelectorAll('.role-toggle-btn');
  let selectedRole = 'Buyer';

  const activeRoleBtn = document.querySelector('.role-toggle-btn.active');
  if (activeRoleBtn) {
    selectedRole = activeRoleBtn.dataset.role;
  }

  roleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRole = btn.dataset.role;
    });
  });

  // Toggle Password Visibility
  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector('.material-symbols-outlined');
      if (input && input.tagName === 'INPUT') {
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.textContent = 'visibility';
        } else {
          input.type = 'password';
          if (icon) icon.textContent = 'visibility_off';
        }
      }
    });
  });

  // LOGIN PAGE
  const loginForm = document.getElementById('chatly-login-form');
  if (loginForm) {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const forgotLink = document.getElementById('show-forgot-password-btn');
    const backToLoginBtn = document.getElementById('back-to-login-btn');
    const loginView = document.getElementById('login-main-view');
    const forgotView = document.getElementById('forgot-password-view');
    const forgotForm = document.getElementById('chatly-forgot-form');

    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }

    if (backToLoginBtn && loginView && forgotView) {
      backToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        forgotView.classList.remove('active');
        loginView.style.display = 'block';
      });
    }

    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const forgotEmail = document.getElementById('forgot-email');
        const val = (forgotEmail.value || '').trim();
        const isGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(val);

        if (!isGmail) {
          forgotEmail.classList.add('is-invalid');
          const err = forgotEmail.parentElement.querySelector('.form-error-msg');
          if (err) err.textContent = 'Please enter a valid Gmail address ending with @gmail.com';
          return;
        }

        forgotEmail.classList.remove('is-invalid');
        forgotEmail.classList.add('is-valid');
        showArtisanToast(`Password recovery link sent to ${val}! Check your inbox.`, 'mail');
        setTimeout(() => {
          forgotView.classList.remove('active');
          loginView.style.display = 'block';
          forgotForm.reset();
        }, 2000);
      });
    }

    emailInput.addEventListener('input', () => {
      validateGmailInput(emailInput);
    });

    passwordInput.addEventListener('input', () => {
      validatePasswordInput(passwordInput);
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isEmailValid = validateGmailInput(emailInput);
      const isPassValid = validatePasswordInput(passwordInput);

      if (!isEmailValid || !isPassValid) {
        if (!isEmailValid) emailInput.focus();
        else if (!isPassValid) passwordInput.focus();
        return;
      }

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const user = AuthManager.loginUser(email, password, selectedRole);

      showArtisanToast(`Welcome, ${user.name}! Opening ${user.role} Dashboard...`, 'verified');

      setTimeout(() => {
        if (user.role === 'Seller') {
          window.location.href = 'seller-dashboard.html';
        } else {
          window.location.href = 'buyer-dashboard.html';
        }
      }, 700);
    });
  }

  // SIGNUP PAGE
  const signupForm = document.getElementById('chatly-signup-form');
  if (signupForm) {
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');

    nameInput.addEventListener('input', () => {
      const formGroup = nameInput.closest('.form-group');
      const errorMsg = formGroup ? formGroup.querySelector('.form-error-msg') : null;
      if (nameInput.value.trim().length >= 2) {
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid');
        if (formGroup) formGroup.classList.remove('has-error');
        if (errorMsg) errorMsg.style.display = 'none';
      } else {
        nameInput.classList.add('is-invalid');
        nameInput.classList.remove('is-valid');
        if (formGroup) formGroup.classList.add('has-error');
        if (errorMsg) {
          errorMsg.textContent = 'Please enter your full name (minimum 2 characters).';
          errorMsg.style.display = 'block';
        }
      }
    });

    emailInput.addEventListener('input', () => {
      validateGmailInput(emailInput);
    });

    passwordInput.addEventListener('input', () => {
      validatePasswordInput(passwordInput);
      if (confirmPasswordInput.value) {
        validateConfirmPassword(passwordInput, confirmPasswordInput);
      }
    });

    confirmPasswordInput.addEventListener('input', () => {
      validateConfirmPassword(passwordInput, confirmPasswordInput);
    });

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isNameValid = nameInput.value.trim().length >= 2;
      const isEmailValid = validateGmailInput(emailInput);
      const isPassValid = validatePasswordInput(passwordInput);
      const isConfirmValid = validateConfirmPassword(passwordInput, confirmPasswordInput);

      if (!isNameValid) {
        nameInput.classList.add('is-invalid');
        const fg = nameInput.closest('.form-group');
        if (fg) {
          fg.classList.add('has-error');
          const err = fg.querySelector('.form-error-msg');
          if (err) err.style.display = 'block';
        }
      }

      if (!isNameValid || !isEmailValid || !isPassValid || !isConfirmValid) {
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isPassValid) passwordInput.focus();
        else if (!isConfirmValid) confirmPasswordInput.focus();
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const role = 'Buyer';

      AuthManager.registerUser(name, email, role, password);
      AuthManager.setSession({ name, email, role, isLoggedIn: true });

      showArtisanToast('Account created successfully! Redirecting to Login...', 'check_circle');

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 900);
    });
  }
}

function validateGmailInput(input) {
  const val = (input.value || '').trim();
  const isGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(val);
  const formGroup = input.closest('.form-group');
  const errorMsg = formGroup ? formGroup.querySelector('.form-error-msg') : null;

  if (!val) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    if (formGroup) formGroup.classList.add('has-error');
    if (errorMsg) {
      errorMsg.textContent = 'Email address is required.';
      errorMsg.style.display = 'block';
    }
    return false;
  }

  if (!isGmail) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    if (formGroup) formGroup.classList.add('has-error');
    if (errorMsg) {
      errorMsg.textContent = 'Must be a valid Gmail address ending with @gmail.com';
      errorMsg.style.display = 'block';
    }
    return false;
  }

  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  if (formGroup) formGroup.classList.remove('has-error');
  if (errorMsg) {
    errorMsg.style.display = 'none';
  }
  return true;
}

function validatePasswordInput(input) {
  const val = input.value || '';
  const formGroup = input.closest('.form-group');
  const errorMsg = formGroup ? formGroup.querySelector('.form-error-msg') : null;

  if (val.length < 8) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    if (formGroup) formGroup.classList.add('has-error');
    if (errorMsg) {
      errorMsg.textContent = 'Please enter at least 8 characters';
      errorMsg.style.display = 'block';
    }
    return false;
  }

  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  if (formGroup) formGroup.classList.remove('has-error');
  if (errorMsg) {
    errorMsg.style.display = 'none';
  }
  return true;
}

function validateConfirmPassword(passInput, confirmInput) {
  const pass = passInput.value || '';
  const confirm = confirmInput.value || '';
  const formGroup = confirmInput.closest('.form-group');
  const errorMsg = formGroup ? formGroup.querySelector('.form-error-msg') : null;

  if (confirm.length < 8) {
    confirmInput.classList.add('is-invalid');
    confirmInput.classList.remove('is-valid');
    if (formGroup) formGroup.classList.add('has-error');
    if (errorMsg) {
      errorMsg.textContent = 'Please enter at least 8 characters';
      errorMsg.style.display = 'block';
    }
    return false;
  }

  if (confirm !== pass) {
    confirmInput.classList.add('is-invalid');
    confirmInput.classList.remove('is-valid');
    if (formGroup) formGroup.classList.add('has-error');
    if (errorMsg) {
      errorMsg.textContent = 'Passwords do not match.';
      errorMsg.style.display = 'block';
    }
    return false;
  }

  confirmInput.classList.remove('is-invalid');
  confirmInput.classList.add('is-valid');
  if (formGroup) formGroup.classList.remove('has-error');
  if (errorMsg) {
    errorMsg.style.display = 'none';
  }
  return true;
}

// ==========================================================================
// 9. DASHBOARD CONTROLLER (BUYER & SELLER)
// ==========================================================================
function setupDashboard() {
  const isBuyerDash = document.body.classList.contains('buyer-dashboard-page');
  const isSellerDash = document.body.classList.contains('seller-dashboard-page');

  if (!isBuyerDash && !isSellerDash) return;

  const session = AuthManager.getCurrentSession();
  if (!session || !session.isLoggedIn) {
    window.location.href = 'login.html';
    return;
  }

  const userName = session.name || (isSellerDash ? 'Amara Okafor' : 'Kumar Pandian');
  const userEmail = session.email || (isSellerDash ? 'amaraokafor@gmail.com' : 'kumarpandian@gmail.com');
  const userRole = session.role || (isSellerDash ? 'Seller' : 'Buyer');
  const initials = AuthManager.getInitials(userName);

  const navUserNameEl = document.getElementById('nav-user-name');
  if (navUserNameEl) navUserNameEl.textContent = userName;

  const navInitialsEl = document.getElementById('nav-profile-initials');
  if (navInitialsEl) navInitialsEl.textContent = initials;

  const navRoleBadge = document.getElementById('nav-role-badge');
  if (navRoleBadge) navRoleBadge.textContent = userRole;

  const dropName = document.getElementById('dropdown-user-name');
  if (dropName) dropName.textContent = userName;

  const dropEmail = document.getElementById('dropdown-user-email');
  if (dropEmail) dropEmail.textContent = userEmail;

  const dropRole = document.getElementById('dropdown-user-role');
  if (dropRole) dropRole.textContent = userRole;

  const welcomeTitle = document.getElementById('dashboard-welcome-heading');
  if (welcomeTitle) {
    welcomeTitle.textContent = `Welcome back, ${userName}!`;
    welcomeTitle.dataset.wordsSplit = 'false';
  }

  const userPill = document.getElementById('dashboard-user-pill');
  const profileDropdown = document.getElementById('profile-dropdown-menu');

  if (userPill && profileDropdown) {
    userPill.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && !userPill.contains(e.target)) {
        profileDropdown.classList.remove('open');
      }
    });
  }

  // Handle Logout (from Sidebar End Button or Dropdown)
  const logoutButtons = document.querySelectorAll('#sidebar-logout-btn, .sidebar-logout-btn, #dropdown-logout-btn, .dropdown-logout-btn');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      AuthManager.clearSession();
      showArtisanToast('Logged out successfully. Returning to Login...', 'logout');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 700);
    });
  });

  const sidebarToggle = document.getElementById('dashboard-sidebar-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const sidebarClose = document.getElementById('sidebar-close-btn') || document.querySelector('.sidebar-close-btn');

  function openDashboardSidebar() {
    if (sidebar) {
      sidebar.classList.add('mobile-open');
      if (window.innerWidth <= 860) {
        document.body.style.overflow = 'hidden';
      }
    }
  }

  function closeDashboardSidebar() {
    if (sidebar) {
      sidebar.classList.remove('mobile-open');
      document.body.style.overflow = '';
    }
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains('mobile-open')) {
        closeDashboardSidebar();
      } else {
        openDashboardSidebar();
      }
    });
  }

  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDashboardSidebar();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('mobile-open')) {
      closeDashboardSidebar();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && sidebar && sidebar.classList.contains('mobile-open')) {
      closeDashboardSidebar();
    }
  });

  const dashLogos = document.querySelectorAll('.dashboard-nav-left .brand-logo-link, .sidebar-brand-header .brand-logo-link');
  dashLogos.forEach(logo => {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.setItem('skip_artisan_preloader', 'true');
      if (isBuyerDash) {
        window.location.href = 'buyer-dashboard.html';
      } else if (isSellerDash) {
        window.location.href = 'seller-dashboard.html';
      }
    });
  });

  // Global logo links: skip preloader on refresh navigation
  document.querySelectorAll('.brand-logo-link').forEach(logo => {
    logo.addEventListener('click', () => {
      sessionStorage.setItem('skip_artisan_preloader', 'true');
    });
  });

  // Simplified 5 Top-Level Sidebar Navigation
  setupCleanSidebar();

  if (isBuyerDash) {
    renderBuyerCharts();
  } else if (isSellerDash) {
    renderSellerCharts();
    setupAddProductModal();
    setupPublishCraftForm();
  }

  // Initialize scroll-triggered shuffle animations for 3-card sections
  initScrollAnimations();
}

// ==========================================================================
// 10. SIMPLIFIED 5 TOP-LEVEL SIDEBAR NAVIGATION
// ==========================================================================
function setupCleanSidebar() {
  const currentNavHeading = document.getElementById('dashboard-current-heading');
  const mainBtns = document.querySelectorAll('.sidebar-main-btn');
  const viewPanels = document.querySelectorAll('.dashboard-view-panel');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const contentArea = document.querySelector('.dashboard-content-area');

  mainBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mainBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const title = btn.dataset.title || btn.innerText.trim();
      const targetView = btn.dataset.targetView;

      if (currentNavHeading) {
        currentNavHeading.textContent = title;
      }

      // CRITICAL: Always reset scroll to the very top when clicking sidebar headings
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (contentArea) {
        contentArea.scrollTop = 0;
      }

      if (targetView) {
        viewPanels.forEach(panel => {
          if (panel.id === targetView) {
            panel.classList.add('active');
            panel.style.animation = 'none';
            void panel.offsetWidth;
            panel.style.animation = 'fadeIn 0.3s ease';

            // Re-trigger and replay animations for cards in this panel
            triggerPanelAnimations(panel);
          } else {
            panel.classList.remove('active');
          }
        });
      }

      if (window.innerWidth <= 860 && sidebar) {
        sidebar.classList.remove('mobile-open');
        document.body.style.overflow = '';
      }
    });
  });

  // Setup Discover Art Category Filtering
  setupDiscoverCategoryFilters();

  // Initialize Word-by-Word Arrange Animation for Dashboard Headings
  initDashboardHeadingWordAnimations(document);
}

/**
 * Splits bold headings word-by-word with staggered arrange-from-right animation.
 */
function splitHeadingIntoWords(heading) {
  if (!heading || heading.dataset.wordsSplit === 'true') return;

  const childNodes = Array.from(heading.childNodes);
  // Guard against complex controls inside headings
  for (const node of childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE && ['BUTTON', 'INPUT', 'SELECT', 'A', 'FORM'].includes(node.tagName)) {
      return;
    }
  }

  const fragment = document.createDocumentFragment();
  let wordIndex = 0;

  childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      const tokens = text.match(/\S+|\s+/g);
      if (tokens) {
        tokens.forEach(token => {
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(token));
          } else {
            const span = document.createElement('span');
            span.className = 'word-arrange-item';
            span.textContent = token;
            span.style.animationDelay = `${(wordIndex * 0.08).toFixed(2)}s`;
            fragment.appendChild(span);
            wordIndex++;
          }
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList.contains('badge') || node.classList.contains('material-symbols-outlined')) {
        fragment.appendChild(node.cloneNode(true));
      } else {
        const text = node.textContent;
        const tokens = text.match(/\S+|\s+/g);
        if (tokens) {
          tokens.forEach(token => {
            if (/^\s+$/.test(token)) {
              fragment.appendChild(document.createTextNode(token));
            } else {
              const span = document.createElement('span');
              span.className = 'word-arrange-item';
              span.textContent = token;
              span.style.animationDelay = `${(wordIndex * 0.08).toFixed(2)}s`;
              fragment.appendChild(span);
              wordIndex++;
            }
          });
        }
      }
    }
  });

  heading.innerHTML = '';
  heading.appendChild(fragment);
  heading.dataset.wordsSplit = 'true';
  heading.classList.add('anim-words-heading');
}

function initDashboardHeadingWordAnimations(root = document) {
  if (!document.querySelector('.dashboard-layout')) return;

  const selector = '.dashboard-welcome-title, .section-subtitle-title, .card-artisan > h3, .chart-title, .table-header h3';
  const headings = root.querySelectorAll(selector);
  headings.forEach(heading => {
    splitHeadingIntoWords(heading);
  });
}

function triggerPanelAnimations(panel) {
  if (!panel) return;

  // Re-trigger KPI shuffle cards
  const kpiCards = panel.querySelectorAll('.kpi-card');
  kpiCards.forEach(c => {
    c.style.animation = 'none';
    void c.offsetWidth;
    c.style.animation = '';
  });

  // Re-trigger slide pairs (left and right)
  const slideLefts = panel.querySelectorAll('.anim-from-left, .anim-triplet-left, .anim-queue-left, .anim-arrange-left');
  slideLefts.forEach(c => {
    c.style.animation = 'none';
    void c.offsetWidth;
    c.style.animation = '';
  });

  const slideRights = panel.querySelectorAll('.anim-from-right, .anim-triplet-right, .anim-remittance-right, .anim-arrange-right');
  slideRights.forEach(c => {
    c.style.animation = 'none';
    void c.offsetWidth;
    c.style.animation = '';
  });

  // Re-trigger triplet center
  const tripletCenters = panel.querySelectorAll('.anim-triplet-center');
  tripletCenters.forEach(c => {
    c.style.animation = 'none';
    void c.offsetWidth;
    c.style.animation = '';
  });

  // Re-trigger cascade items
  const cascades = panel.querySelectorAll('.anim-cascade-item');
  cascades.forEach(c => {
    c.style.animation = 'none';
    void c.offsetWidth;
    c.style.animation = '';
  });

  // Re-trigger table row slide-from-right animations
  const tableRows = panel.querySelectorAll('.table-row-slide-right, .artisan-table tbody tr');
  tableRows.forEach(r => {
    r.style.animation = 'none';
    void r.offsetWidth;
    r.style.animation = '';
  });

  // Re-trigger Direct Cultural Impact Scorecard arrange animation & live run numbers
  const impactCard = panel.querySelector('.impact-scorecard-card');
  if (impactCard) {
    triggerImpactScorecardAnimations(impactCard);
  }

  // Re-trigger Collector Activity & Provenance Audit Log arrange animations
  const auditLogs = panel.querySelectorAll('.anim-log-arrange, .audit-log-item');
  auditLogs.forEach(item => {
    item.style.animation = 'none';
    void item.offsetWidth;
    item.style.animation = '';
  });

  // Re-trigger Curatorial Patron Tiers & Badges arrange animation & progress bar live run
  const patronCard = panel.querySelector('.patron-tiers-card');
  if (patronCard) {
    triggerPatronTiersAnimations(patronCard);
  }

  // Re-trigger Active Patrons & Collectors 1-by-1 rows from right
  const patronRows = panel.querySelectorAll('.anim-patron-row');
  patronRows.forEach(row => {
    row.style.animation = 'none';
    void row.offsetWidth;
    row.style.animation = '';
  });

  // Split and Re-trigger word-by-word arrange from right for bold headings
  initDashboardHeadingWordAnimations(panel);
  const headingWords = panel.querySelectorAll('.word-arrange-item');
  headingWords.forEach(w => {
    w.style.animation = 'none';
    void w.offsetWidth;
    w.style.animation = '';
  });

  // Re-trigger tracking stepper progress line
  const stepperFill = panel.querySelector('.tracking-stepper-fill');
  if (stepperFill) {
    stepperFill.style.animation = 'none';
    void stepperFill.offsetWidth;
    stepperFill.style.animation = '';
  }

  // Re-bind scroll observer for newly active panel
  if (typeof initScrollAnimations === 'function') {
    initScrollAnimations();
  }
}

/**
 * Live Run Numbers (Animated Number Counter)
 * Counts up smoothly from 0 to target stop value using requestAnimationFrame.
 */
function runLiveCounter(el, delayMs = 0, durationMs = 1200) {
  if (!el) return;

  const target = parseFloat(el.getAttribute('data-count') || '0');
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const useComma = el.getAttribute('data-comma') === 'true';

  if (el._liveAnimId) {
    cancelAnimationFrame(el._liveAnimId);
    el._liveAnimId = null;
  }
  if (el._liveTimeout) {
    clearTimeout(el._liveTimeout);
    el._liveTimeout = null;
  }

  function formatVal(n) {
    let str;
    if (decimals > 0) {
      str = n.toFixed(decimals);
    } else {
      str = Math.round(n).toString();
      if (useComma) {
        str = Math.round(n).toLocaleString();
      }
    }
    return prefix + str + suffix;
  }

  // Set initial display to 0
  el.textContent = formatVal(0);

  el._liveTimeout = setTimeout(() => {
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Cubic ease-out: brisk start, ultra smooth deceleration to final stop value
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      el.textContent = formatVal(progress >= 1 ? target : current);

      if (progress < 1) {
        el._liveAnimId = requestAnimationFrame(step);
      } else {
        el._liveAnimId = null;
      }
    }

    el._liveAnimId = requestAnimationFrame(step);
  }, delayMs);
}

/**
 * Triggers the 1-by-1 card arrangement and synchronized live counter run for Direct Cultural Impact Scorecard
 */
function triggerImpactScorecardAnimations(container) {
  const root = container || document.querySelector('.impact-scorecard-card');
  if (!root) return;

  // 1. Re-trigger card arrange animations one by one
  const cards = root.querySelectorAll('.anim-impact-card');
  cards.forEach(card => {
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';
  });

  // 2. Trigger live run numbers with staggered delays aligned with card arrangement
  const counters = root.querySelectorAll('.live-counter');
  counters.forEach(counter => {
    const customDelay = counter.getAttribute('data-delay');
    const delay = customDelay !== null ? parseInt(customDelay, 10) : 100;
    runLiveCounter(counter, delay, 1200);
  });
}

/**
 * Triggers live running numbers for Impact Statistics (about.html Section 7)
 */
function runImpactStatsLiveNumbers(container) {
  const root = container || document.querySelector('.impact-stats-section');
  if (!root) return;
  const counters = root.querySelectorAll('.live-counter');
  counters.forEach((counter, idx) => {
    runLiveCounter(counter, idx * 120, 1300);
  });
}

/**
 * Triggers live running numbers for Our Story Section
 */
function runOurStoryLiveNumbers(container) {
  const root = container || document.querySelector('.our-story-section');
  if (!root) return;
  const counters = root.querySelectorAll('.live-counter');
  counters.forEach((counter, idx) => {
    runLiveCounter(counter, idx * 120, 1300);
  });
}

/**
 * Triggers live running numbers for Stats Banners
 */
function runStatsBannerNumbers(container) {
  const root = container || document.querySelector('.stats-banner');
  if (!root) return;
  const counters = root.querySelectorAll('.live-counter');
  counters.forEach((counter, idx) => {
    runLiveCounter(counter, idx * 120, 1300);
  });
}

/**
 * Triggers live running numbers for Trending Global Grid
 */
function runTrendingLiveNumbers(container) {
  const root = container || document.querySelector('.trending-global-grid');
  if (!root) return;
  const counters = root.querySelectorAll('.live-counter');
  counters.forEach((counter, idx) => {
    runLiveCounter(counter, idx * 120, 1300);
  });
}

/**
 * Progress Bar Live Run & Counter for Curatorial Patron Tiers
 */
function runTierProgressBar(container) {
  const root = container || document.querySelector('.patron-tiers-card');
  if (!root) return;

  const bar = root.querySelector('.tier-progress-fill');
  const text = root.querySelector('.tier-progress-text');

  if (bar) {
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = '';
  }

  if (text) {
    if (text._tierAnimId) cancelAnimationFrame(text._tierAnimId);
    if (text._tierTimeout) clearTimeout(text._tierTimeout);

    text.textContent = '$0 / $2,000 (0%)';

    const targetVal = 1420;
    const maxVal = 2000;
    const targetPct = 71;
    const duration = 1500;
    const delay = 500;

    text._tierTimeout = setTimeout(() => {
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        const currentVal = Math.round(targetVal * ease);
        const currentPct = Math.round(targetPct * ease);

        text.textContent = `$${currentVal.toLocaleString()} / $${maxVal.toLocaleString()} (${currentPct}%)`;

        if (progress < 1) {
          text._tierAnimId = requestAnimationFrame(step);
        } else {
          text.textContent = '$1,420 / $2,000 (71%)';
          text._tierAnimId = null;
        }
      }

      text._tierAnimId = requestAnimationFrame(step);
    }, delay);
  }
}

/**
 * Triggers 1-by-1 Patron Badge arrangement and Progress Bar Live Run
 */
function triggerPatronTiersAnimations(container) {
  const root = container || document.querySelector('.patron-tiers-card');
  if (!root) return;

  // 1. Re-trigger patron cards arrange animations 1 by 1
  const cards = root.querySelectorAll('.anim-patron-card');
  cards.forEach(card => {
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';
  });

  // 2. Trigger progress bar live run & counter
  runTierProgressBar(root);
}

/**
 * Live Running Numbers for Section 2 (Our Story / Our Journey) on About page
 * Counts numbers smoothly: 2021 (Founded), 128 (Artisan Guilds), 100% (Authentic Provenance)
 */
function runOurStoryLiveNumbers(container) {
  const root = container || document.querySelector('.our-story-section');
  if (!root) return;

  const counters = root.querySelectorAll('.our-story-counter, .live-counter');
  counters.forEach(counter => {
    const customDelay = counter.getAttribute('data-delay');
    const delay = customDelay !== null ? parseInt(customDelay, 10) : 200;
    runLiveCounter(counter, delay, 1500);
  });
}

/**
 * Live Running Numbers for Trending in Global Collections Section
 * Counts collectors smoothly from 0 to 34 & 28, and price from $0 to $260 & $185
 */
function runTrendingLiveNumbers() {
  const container = document.getElementById('trending-global-grid');
  if (!container || container.dataset.numbersRan === 'true') return;
  container.dataset.numbersRan = 'true';

  // 1. Collector counts
  const collectorCounters = container.querySelectorAll('.live-counter-num');
  collectorCounters.forEach(el => {
    const target = parseInt(el.getAttribute('data-target') || '30', 10);
    const duration = 1400;
    const startTime = performance.now();

    function updateCount(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(target * ease);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(updateCount);
  });

  // 2. Price counters
  const priceCounters = container.querySelectorAll('.live-counter-price');
  priceCounters.forEach(el => {
    const target = parseInt(el.getAttribute('data-target') || '200', 10);
    const duration = 1400;
    const startTime = performance.now();

    function updatePrice(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(target * ease);
      el.textContent = `$${current}`;

      if (progress < 1) {
        requestAnimationFrame(updatePrice);
      } else {
        el.textContent = `$${target}`;
      }
    }
    requestAnimationFrame(updatePrice);
  });
}

/**
 * Live Running Numbers for Statistics Banner Section
 * Live runs: 4,200+, 18,500+, 42, $2.4M+
 */
function runStatsBannerNumbers() {
  const container = document.getElementById('stats-banner');
  if (!container || container.dataset.numbersRan === 'true') return;
  container.dataset.numbersRan = 'true';

  const statItems = container.querySelectorAll('.live-stat-num');
  statItems.forEach(el => {
    const targetStr = el.getAttribute('data-target') || '100';
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const isDecimal = targetStr.includes('.');
    const target = parseFloat(targetStr);
    const duration = 1800;
    const startTime = performance.now();

    function updateStat(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      if (isDecimal) {
        const current = (target * ease).toFixed(1);
        el.textContent = `${prefix}${current}${suffix}`;
      } else {
        const current = Math.floor(target * ease);
        el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
      }

      if (progress < 1) {
        requestAnimationFrame(updateStat);
      } else {
        if (isDecimal) {
          el.textContent = `${prefix}${target.toFixed(1)}${suffix}`;
        } else {
          el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        }
      }
    }
    requestAnimationFrame(updateStat);
  });
}

/**
 * Live Running Number for Section 5: Active Studio Inflow ($34,850)
 * User: "and make the number live run for this section"
 */
function runStudioInflowLiveNumber(section) {
  const el = section ? section.querySelector('.live-stat-inflow') : document.querySelector('.live-stat-inflow');
  if (!el || el.dataset.inflowRan === 'true') return;
  el.dataset.inflowRan = 'true';

  const target = parseInt(el.getAttribute('data-target') || '34850', 10);
  const prefix = el.getAttribute('data-prefix') || '$';
  const duration = 1800;
  const startTime = performance.now();

  function updateInflow(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(target * ease);
    el.textContent = `${prefix}${current.toLocaleString()}`;

    if (progress < 1) {
      requestAnimationFrame(updateInflow);
    } else {
      el.textContent = `${prefix}${target.toLocaleString()}`;
    }
  }
  requestAnimationFrame(updateInflow);
}

/**
 * Call to Action Word-by-Word & Dual-Button Animations (Maker Section across all pages)
 * Headings: words come from the right side one by one and arrange in position
 * Subtitle sentence: words come from the left side one by one and arrange in position
 * Buttons: Left button from left side, Right button from right side
 * Clicking Start Selling as a Creator or Explore Creator Tools navigates to 404.html
 */
function initCtaWordAnimations() {
  const ctaSections = document.querySelectorAll('.maker-cta-section');
  ctaSections.forEach(section => {
    // Process headings marked with .anim-cta-words-right if not already pre-split
    const rightHeadings = section.querySelectorAll('.anim-cta-words-right');
    rightHeadings.forEach(heading => {
      if (heading.querySelectorAll('.cta-word-right').length > 0) return;
      const text = heading.textContent.trim();
      if (!text) return;
      const words = text.split(/\s+/);
      heading.innerHTML = words.map((w, idx) => `<span class="cta-word-right" style="--w-idx: ${idx};">${w}</span>`).join(' ');
    });

    // Process sentences marked with .anim-cta-words-left if not already pre-split
    const leftSentences = section.querySelectorAll('.anim-cta-words-left');
    leftSentences.forEach(sentence => {
      if (sentence.querySelectorAll('.cta-word-left').length > 0) return;
      const text = sentence.textContent.trim();
      if (!text) return;
      const words = text.split(/\s+/);
      sentence.innerHTML = words.map((w, idx) => `<span class="cta-word-left" style="--w-idx: ${idx};">${w}</span>`).join(' ');
    });
  });

  // Explicit click handling: Start Selling as a Creator & Explore Creator Tools navigate to 404.html
  const ctaLinks = document.querySelectorAll('#btn-start-selling-creator, #btn-explore-creator-tools, .maker-cta-section a[href*="404"], .maker-cta-section .btn');
  ctaLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '404.html' || link.id === 'btn-start-selling-creator' || link.id === 'btn-explore-creator-tools') {
        e.preventDefault();
        window.location.href = '404.html';
      }
    });
  });

  // Footer: Terms of Artistry & Privacy & Provenance navigate to 404.html
  const footerPolicyLinks = document.querySelectorAll('.footer-bottom a');
  footerPolicyLinks.forEach(link => {
    const text = (link.textContent || '').trim().toLowerCase();
    if (text.includes('terms') || text.includes('privacy') || text.includes('artistry') || text.includes('provenance')) {
      link.setAttribute('href', '404.html');
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    }
  });

  // Ensure footer logo has no white background
  removeFooterLogoWhiteBg();
}

/**
 * Removes any white background pixels from the footer brand logo
 */
function removeFooterLogoWhiteBg() {
  const footerLogos = document.querySelectorAll('.footer-brand-logo');
  footerLogos.forEach(img => {
    function process() {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) return;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;
        let modified = false;
        for (let i = 0; i < d.length; i += 4) {
          // If pixel is near pure white (#E6-FF), make transparent
          if (d[i] > 225 && d[i + 1] > 225 && d[i + 2] > 225) {
            d[i + 3] = 0;
            modified = true;
          }
        }
        if (modified) {
          ctx.putImageData(imgData, 0, 0);
          img.src = canvas.toDataURL('image/png');
        }
      } catch (e) {
        // Fallback gracefully
      }
    }
    if (img.complete && img.naturalWidth > 0) {
      process();
    } else {
      img.addEventListener('load', process);
    }
  });
}

// Intersection Observer to smoothly trigger shuffle, slide, table rows, and scorecard arrange animations on scroll
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.anim-triplet-left, .anim-triplet-center, .anim-triplet-right, .anim-shuffle-left, .anim-shuffle-center, .anim-shuffle-right, .anim-from-left, .anim-from-right, .anim-queue-left, .anim-remittance-right, .anim-arrange-left, .anim-arrange-right, .anim-card-from-left, .anim-card-from-top, .anim-card-from-right, .anim-card-from-bottom, .anim-contact-left, .anim-contact-right, .anim-regional-left, .anim-regional-right, .anim-faq-left, .anim-faq-right, .anim-spotlight-right'
  );

  const tableCards = document.querySelectorAll('.table-card, .artisan-table');
  const impactScorecards = document.querySelectorAll('.impact-scorecard-card');
  const auditLogCards = document.querySelectorAll('.audit-log-card');
  const patronTiersCards = document.querySelectorAll('.patron-tiers-card');
  const patronListCards = document.querySelectorAll('.patron-list-card');
  const wordsHeadings = document.querySelectorAll('.anim-words-heading');
  const popularCatGrids = document.querySelectorAll('.popular-cat-grid');
  const handmadeGrids = document.querySelectorAll('.handmade-pair-grid');
  const trendingGrids = document.querySelectorAll('.trending-global-grid');
  const ancestralGrids = document.querySelectorAll('.ancestral-traditions-grid');
  const whyChooseGrids = document.querySelectorAll('.why-choose-grid');
  const statsBanners = document.querySelectorAll('.stats-banner');
  const makerCtaSections = document.querySelectorAll('.maker-cta-section');
  const ourStorySections = document.querySelectorAll('.our-story-section');
  const missionVisionSections = document.querySelectorAll('.mission-vision-section');
  const craftCultureSections = document.querySelectorAll('.craft-culture-section');
  const valuesSections = document.querySelectorAll('.values-section');
  const impactStatsSections = document.querySelectorAll('.impact-stats-section');
  const empowermentSections = document.querySelectorAll('.empowerment-section');
  const servicesPillarsSections = document.querySelectorAll('.services-pillars-section');
  const workflowSections = document.querySelectorAll('.workflow-section');
  const tierSections = document.querySelectorAll('.tier-section');
  const studioSections = document.querySelectorAll('.studio-suite-section');
  const logisticsSections = document.querySelectorAll('.logistics-section');
  const blogFeaturedSections = document.querySelectorAll('.blog-featured-section');
  const blogArticlesSections = document.querySelectorAll('.blog-articles-section');
  const artisanVoicesSections = document.querySelectorAll('.artisan-voices-section');
  const masteryGuidesSections = document.querySelectorAll('.mastery-guides-section');
  const regionalHoursSections = document.querySelectorAll('.regional-hours-section');
  const faqSections = document.querySelectorAll('.faq-accordion, .faq-section');
  const spotlightSections = document.querySelectorAll('.spotlight-section');
  const contactMainSections = document.querySelectorAll('.contact-main-section');

  function checkPopularGrids() {
    spotlightSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    popularCatGrids.forEach(grid => {
      if (!grid.classList.contains('is-in-view')) {
        const rect = grid.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          grid.classList.add('is-in-view');
        }
      }
    });
    handmadeGrids.forEach(grid => {
      if (!grid.classList.contains('is-in-view')) {
        const rect = grid.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          grid.classList.add('is-in-view');
        }
      }
    });
    trendingGrids.forEach(grid => {
      if (!grid.classList.contains('is-in-view')) {
        const rect = grid.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          grid.classList.add('is-in-view');
          setTimeout(runTrendingLiveNumbers, 400);
        }
      }
    });
    ancestralGrids.forEach(grid => {
      if (!grid.classList.contains('is-in-view')) {
        const rect = grid.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          grid.classList.add('is-in-view');
        }
      }
    });
    whyChooseGrids.forEach(grid => {
      if (!grid.classList.contains('is-in-view')) {
        const rect = grid.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          grid.classList.add('is-in-view');
        }
      }
    });
    statsBanners.forEach(banner => {
      if (!banner.classList.contains('is-in-view')) {
        const rect = banner.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          banner.classList.add('is-in-view');
          runStatsBannerNumbers();
        }
      }
    });
    makerCtaSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    ourStorySections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
          runOurStoryLiveNumbers(section);
        }
      }
    });
    missionVisionSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    craftCultureSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    valuesSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    impactStatsSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
          runImpactStatsLiveNumbers(section);
        }
      }
    });
    empowermentSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    servicesPillarsSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    workflowSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    tierSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    studioSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
          runStudioInflowLiveNumber(section);
        }
      }
    });
    logisticsSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    blogFeaturedSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    blogArticlesSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    artisanVoicesSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    masteryGuidesSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    regionalHoursSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    faqSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
    contactMainSections.forEach(section => {
      if (!section.classList.contains('is-in-view')) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          section.classList.add('is-in-view');
        }
      }
    });
  }
  checkPopularGrids();
  window.addEventListener('scroll', checkPopularGrids, { passive: true });

  if (!('IntersectionObserver' in window)) {
    popularCatGrids.forEach(g => g.classList.add('is-in-view'));
    handmadeGrids.forEach(g => g.classList.add('is-in-view'));
    trendingGrids.forEach(g => {
      g.classList.add('is-in-view');
      setTimeout(runTrendingLiveNumbers, 400);
    });
    ancestralGrids.forEach(g => g.classList.add('is-in-view'));
    whyChooseGrids.forEach(g => g.classList.add('is-in-view'));
    statsBanners.forEach(b => {
      b.classList.add('is-in-view');
      runStatsBannerNumbers();
    });
    makerCtaSections.forEach(s => s.classList.add('is-in-view'));
    ourStorySections.forEach(s => {
      s.classList.add('is-in-view');
      runOurStoryLiveNumbers(s);
    });
    missionVisionSections.forEach(s => s.classList.add('is-in-view'));
    craftCultureSections.forEach(s => s.classList.add('is-in-view'));
    valuesSections.forEach(s => s.classList.add('is-in-view'));
    impactStatsSections.forEach(s => {
      s.classList.add('is-in-view');
      runImpactStatsLiveNumbers(s);
    });
    empowermentSections.forEach(s => s.classList.add('is-in-view'));
    servicesPillarsSections.forEach(s => s.classList.add('is-in-view'));
    workflowSections.forEach(s => s.classList.add('is-in-view'));
    tierSections.forEach(s => s.classList.add('is-in-view'));
    studioSections.forEach(s => {
      s.classList.add('is-in-view');
      runStudioInflowLiveNumber(s);
    });
    logisticsSections.forEach(s => s.classList.add('is-in-view'));
    blogFeaturedSections.forEach(s => s.classList.add('is-in-view'));
    blogArticlesSections.forEach(s => s.classList.add('is-in-view'));
    artisanVoicesSections.forEach(s => s.classList.add('is-in-view'));
    masteryGuidesSections.forEach(s => s.classList.add('is-in-view'));
    regionalHoursSections.forEach(s => s.classList.add('is-in-view'));
    faqSections.forEach(s => s.classList.add('is-in-view'));
    spotlightSections.forEach(s => s.classList.add('is-in-view'));
    contactMainSections.forEach(s => s.classList.add('is-in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.classList.contains('popular-cat-grid') || el.classList.contains('handmade-pair-grid') || el.classList.contains('trending-global-grid') || el.classList.contains('ancestral-traditions-grid') || el.classList.contains('why-choose-grid') || el.classList.contains('stats-banner') || el.classList.contains('maker-cta-section') || el.classList.contains('our-story-section') || el.classList.contains('mission-vision-section') || el.classList.contains('craft-culture-section') || el.classList.contains('values-section') || el.classList.contains('impact-stats-section') || el.classList.contains('empowerment-section') || el.classList.contains('services-pillars-section') || el.classList.contains('workflow-section') || el.classList.contains('tier-section') || el.classList.contains('studio-suite-section') || el.classList.contains('logistics-section') || el.classList.contains('blog-featured-section') || el.classList.contains('blog-articles-section') || el.classList.contains('artisan-voices-section') || el.classList.contains('mastery-guides-section') || el.classList.contains('regional-hours-section') || el.classList.contains('faq-accordion') || el.classList.contains('faq-section') || el.classList.contains('spotlight-section') || el.classList.contains('contact-main-section')) {
          el.classList.add('is-in-view');
          if (el.classList.contains('studio-suite-section')) {
            runStudioInflowLiveNumber(el);
          }
          if (el.classList.contains('trending-global-grid')) {
            setTimeout(runTrendingLiveNumbers, 400);
          }
          if (el.classList.contains('stats-banner')) {
            runStatsBannerNumbers();
          }
          if (el.classList.contains('our-story-section')) {
            runOurStoryLiveNumbers(el);
          }
          if (el.classList.contains('impact-stats-section')) {
            runImpactStatsLiveNumbers(el);
          }
        } else if (el.classList.contains('patron-tiers-card')) {
          triggerPatronTiersAnimations(el);
        } else if (el.classList.contains('impact-scorecard-card')) {
          triggerImpactScorecardAnimations(el);
        } else if (el.classList.contains('audit-log-card')) {
          const items = el.querySelectorAll('.anim-log-arrange, .audit-log-item');
          items.forEach(item => {
            item.style.animation = 'none';
            void item.offsetWidth;
            item.style.animation = '';
          });
        } else if (el.classList.contains('patron-list-card')) {
          const rows = el.querySelectorAll('.anim-patron-row');
          rows.forEach(r => {
            r.style.animation = 'none';
            void r.offsetWidth;
            r.style.animation = '';
          });
        } else if (el.classList.contains('anim-words-heading')) {
          const words = el.querySelectorAll('.word-arrange-item');
          words.forEach(w => {
            w.style.animation = 'none';
            void w.offsetWidth;
            w.style.animation = '';
          });
        } else if (el.classList.contains('table-card') || el.classList.contains('artisan-table')) {
          const rows = el.querySelectorAll('.table-row-slide-right, tbody tr');
          rows.forEach(r => {
            r.style.animation = 'none';
            void r.offsetWidth;
            r.style.animation = '';
          });
        } else {
          el.classList.add('is-animated');
          el.style.animation = 'none';
          void el.offsetWidth;
          el.style.animation = '';
        }
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -20px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
  popularCatGrids.forEach(el => observer.observe(el));
  handmadeGrids.forEach(el => observer.observe(el));
  trendingGrids.forEach(el => observer.observe(el));
  ancestralGrids.forEach(el => observer.observe(el));
  whyChooseGrids.forEach(el => observer.observe(el));
  statsBanners.forEach(el => observer.observe(el));
  makerCtaSections.forEach(el => observer.observe(el));
  ourStorySections.forEach(el => observer.observe(el));
  missionVisionSections.forEach(el => observer.observe(el));
  craftCultureSections.forEach(el => observer.observe(el));
  valuesSections.forEach(el => observer.observe(el));
  impactStatsSections.forEach(el => observer.observe(el));
  empowermentSections.forEach(el => observer.observe(el));
  servicesPillarsSections.forEach(el => observer.observe(el));
  workflowSections.forEach(el => observer.observe(el));
  tierSections.forEach(el => observer.observe(el));
  studioSections.forEach(el => observer.observe(el));
  logisticsSections.forEach(el => observer.observe(el));
  blogFeaturedSections.forEach(el => observer.observe(el));
  blogArticlesSections.forEach(el => observer.observe(el));
  artisanVoicesSections.forEach(el => observer.observe(el));
  masteryGuidesSections.forEach(el => observer.observe(el));
  regionalHoursSections.forEach(el => observer.observe(el));
  faqSections.forEach(el => observer.observe(el));
  spotlightSections.forEach(el => observer.observe(el));
  contactMainSections.forEach(el => observer.observe(el));
  tableCards.forEach(el => observer.observe(el));
  impactScorecards.forEach(el => observer.observe(el));
  auditLogCards.forEach(el => observer.observe(el));
  patronTiersCards.forEach(el => observer.observe(el));
  patronListCards.forEach(el => observer.observe(el));
  wordsHeadings.forEach(el => observer.observe(el));
}

// Trigger active panel animations as soon as preloader curtain opens
window.addEventListener('artisanCurtainOpened', () => {
  initDashboardHeadingWordAnimations(document);
  const activePanel = document.querySelector('.dashboard-view-panel.active');
  if (activePanel) {
    setTimeout(() => {
      triggerPanelAnimations(activePanel);
      initScrollAnimations();
    }, 150);
  }
  const ourStory = document.querySelector('.our-story-section');
  if (ourStory) {
    const rect = ourStory.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      ourStory.classList.add('is-in-view');
      runOurStoryLiveNumbers(ourStory);
    }
  }
  const mvSection = document.querySelector('.mission-vision-section');
  if (mvSection) {
    const rect = mvSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      mvSection.classList.add('is-in-view');
    }
  }
  const cultureSection = document.querySelector('.craft-culture-section');
  if (cultureSection) {
    const rect = cultureSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      cultureSection.classList.add('is-in-view');
    }
  }
  const valSection = document.querySelector('.values-section');
  if (valSection) {
    const rect = valSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      valSection.classList.add('is-in-view');
    }
  }
  const statSection = document.querySelector('.impact-stats-section');
  if (statSection) {
    const rect = statSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      statSection.classList.add('is-in-view');
      runImpactStatsLiveNumbers(statSection);
    }
  }
  const empSection = document.querySelector('.empowerment-section');
  if (empSection) {
    const rect = empSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      empSection.classList.add('is-in-view');
    }
  }
  const servSection = document.querySelector('.services-pillars-section');
  if (servSection) {
    const rect = servSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      servSection.classList.add('is-in-view');
    }
  }
  const wfSection = document.querySelector('.workflow-section');
  if (wfSection) {
    const rect = wfSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      wfSection.classList.add('is-in-view');
    }
  }
  const tierSec = document.querySelector('.tier-section');
  if (tierSec) {
    const rect = tierSec.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      tierSec.classList.add('is-in-view');
    }
  }
  const studioSec = document.querySelector('.studio-suite-section');
  if (studioSec) {
    const rect = studioSec.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      studioSec.classList.add('is-in-view');
      runStudioInflowLiveNumber(studioSec);
    }
  }
  const logSec = document.querySelector('.logistics-section');
  if (logSec) {
    const rect = logSec.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      logSec.classList.add('is-in-view');
    }
  }
  const blogFeatSec = document.querySelector('.blog-featured-section');
  if (blogFeatSec) {
    const rect = blogFeatSec.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      blogFeatSec.classList.add('is-in-view');
    }
  }
  const blogArtsSec = document.querySelector('.blog-articles-section');
  if (blogArtsSec) {
    const rect = blogArtsSec.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      blogArtsSec.classList.add('is-in-view');
    }
  }
  const voicesSec = document.querySelector('.artisan-voices-section');
  if (voicesSec) {
    const rect = voicesSec.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      voicesSec.classList.add('is-in-view');
    }
  }
  const masterySec = document.querySelector('.mastery-guides-section');
  if (masterySec) {
    const rect = masterySec.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      masterySec.classList.add('is-in-view');
    }
  }
});

/**
 * Enables Click to Enlighten on Section 6 cards (For Artisans / For Collectors)
 * (User: "at the time of clicking that it should enlighten that... the things, 'For Artisans', 'For Collectors'")
 */
function setupEmpowermentClickEnlighten() {
  const cards = document.querySelectorAll('.card-empowerment');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const isCurrentlyActive = card.classList.contains('is-enlightened');
      cards.forEach(c => {
        c.classList.remove('is-enlightened');
        c.setAttribute('aria-pressed', 'false');
      });
      if (!isCurrentlyActive) {
        card.classList.add('is-enlightened');
        card.setAttribute('aria-pressed', 'true');
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupEmpowermentClickEnlighten);
} else {
  setupEmpowermentClickEnlighten();
}

/**
 * Enables Click to Enlighten on Section 3 Four-Step Workflow cards
 * (User: "at the time of clicking that it should enlighten that both headings and then that, so kindly make that animation and that artwork for this section")
 */
function setupWorkflowClickEnlighten() {
  const cards = document.querySelectorAll('.workflow-card');
  const section = document.querySelector('.workflow-section');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const isCurrentlyActive = card.classList.contains('is-enlightened');
      
      // Toggle active enlightened state
      if (isCurrentlyActive) {
        card.classList.remove('is-enlightened');
        card.setAttribute('aria-pressed', 'false');
      } else {
        card.classList.add('is-enlightened');
        card.setAttribute('aria-pressed', 'true');

        // Animate both headings (Step Number & Step Title)
        const stepNum = card.querySelector('.workflow-step-num');
        const stepTitle = card.querySelector('.workflow-step-title');
        if (stepNum) {
          stepNum.style.animation = 'none';
          void stepNum.offsetWidth;
          stepNum.style.animation = 'headingEnlightenPulse 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
        }
        if (stepTitle) {
          stepTitle.style.animation = 'none';
          void stepTitle.offsetWidth;
          stepTitle.style.animation = 'headingEnlightenPulse 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
        }
      }

      // Check if any card is enlightened to set section state
      const hasAny = Array.from(cards).some(c => c.classList.contains('is-enlightened'));
      if (section) {
        if (hasAny) {
          section.classList.add('has-enlightened');
        } else {
          section.classList.remove('has-enlightened');
        }
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupWorkflowClickEnlighten);
} else {
  setupWorkflowClickEnlighten();
}

/**
 * Enables Click to Run Boundary Line on Section 6 White-Glove International Logistics cards
 * (User: "at the time of hovering that, it should live run the line, boundary line for the box.
 * Kindly... at clicking that, it should run the boundary line for the outline of that box.
 * Kindly make both, for hover and click for that.")
 */
function setupLogisticsBorderClick() {
  const cards = document.querySelectorAll('.logistics-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      // Toggle active continuous running boundary state
      const isCurrentlyActive = card.classList.contains('is-line-active');
      
      if (isCurrentlyActive) {
        card.classList.remove('is-line-active');
        card.setAttribute('aria-pressed', 'false');
      } else {
        card.classList.add('is-line-active');
        card.setAttribute('aria-pressed', 'true');
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLogisticsBorderClick);
} else {
  setupLogisticsBorderClick();
}

/**
 * Enables Click to Run Boundary Line on Section 2 Featured Story card in blog.html
 */
function setupBlogFeaturedClick() {
  const cards = document.querySelectorAll('.blog-featured');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If click originated from the Read Full Story button or link, let link navigate
      if (e.target.closest('a') || e.target.closest('.blog-lead-btn')) return;

      const isCurrentlyActive = card.classList.contains('is-line-active');
      if (isCurrentlyActive) {
        card.classList.remove('is-line-active');
        card.setAttribute('aria-pressed', 'false');
      } else {
        card.classList.add('is-line-active');
        card.setAttribute('aria-pressed', 'true');
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a') || e.target.closest('.blog-lead-btn')) return;
        e.preventDefault();
        card.click();
      }
    });
  });
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupBlogFeaturedClick);
} else {
  setupBlogFeaturedClick();
}

function setupDiscoverCategoryFilters() {
  const chips = document.querySelectorAll('.category-chip');
  const cards = document.querySelectorAll('.discover-work-card');

  if (!chips.length || !cards.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || filter === cat) {
          card.classList.remove('is-hidden');
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = 'cascadeOneByOne 0.5s cubic-bezier(0.16, 1, 0.3, 1) both';
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

// ==========================================================================
// 11. BUYER CHARTS (SVG)
// ==========================================================================
function renderBuyerCharts() {
  const pieContainer = document.getElementById('buyer-pie-chart');
  if (pieContainer) {
    pieContainer.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-around; width:100%; height:100%; flex-wrap:wrap; gap:16px;">
        <svg viewBox="0 0 160 160" width="160" height="160" style="transform: rotate(-90deg);">
          <circle cx="80" cy="80" r="70" fill="transparent" stroke="var(--c-warm-brown)" stroke-width="20" stroke-dasharray="154 440" stroke-dashoffset="0" />
          <circle cx="80" cy="80" r="70" fill="transparent" stroke="var(--c-terracotta)" stroke-width="20" stroke-dasharray="110 440" stroke-dashoffset="-154" />
          <circle cx="80" cy="80" r="70" fill="transparent" stroke="var(--c-ochre)" stroke-width="20" stroke-dasharray="88 440" stroke-dashoffset="-264" />
          <circle cx="80" cy="80" r="70" fill="transparent" stroke="var(--c-beige-dark)" stroke-width="20" stroke-dasharray="88 440" stroke-dashoffset="-352" />
        </svg>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:0.84rem;">
          <div style="display:flex; align-items:center; gap:8px;"><span style="width:12px; height:12px; border-radius:3px; background:var(--c-warm-brown);"></span> <span>Ceramics & Pottery (35%)</span></div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="width:12px; height:12px; border-radius:3px; background:var(--c-terracotta);"></span> <span>Textiles & Mudcloth (25%)</span></div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="width:12px; height:12px; border-radius:3px; background:var(--c-ochre);"></span> <span>Wood Sculptures (20%)</span></div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="width:12px; height:12px; border-radius:3px; background:var(--c-beige-dark);"></span> <span>Beadwork & Digital (20%)</span></div>
        </div>
      </div>
    `;
  }

  const lineContainer = document.getElementById('buyer-line-chart');
  if (lineContainer) {
    lineContainer.innerHTML = `
      <div style="display:flex; flex-direction:column; width:100%; height:100%; justify-content:space-between;">
        <div style="flex:1; width:100%; position:relative; min-height:165px;">
          <svg viewBox="0 0 460 200" class="svg-chart" preserveAspectRatio="none" style="width:100%; height:100%;">
            <defs>
              <linearGradient id="buyerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--c-warm-brown)" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="var(--c-warm-brown)" stop-opacity="0.0"/>
              </linearGradient>
            </defs>
            <line x1="20" y1="30" x2="440" y2="30" stroke="var(--c-border-subtle)" stroke-dasharray="4 4" />
            <line x1="20" y1="80" x2="440" y2="80" stroke="var(--c-border-subtle)" stroke-dasharray="4 4" />
            <line x1="20" y1="130" x2="440" y2="130" stroke="var(--c-border-subtle)" stroke-dasharray="4 4" />
            <line x1="20" y1="180" x2="440" y2="180" stroke="var(--c-border-subtle)" />
            <path d="M 30,170 C 90,140 140,150 190,95 C 240,40 300,85 360,45 C 390,25 420,40 440,30 L 440,180 L 30,180 Z" fill="url(#buyerGrad)" />
            <path d="M 30,170 C 90,140 140,150 190,95 C 240,40 300,85 360,45 C 390,25 420,40 440,30" fill="none" stroke="var(--c-warm-brown)" stroke-width="3.5" stroke-linecap="round" />
            <circle cx="30" cy="170" r="4.5" fill="var(--c-white)" stroke="var(--c-warm-brown)" stroke-width="3" />
            <circle cx="110" cy="145" r="4.5" fill="var(--c-white)" stroke="var(--c-warm-brown)" stroke-width="3" />
            <circle cx="190" cy="95" r="4.5" fill="var(--c-white)" stroke="var(--c-warm-brown)" stroke-width="3" />
            <circle cx="270" cy="65" r="4.5" fill="var(--c-white)" stroke="var(--c-warm-brown)" stroke-width="3" />
            <circle cx="360" cy="45" r="4.5" fill="var(--c-white)" stroke="var(--c-warm-brown)" stroke-width="3" />
            <circle cx="440" cy="30" r="4.5" fill="var(--c-white)" stroke="var(--c-warm-brown)" stroke-width="3" />
          </svg>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:6px; padding:0 12px; font-size:0.75rem; color:var(--c-text-muted); font-weight:600;">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        </div>
      </div>
    `;
  }

  const barContainer = document.getElementById('buyer-bar-chart');
  if (barContainer) {
    barContainer.innerHTML = `
      <div style="display:flex; align-items:flex-end; justify-content:space-between; height:180px; width:100%; padding: 0 10px; border-bottom: 1px solid var(--c-border-subtle); gap:12px;">
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--c-warm-brown);">$240</span>
          <div style="width:100%; max-width:40px; height:70px; background:var(--c-beige-dark); border-radius:6px 6px 0 0;"></div>
          <span style="font-size:0.72rem; color:var(--c-text-muted);">Feb</span>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--c-warm-brown);">$390</span>
          <div style="width:100%; max-width:40px; height:110px; background:var(--c-terracotta); border-radius:6px 6px 0 0;"></div>
          <span style="font-size:0.72rem; color:var(--c-text-muted);">Mar</span>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--c-warm-brown);">$520</span>
          <div style="width:100%; max-width:40px; height:140px; background:var(--c-warm-brown); border-radius:6px 6px 0 0;"></div>
          <span style="font-size:0.72rem; color:var(--c-text-muted);">Apr</span>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--c-warm-brown);">$310</span>
          <div style="width:100%; max-width:40px; height:90px; background:var(--c-ochre); border-radius:6px 6px 0 0;"></div>
          <span style="font-size:0.72rem; color:var(--c-text-muted);">May</span>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--c-warm-brown);">$680</span>
          <div style="width:100%; max-width:40px; height:170px; background:var(--c-dark-brown); border-radius:6px 6px 0 0;"></div>
          <span style="font-size:0.72rem; color:var(--c-text-muted);">Jun</span>
        </div>
      </div>
    `;
  }

  const activityContainer = document.getElementById('buyer-activity-chart');
  if (activityContainer) {
    activityContainer.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap: 10px; width:100%; height:100%; align-content:center;">
        <div style="background:var(--c-cream-soft); padding:12px 6px; border-radius:8px; text-align:center;">
          <div style="font-size:0.75rem; color:var(--c-text-light);">Mon</div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--c-warm-brown); margin-top:4px;">2h</div>
        </div>
        <div style="background:var(--c-beige-light); padding:12px 6px; border-radius:8px; text-align:center;">
          <div style="font-size:0.75rem; color:var(--c-text-light);">Tue</div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--c-warm-brown); margin-top:4px;">4h</div>
        </div>
        <div style="background:var(--c-cream-soft); padding:12px 6px; border-radius:8px; text-align:center;">
          <div style="font-size:0.75rem; color:var(--c-text-light);">Wed</div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--c-warm-brown); margin-top:4px;">1h</div>
        </div>
        <div style="background:rgba(184, 103, 55, 0.2); padding:12px 6px; border-radius:8px; text-align:center;">
          <div style="font-size:0.75rem; color:var(--c-text-light);">Thu</div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--c-terracotta); margin-top:4px;">5h</div>
        </div>
        <div style="background:rgba(90, 53, 33, 0.25); padding:12px 6px; border-radius:8px; text-align:center;">
          <div style="font-size:0.75rem; color:var(--c-text-light);">Fri</div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--c-deep-brown); margin-top:4px;">6h</div>
        </div>
        <div style="background:rgba(90, 53, 33, 0.4); padding:12px 6px; border-radius:8px; text-align:center; color:white;">
          <div style="font-size:0.75rem; opacity:0.8;">Sat</div>
          <div style="font-size:1.1rem; font-weight:700; margin-top:4px;">8h</div>
        </div>
        <div style="background:var(--c-cream-soft); padding:12px 6px; border-radius:8px; text-align:center;">
          <div style="font-size:0.75rem; color:var(--c-text-light);">Sun</div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--c-warm-brown); margin-top:4px;">3h</div>
        </div>
      </div>
    `;
  }
}

// ==========================================================================
// 12. SELLER CHARTS (SVG) & ADD PRODUCT
// ==========================================================================
function renderSellerCharts() {
  const revContainer = document.getElementById('seller-revenue-chart');
  if (revContainer) {
    revContainer.innerHTML = `
      <svg viewBox="0 0 500 220" class="svg-chart" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sellerRevGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--c-terracotta)" stop-opacity="0.38"/>
            <stop offset="100%" stop-color="var(--c-terracotta)" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="20" y1="40" x2="480" y2="40" stroke="var(--c-border-subtle)" stroke-dasharray="4 4" />
        <line x1="20" y1="90" x2="480" y2="90" stroke="var(--c-border-subtle)" stroke-dasharray="4 4" />
        <line x1="20" y1="140" x2="480" y2="140" stroke="var(--c-border-subtle)" stroke-dasharray="4 4" />
        <line x1="20" y1="190" x2="480" y2="190" stroke="var(--c-border-subtle)" />
        <path d="M 30,175 C 80,160 130,130 180,110 C 230,90 280,115 330,65 C 380,25 430,50 470,35 L 470,190 L 30,190 Z" fill="url(#sellerRevGrad)" />
        <path d="M 30,175 C 80,160 130,130 180,110 C 230,90 280,115 330,65 C 380,25 430,50 470,35" fill="none" stroke="var(--c-terracotta)" stroke-width="3.5" stroke-linecap="round" />
        <circle cx="30" cy="175" r="4.5" fill="var(--c-white)" stroke="var(--c-terracotta)" stroke-width="3" />
        <circle cx="120" cy="135" r="4.5" fill="var(--c-white)" stroke="var(--c-terracotta)" stroke-width="3" />
        <circle cx="210" cy="98" r="4.5" fill="var(--c-white)" stroke="var(--c-terracotta)" stroke-width="3" />
        <circle cx="300" cy="85" r="4.5" fill="var(--c-white)" stroke="var(--c-terracotta)" stroke-width="3" />
        <circle cx="390" cy="38" r="4.5" fill="var(--c-white)" stroke="var(--c-terracotta)" stroke-width="3" />
        <circle cx="470" cy="35" r="4.5" fill="var(--c-white)" stroke="var(--c-terracotta)" stroke-width="3" />
      </svg>
      <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:0.75rem; color:var(--c-text-light);">
        <span>Jan ($2.1k)</span><span>Feb ($3.4k)</span><span>Mar ($5.8k)</span><span>Apr ($7.2k)</span><span>May ($9.6k)</span><span>Jun ($12.4k)</span>
      </div>
    `;
  }

  const salesBarContainer = document.getElementById('seller-sales-chart');
  if (salesBarContainer) {
    salesBarContainer.innerHTML = `
      <div style="display:flex; align-items:flex-end; justify-content:space-between; height:180px; width:100%; padding: 0 10px; border-bottom: 1px solid var(--c-border-subtle); gap:14px;">
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--c-warm-brown);">142</span>
          <div style="width:100%; max-width:44px; height:130px; background:var(--c-warm-brown); border-radius:6px 6px 0 0;"></div>
          <span style="font-size:0.72rem; color:var(--c-text-muted);">Pottery</span>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--c-warm-brown);">118</span>
          <div style="width:100%; max-width:44px; height:105px; background:var(--c-terracotta); border-radius:6px 6px 0 0;"></div>
          <span style="font-size:0.72rem; color:var(--c-text-muted);">Textiles</span>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--c-warm-brown);">84</span>
          <div style="width:100%; max-width:44px; height:75px; background:var(--c-ochre); border-radius:6px 6px 0 0;"></div>
          <span style="font-size:0.72rem; color:var(--c-text-muted);">Sculptures</span>
        </div>
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size:0.75rem; font-weight:700; color:var(--c-warm-brown);">68</span>
          <div style="width:100%; max-width:44px; height:60px; background:var(--c-beige-dark); border-radius:6px 6px 0 0;"></div>
          <span style="font-size:0.72rem; color:var(--c-text-muted);">Jewelry</span>
        </div>
      </div>
    `;
  }

  const perfContainer = document.getElementById('seller-perf-chart');
  if (perfContainer) {
    perfContainer.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px; width:100%; justify-content:center;">
        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:4px;">
            <span>Yoruba Terracotta Vessel</span>
            <span style="color:var(--c-warm-brown);">94% Conversion</span>
          </div>
          <div style="height:8px; background:var(--c-cream-soft); border-radius:4px; overflow:hidden;">
            <div style="width:94%; height:100%; background:var(--c-warm-brown);"></div>
          </div>
        </div>
        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:4px;">
            <span>Hand-Carved Jacaranda Bust</span>
            <span style="color:var(--c-terracotta);">82% Conversion</span>
          </div>
          <div style="height:8px; background:var(--c-cream-soft); border-radius:4px; overflow:hidden;">
            <div style="width:82%; height:100%; background:var(--c-terracotta);"></div>
          </div>
        </div>
        <div>
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:4px;">
            <span>Ashanti Royal Kente Tapestry</span>
            <span style="color:var(--c-ochre);">76% Conversion</span>
          </div>
          <div style="height:8px; background:var(--c-cream-soft); border-radius:4px; overflow:hidden;">
            <div style="width:76%; height:100%; background:var(--c-ochre);"></div>
          </div>
        </div>
      </div>
    `;
  }

  const sellerPieContainer = document.getElementById('seller-pie-chart');
  if (sellerPieContainer) {
    sellerPieContainer.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-around; width:100%; height:100%; flex-wrap:wrap; gap:16px;">
        <svg viewBox="0 0 160 160" width="160" height="160" style="transform: rotate(-90deg);">
          <circle cx="80" cy="80" r="70" fill="transparent" stroke="var(--c-dark-brown)" stroke-width="20" stroke-dasharray="242 440" stroke-dashoffset="0" />
          <circle cx="80" cy="80" r="70" fill="transparent" stroke="var(--c-terracotta)" stroke-width="20" stroke-dasharray="132 440" stroke-dashoffset="-242" />
          <circle cx="80" cy="80" r="70" fill="transparent" stroke="var(--c-ochre)" stroke-width="20" stroke-dasharray="66 440" stroke-dashoffset="-374" />
        </svg>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:0.84rem;">
          <div style="display:flex; align-items:center; gap:8px;"><span style="width:12px; height:12px; border-radius:3px; background:var(--c-dark-brown);"></span> <span>Physical Handcrafts (55%)</span></div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="width:12px; height:12px; border-radius:3px; background:var(--c-terracotta);"></span> <span>Custom Commissions (30%)</span></div>
          <div style="display:flex; align-items:center; gap:8px;"><span style="width:12px; height:12px; border-radius:3px; background:var(--c-ochre);"></span> <span>Digital Art Assets (15%)</span></div>
        </div>
      </div>
    `;
  }
}

// Global Artisan Modal Controls
window.openArtisanModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof window.initCustomSelects === 'function') {
      window.initCustomSelects();
    }
    setTimeout(() => {
      modal.querySelector('input, .custom-select-trigger')?.focus();
    }, 80);
  }
};

window.closeArtisanModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

function setupAddProductModal() {
  const openBtn = document.getElementById('open-add-product-btn');
  const modal = document.getElementById('add-product-modal');
  const form = document.getElementById('add-product-form');

  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      if (openBtn.tagName === 'A' && openBtn.getAttribute('href') === '404.html') {
        window.location.href = '404.html';
        return;
      }
      e.preventDefault();
      window.openArtisanModal('add-product-modal');
    });
  }

  // Close when clicking directly on the backdrop outside the dialog
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.closeArtisanModal('add-product-modal');
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        window.closeArtisanModal('add-product-modal');
      }
    });
  }

  if (form && modal) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('prod-title')?.value || 'New Craft Item';
      const category = document.getElementById('prod-category')?.value || 'Ceramics';
      const price = document.getElementById('prod-price')?.value || '185';
      const stock = document.getElementById('prod-stock')?.value || '5';

      const tbody = document.getElementById('seller-inventory-tbody');
      if (tbody) {
        const tr = document.createElement('tr');
        tr.classList.add('table-row-slide-right');
        tr.innerHTML = `
          <td><strong>${title}</strong></td>
          <td><span class="badge badge-craft">${category}</span></td>
          <td style="font-weight:700; color:var(--c-warm-brown);">$${price}</td>
          <td>${stock} in stock</td>
          <td><span class="badge badge-success">Active</span></td>
          <td><button class="btn btn-outline btn-sm" onclick="this.closest('tr').remove(); showArtisanToast('Product removed', 'delete');">Delete</button></td>
        `;
        tbody.prepend(tr);
      }

      showArtisanToast(`"${title}" published to marketplace!`, 'check_circle');
      form.reset();
      window.closeArtisanModal('add-product-modal');
    });
  }
}

// ==========================================================================
// PUBLISH NEW HANDCRAFTED CREATION FORM (INLINE VALIDATION & 404 NAVIGATION)
// ==========================================================================
function setupPublishCraftForm() {
  const form = document.getElementById('publish-craft-form');
  if (!form) return;

  const titleInput = document.getElementById('pub-craft-title');
  const catInput = document.getElementById('pub-craft-category');
  const priceInput = document.getElementById('pub-craft-price');
  const provInput = document.getElementById('pub-craft-provenance');

  const fields = [
    { el: titleInput, validate: (val) => val.trim().length > 0 },
    { el: catInput, validate: (val) => val.trim().length > 0 },
    { el: priceInput, validate: (val) => val.trim().length > 0 && !isNaN(val) && Number(val) > 0 },
    { el: provInput, validate: (val) => val.trim().length > 0 }
  ];

  // Real-time clearance of red underline and error message upon typing/changing
  fields.forEach(field => {
    if (!field.el) return;
    const clearError = () => {
      field.el.classList.remove('is-invalid');
      const fg = field.el.closest('.form-group');
      if (fg) fg.classList.remove('has-error');
    };
    field.el.addEventListener('input', clearError);
    field.el.addEventListener('change', clearError);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    fields.forEach(field => {
      if (!field.el) return;
      const isValid = field.validate(field.el.value);
      const fg = field.el.closest('.form-group');

      if (!isValid) {
        hasError = true;
        field.el.classList.add('is-invalid');
        if (fg) fg.classList.add('has-error');
      } else {
        field.el.classList.remove('is-invalid');
        if (fg) fg.classList.remove('has-error');
      }
    });

    // Explicit constraint: NO pop-up or notification/alert
    if (hasError) {
      return;
    }

    // Once all details are filled and valid, navigate to 404 page
    window.location.href = '404.html';
  });
}

