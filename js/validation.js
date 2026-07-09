/* 
   File: js/validation.js
   Purpose: Client-side validation routines for input fields (email, phone, enrollment numbers), custom error bubble display.
*/

const FormValidation = (function() {
    // Basic email format check
    function isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase().trim());
    }

    // Phone format check (accepts +91, 10-digit formats)
    function isValidPhone(phone) {
        const re = /^(?:\+?\d{1,3}[- ]?)?\d{10}$/;
        return re.test(String(phone).replace(/\s+/g, ''));
    }

    // Enrollment number check (Alphanumeric, e.g., 21CS001, 8 to 15 characters)
    function isValidEnrollment(enrollment) {
        const re = /^[a-zA-Z0-9]{8,15}$/;
        return re.test(String(enrollment).trim());
    }

    // Display error wrapper on form group
    function showError(input, message) {
        const group = input.closest('.form-group');
        if (!group) return;

        // Clear existing errors
        clearError(input);

        group.classList.add('has-error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${message}</span>`;
        
        group.appendChild(errorDiv);
        
        // Trigger small vibration/shake animation if supported
        input.style.animation = 'shake 0.3s ease-in-out';
        setTimeout(() => {
            input.style.animation = '';
        }, 300);
    }

    // Clear error state
    function clearError(input) {
        const group = input.closest('.form-group');
        if (!group) return;

        group.classList.remove('has-error');
        const errMessage = group.querySelector('.error-message');
        if (errMessage) {
            errMessage.remove();
        }
    }

    // Bind real-time input listeners to clear errors on keyup/change
    function initRealtimeValidation(form) {
        const inputs = form.querySelectorAll('.form-input');
        inputs.forEach(input => {
            const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
            input.addEventListener(eventType, () => {
                clearError(input);
            });
        });
    }

    // Validate registration fields
    function validateRegistration(form) {
        let isValid = true;

        const name = form.querySelector('[name="studentName"]');
        const email = form.querySelector('[name="email"]');
        const enrollment = form.querySelector('[name="enrollmentNo"]');
        const department = form.querySelector('[name="department"]');
        const semester = form.querySelector('[name="semester"]');
        const phone = form.querySelector('[name="phone"]');
        const gender = form.querySelector('[name="gender"]');
        const eventSelect = form.querySelector('[name="eventId"]');

        // Student Name validation
        if (name && name.value.trim().length < 3) {
            showError(name, "Name must be at least 3 characters long.");
            isValid = false;
        }

        // Email validation
        if (email) {
            if (!email.value.trim()) {
                showError(email, "Email address is required.");
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, "Please enter a valid email address (e.g. name@domain.com).");
                isValid = false;
            }
        }

        // Enrollment validation
        if (enrollment) {
            if (!enrollment.value.trim()) {
                showError(enrollment, "Enrollment number is required.");
                isValid = false;
            } else if (!isValidEnrollment(enrollment.value)) {
                showError(enrollment, "Enrollment number must be 8-15 alphanumeric characters.");
                isValid = false;
            }
        }

        // Phone validation
        if (phone) {
            if (!phone.value.trim()) {
                showError(phone, "Phone number is required.");
                isValid = false;
            } else if (!isValidPhone(phone.value)) {
                showError(phone, "Please enter a valid 10-digit phone number.");
                isValid = false;
            }
        }

        // Department validation
        if (department && !department.value) {
            showError(department, "Please select your department.");
            isValid = false;
        }

        // Semester validation
        if (semester && !semester.value) {
            showError(semester, "Please select your semester.");
            isValid = false;
        }

        // Gender validation
        if (gender && !gender.value) {
            showError(gender, "Please select your gender.");
            isValid = false;
        }

        // Event validation
        if (eventSelect && !eventSelect.value) {
            showError(eventSelect, "Please select an event to register.");
            isValid = false;
        }

        return isValid;
    }

    return {
        validateRegistration,
        showError,
        clearError,
        initRealtimeValidation,
        isValidEmail,
        isValidPhone,
        isValidEnrollment
    };
})();
