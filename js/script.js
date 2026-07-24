/**
 * Karthikeyan R - Portfolio Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation elements
  const header = document.querySelector('.header');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active navigation item state highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  // Close mobile nav on link click
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  });

  // Copy Email to Clipboard Functionality
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = document.getElementById('emailText').innerText;
      navigator.clipboard.writeText(emailText).then(() => {
        showToast('✉️ Email copied to clipboard!');
      }).catch(err => {
        showToast('✉️ Email: ' + emailText);
      });
    });
  }

  // Contact Form Submission Handling via Web3Forms API
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('name').value.trim();
      const emailInput = document.getElementById('email').value.trim();
      const subjectInput = document.getElementById('subject').value.trim() || 'Portfolio Inquiry';
      const messageInput = document.getElementById('message').value.trim();

      if (!nameInput || !emailInput || !messageInput) {
        showToast('⚠️ Please complete all required fields.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      const web3key = document.getElementById('web3formsKey');

      if (web3key && web3key.value && web3key.value !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
        try {
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });

          const result = await response.json();
          if (result.success) {
            showToast('🚀 Message sent directly to Karthikeyan\'s inbox!');
            contactForm.reset();
          } else {
            showToast('⚠️ Could not send message. Opening email client...');
            openMailClient(emailInput, subjectInput, messageInput, nameInput);
          }
        } catch (error) {
          showToast('⚠️ Network error. Opening email client...');
          openMailClient(emailInput, subjectInput, messageInput, nameInput);
        } finally {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      } else {
        // Direct mailto fallback if free Web3Forms key is not added yet
        showToast('✉️ Opening email client to send message...');
        openMailClient(emailInput, subjectInput, messageInput, nameInput);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        contactForm.reset();
      }
    });
  }

  function openMailClient(userEmail, subject, message, userName) {
    const mailtoUrl = `mailto:karthikeyanrsd007@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${userName} (${userEmail})\n\n${message}`)}`;
    window.location.href = mailtoUrl;
  }

  // Helper Toast Notification
  function showToast(message) {
    let toast = document.getElementById('toastModal');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastModal';
      toast.className = 'toast-modal';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
});
