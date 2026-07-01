document.addEventListener('DOMContentLoaded', () => {

  // --- Initialize Firebase ---
  const firebaseConfig = {
    apiKey: "AIzaSyAy95s-MNAVqt3bH51zYwjRfqhFye9-bXQ",
    authDomain: "abi-photography-123.firebaseapp.com",
    projectId: "abi-photography-123",
    storageBucket: "abi-photography-123.firebasestorage.app",
    messagingSenderId: "60521136690",
    appId: "1:60521136690:web:3c3b9f457882162dfdf22b"
  };

  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
  }

  // --- Theme Settings Initialization ---
  const themeCheckbox = document.getElementById('theme-checkbox');
  const currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeCheckbox) themeCheckbox.checked = true;
  }

  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // --- 1. Sticky Navigation & Scroll Reveal ---
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = () => {
    // Add scrolled class to header
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Navigation Link on Scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 120) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);

  // --- 2. Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // --- 3. Portfolio Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to current button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Hide and show with smooth scale transition
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  // --- 4. Testimonials Slider ---
  const testimonialsWrapper = document.getElementById('testimonials-wrapper');
  const sliderDots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  const totalSlides = sliderDots.length;
  let autoSlideTimer;

  const showSlide = (index) => {
    currentSlide = index;
    // Translate the slider container
    testimonialsWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active dot
    sliderDots.forEach(dot => dot.classList.remove('active'));
    sliderDots[currentSlide].classList.add('active');
  };

  const nextSlide = () => {
    let next = (currentSlide + 1) % totalSlides;
    showSlide(next);
  };

  const startAutoSlide = () => {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, 5000);
  };

  sliderDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetSlide = parseInt(e.target.getAttribute('data-slide'));
      showSlide(targetSlide);
      startAutoSlide(); // Reset timer on interaction
    });
  });

  // Start autoplay
  startAutoSlide();

  // --- 5. Booking Modal Controls ---
  const bookingModal = document.getElementById('booking-modal');
  const openModalBtns = document.querySelectorAll('.open-booking-btn');
  const closeModalBtn = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  
  const formWrapper = document.getElementById('booking-form-wrapper');
  const successPanel = document.getElementById('booking-success');
  const successCloseBtn = document.getElementById('success-close-btn');
  const bookingForm = document.getElementById('booking-form');
  const bookingDateInput = document.getElementById('booking-date');

  // Set min date of picker to today
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
  }

  const openModal = () => {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop page scrolling
    // Reset view
    formWrapper.style.display = 'block';
    successPanel.classList.remove('active');
  };

  const closeModal = () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = ''; // Enable scrolling
    bookingForm.reset();
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeModalBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  successCloseBtn.addEventListener('click', closeModal);

  // --- 6. Booking Form Submission & Validation ---
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const service = document.getElementById('booking-service').value;
    const date = document.getElementById('booking-date').value;
    const notes = document.getElementById('booking-notes').value.trim();

    if (!name || !phone || !service || !date) {
      alert('Please fill out all required fields.');
      return;
    }

    if (phone.length < 10) {
      alert('Please enter a valid phone number.');
      return;
    }

    // Save to Firestore (with localStorage fallback)
    const newBooking = {
      name: name,
      phone: phone,
      service: service,
      date: date,
      notes: notes,
      status: 'Pending'
    };

    const saveLocally = () => {
      const localBooking = {
        ...newBooking,
        id: 'bk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString()
      };
      let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
      bookings.push(localBooking);
      localStorage.setItem('bookings', JSON.stringify(bookings));
    };

    if (window.db) {
      window.db.collection('bookings').add({
        ...newBooking,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        console.log("Booking successfully added to Firestore");
      })
      .catch(error => {
        console.error("Firestore write failed, saving locally:", error);
        saveLocally();
      });
    } else {
      saveLocally();
    }

    // Display custom message
    const successText = document.getElementById('booking-success-text');
    successText.innerHTML = `Hi <strong>${name}</strong>, thank you for booking a <strong>${service} Session</strong> on <strong>${date}</strong>. We will call you at <strong>${phone}</strong> shortly to confirm your booking!`;

    // Swap panels
    formWrapper.style.display = 'none';
    successPanel.classList.add('active');
  });

  // --- 7. Intersection Observer for Scroll Reveals ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Run once per element
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
