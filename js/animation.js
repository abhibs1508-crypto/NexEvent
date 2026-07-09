/* 
   File: js/animation.js
   Purpose: Orchestrates premium interactive graphics. Includes custom cursor glows, 3D card tilts with specular lighting sheen, elastic magnetic buttons, and text reveal loops.
*/

const AnimationHelper = (function() {

    // --- 1. Global Cursor Glow & Hover Coordinate Tracker ---
    function initCursorGlow() {
        let glow = document.getElementById('cursor-glow');
        if (!glow) {
            glow = document.createElement('div');
            glow.id = 'cursor-glow';
            document.body.appendChild(glow);
        }

        document.addEventListener('mousemove', (e) => {
            // Smoothly move the body-wide cursor radial glow
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
        });

        // Delegate mouse positions to hovered card coordinates
        document.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.card-glow');
            if (!card) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // X position inside card
            const y = e.clientY - rect.top;  // Y position inside card

            card.style.setProperty('--mouse-x', x);
            card.style.setProperty('--mouse-y', y);
        });
    }

    // --- 2. Button Ripples ---
    function initButtonRipples() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn');
            if (!btn) return;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;

            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            btn.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    }

    // --- 3. 3D Card Tilt with Specular Lighting Sheen ---
    function initCardTilt() {
        if (window.matchMedia('(pointer: coarse)').matches) return; // disable on tablets/mobiles

        const cards = document.querySelectorAll('.card-tilt');
        
        cards.forEach(card => {
            // Create sheen element dynamically
            let sheen = card.querySelector('.card-sheen');
            if (!sheen) {
                sheen = document.createElement('div');
                sheen.className = 'card-sheen';
                sheen.style.position = 'absolute';
                sheen.style.top = '0';
                sheen.style.left = '0';
                sheen.style.width = '100%';
                sheen.style.height = '100%';
                sheen.style.pointerEvents = 'none';
                sheen.style.zIndex = '3';
                sheen.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)';
                sheen.style.mixBlendMode = 'overlay';
                sheen.style.opacity = '0';
                sheen.style.transition = 'opacity 0.4s ease';
                card.appendChild(sheen);
            }

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Rotation angles
                const rotateX = ((centerY - y) / centerY) * 12; // tilt max 12 deg
                const rotateY = ((x - centerX) / centerX) * 12;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
                
                // Dynamically offset specular lighting highlight
                const pctX = (x / rect.width) * 100;
                const pctY = (y / rect.height) * 100;
                sheen.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,0.18) 0%, transparent 50%)`;
                sheen.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                sheen.style.opacity = '0';
            });
        });
    }

    // --- 4. Elastic Spring Magnetic Buttons ---
    function initMagneticButtons() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const magnets = document.querySelectorAll('.btn-magnetic');
        
        magnets.forEach(magnet => {
            magnet.addEventListener('mousemove', (e) => {
                const rect = magnet.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Smooth elastic pull (magnetic factor of 0.35)
                magnet.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
            });

            magnet.addEventListener('mouseleave', () => {
                magnet.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // --- 5. Typewriter & Keyword Rotation Loops ---
    function initTypewriter() {
        const textEl = document.querySelector('.typewriter-text');
        if (!textEl) return;

        const words = JSON.parse(textEl.getAttribute('data-words') || '[]');
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let delay = 150;

        function type() {
            const currentWord = words[wordIndex] || '';
            
            if (isDeleting) {
                textEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                delay = 80;
            } else {
                textEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                delay = 180;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                delay = 1800; // Pause at full word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 500; // brief pause before writing next word
            }

            setTimeout(type, delay);
        }

        setTimeout(type, 500);
    }

    // --- 6. Dynamic Scroll Reveal Observer ---
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal-on-scroll');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        
                        // Handle stagger lists inside reveal-groups
                        if (entry.target.classList.contains('reveal-group')) {
                            const items = entry.target.querySelectorAll('.reveal-item');
                            items.forEach((item, index) => {
                                item.style.animationDelay = `${index * 0.08}s`;
                                item.classList.add('is-revealed');
                            });
                        }
                    }
                });
            }, {
                threshold: 0.05,
                rootMargin: '0px 0px -40px 0px'
            });

            reveals.forEach(el => observer.observe(el));
        } else {
            reveals.forEach(el => el.classList.add('is-revealed'));
        }
    }

    function initAll() {
        initCursorGlow();
        initButtonRipples();
        initCardTilt();
        initMagneticButtons();
        initTypewriter();
        initScrollReveal();
    }

    document.addEventListener('DOMContentLoaded', initAll);

    return {
        initAll,
        initCursorGlow,
        initCardTilt,
        initMagneticButtons
    };
})();
