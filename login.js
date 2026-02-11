const API_URL = 'http://localhost:5000/api';

function toggleDropdown() {
  document.getElementById("dropdown").classList.toggle("show");
}

// Add click event listeners to all .role buttons
document.querySelectorAll(".role").forEach(button => {
  button.addEventListener("click", function () {
    // Remove active class from all role buttons
    document.querySelectorAll(".role").forEach(btn => btn.classList.remove("active"));
    // Add active class to clicked button
    this.classList.add("active");
    // Update signup visibility based on selected role
    updateSignupVisibility();
    // Ensure form mode is consistent after role change
    updateFormMode();
  });
});

// Show or hide signup link based on selected role
function updateSignupVisibility() {
  const signupLink = document.getElementById("signupLink");
  const signupFields = document.getElementById("signupFields");
  const loginBtn = document.querySelector('.login-btn');
  if (!signupLink || !signupFields || !loginBtn) return;
  const activeRoleEl = document.querySelector(".role.active");
  const roleText = activeRoleEl ? activeRoleEl.textContent.trim().toLowerCase() : '';
  if (roleText.includes('student')) {
    signupLink.style.display = 'block';
  } else {
    signupLink.style.display = 'none';
    // revert to login mode when non-student selected
    loginBtn.textContent = 'Login';
    signupLink.textContent = 'Signup';
    signupFields.style.display = 'none';
    // ensure login inputs and forgot link are visible
    const loginInputs = document.getElementById('loginInputs');
    const forgotContainer = document.getElementById('forgotContainer');
    if (loginInputs) loginInputs.style.display = 'block';
    if (forgotContainer) forgotContainer.style.display = 'block';
    // close dropdown if open
    const dd = document.getElementById('dropdown');
    if (dd && dd.classList.contains('show')) dd.classList.remove('show');
  }
  // keep form UI consistent
  updateFormMode();
}

// Add click event listeners to dropdown items
document.addEventListener("DOMContentLoaded", function () {
  const dropdownItems = document.querySelectorAll(".dropdown a");
  const loginBtn = document.querySelector(".login-btn");

  // Initialize signup visibility based on default active role
  updateSignupVisibility();

  dropdownItems.forEach(item => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      // Swap text between login-btn and dropdown item
      const temp = loginBtn.textContent;
      loginBtn.textContent = this.textContent;
      this.textContent = temp;
      // Close dropdown
      document.getElementById("dropdown").classList.remove("show");
      // Update form mode (login/signup) after swapping
      updateFormMode();
    });
  });

  // Initialize signup visibility and form mode based on default active role
  updateSignupVisibility();
  updateFormMode();
});

// close dropdown if clicked outside
window.addEventListener("click", function (e) {
  if (!e.target.classList.contains("arrow-btn")) {
    document.getElementById("dropdown").classList.remove("show");
  }
});

// ============ FORGOT PASSWORD FUNCTIONALITY ============

const forgotLink = document.getElementById("forgotLink");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const closeModal = document.getElementById("closeModal");

// Store OTP and email temporarily
let userEmail = "";
let otpTimeRemaining = 300; // 5 minutes
let resetToken = "";

// Open forgot password modal
if (forgotLink) {
  forgotLink.addEventListener("click", function (e) {
    e.preventDefault();
    resetForgotPasswordForm();
    forgotPasswordModal.classList.add("show");
  });
}

// Close modal when X is clicked
if (closeModal) {
  closeModal.addEventListener("click", function () {
    forgotPasswordModal.classList.remove("show");
    resetForgotPasswordForm();
  });
}

// Close modal when clicking outside the modal content
window.addEventListener("click", function (e) {
  if (e.target === forgotPasswordModal) {
    forgotPasswordModal.classList.remove("show");
    resetForgotPasswordForm();
  }
});

// Reset form to initial state
function resetForgotPasswordForm() {
  document.getElementById("step1").style.display = "block";
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "none";
  document.getElementById("step4").style.display = "none";

  document.getElementById("forgotEmail").value = "";
  document.getElementById("otpInput").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("confirmPassword").value = "";

  clearMessage("forgotMessage");
  clearMessage("otpMessage");
  clearMessage("passwordMessage");

  userEmail = "";
  resetToken = "";
  otpTimeRemaining = 300;
  document.getElementById("timer").textContent = "05:00";
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function checkPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/)) strength++;
  if (password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;

  return strength;
}

// Display password strength
function displayPasswordStrength(password) {
  const strengthDiv = document.getElementById("passwordStrength");
  const strength = checkPasswordStrength(password);

  if (password.length === 0) {
    strengthDiv.style.display = "none";
    return;
  }

  strengthDiv.style.display = "block";

  if (strength < 2) {
    strengthDiv.className = "password-strength weak";
    strengthDiv.textContent = "Weak Password";
  } else if (strength < 4) {
    strengthDiv.className = "password-strength medium";
    strengthDiv.textContent = "Medium Password";
  } else {
    strengthDiv.className = "password-strength strong";
    strengthDiv.textContent = "Strong Password";
  }
}

// Clear message
function clearMessage(elementId) {
  const messageEl = document.getElementById(elementId);
  if (messageEl) {
    messageEl.textContent = "";
    messageEl.className = "modal-message";
    messageEl.style.display = "none";
  }
}

// Show message
function showMessage(elementId, text, type = "info") {
  const messageEl = document.getElementById(elementId);
  if (messageEl) {
    messageEl.textContent = text;
    messageEl.className = `modal-message ${type}`;
    messageEl.style.display = "block";
  }
}

// Step 1: Send OTP
const sendOtpBtn = document.getElementById("sendOtpBtn");
if (sendOtpBtn) {
  sendOtpBtn.addEventListener("click", async function () {
    const email = document.getElementById("forgotEmail").value.trim();

    clearMessage("forgotMessage");

    if (!email) {
      showMessage("forgotMessage", "Please enter your email", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("forgotMessage", "Please enter a valid email", "error");
      return;
    }

    try {
      showMessage("forgotMessage", "Sending OTP...", "info");
      
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        userEmail = email;
        resetToken = data.resetToken;
        
        showMessage("forgotMessage", `OTP sent to ${email}`, "success");

        // Move to step 2 after 1 second
        setTimeout(() => {
          document.getElementById("step1").style.display = "none";
          document.getElementById("step2").style.display = "block";
          startOtpTimer();
        }, 1000);
      } else {
        showMessage("forgotMessage", data.message || "Failed to send OTP", "error");
      }
    } catch (error) {
      console.error(error);
      showMessage("forgotMessage", "Error sending OTP. Is backend running?", "error");
    }
  });
}

// OTP Timer
function startOtpTimer() {
  otpTimeRemaining = 300; // 5 minutes

  const timerElement = document.getElementById("timer");
  const resendBtn = document.getElementById("resendOtpLink");
  if (resendBtn) resendBtn.style.display = "none";

  const timerInterval = setInterval(() => {
    otpTimeRemaining--;

    const minutes = Math.floor(otpTimeRemaining / 60);
    const seconds = otpTimeRemaining % 60;
    if (timerElement) {
      timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    if (otpTimeRemaining <= 0) {
      clearInterval(timerInterval);

      document.getElementById("step2").style.display = "none";
      document.getElementById("step1").style.display = "block";
      showMessage("forgotMessage", "OTP expired. Please try again.", "error");
    }
  }, 1000);
}

// Step 2: Verify OTP
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
if (verifyOtpBtn) {
  verifyOtpBtn.addEventListener("click", async function () {
    const enteredOtp = document.getElementById("otpInput").value.trim();

    clearMessage("otpMessage");

    if (!enteredOtp) {
      showMessage("otpMessage", "Please enter OTP", "error");
      return;
    }

    if (enteredOtp.length !== 6 || isNaN(enteredOtp)) {
      showMessage("otpMessage", "OTP must be 6 digits", "error");
      return;
    }

    try {
      showMessage("otpMessage", "Verifying OTP...", "info");
      
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, otp: enteredOtp, resetToken })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("otpMessage", "OTP verified successfully", "success");

        setTimeout(() => {
          document.getElementById("step2").style.display = "none";
          document.getElementById("step3").style.display = "block";
          clearMessage("otpMessage");
        }, 1000);
      } else {
        showMessage("otpMessage", data.message || "Invalid OTP", "error");
      }
    } catch (error) {
      console.error(error);
      showMessage("otpMessage", "Error verifying OTP", "error");
    }
  });
}

// Resend OTP
const resendOtpLink = document.getElementById("resendOtpLink");
if (resendOtpLink) {
  resendOtpLink.addEventListener("click", async function (e) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("otpMessage", "OTP resent to your email", "success");
        document.getElementById("otpInput").value = "";

        setTimeout(() => {
          clearMessage("otpMessage");
          startOtpTimer();
        }, 1500);
      } else {
        showMessage("otpMessage", data.message || "Failed to resend OTP", "error");
      }
    } catch (error) {
      console.error(error);
      showMessage("otpMessage", "Error resending OTP", "error");
    }
  });
}

// Monitor password strength
const newPasswordInput = document.getElementById("newPassword");
if (newPasswordInput) {
  newPasswordInput.addEventListener("input", function () {
    displayPasswordStrength(this.value);
  });
}

// Step 3: Reset Password
const resetPasswordBtn = document.getElementById("resetPasswordBtn");
if (resetPasswordBtn) {
  resetPasswordBtn.addEventListener("click", async function () {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    clearMessage("passwordMessage");

    if (!newPassword || !confirmPassword) {
      showMessage("passwordMessage", "Please fill in all fields", "error");
      return;
    }

    if (newPassword.length < 8) {
      showMessage("passwordMessage", "Password must be at least 8 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("passwordMessage", "Passwords do not match", "error");
      return;
    }

    const strength = checkPasswordStrength(newPassword);
    if (strength < 2) {
      showMessage("passwordMessage", "Password is too weak. Use uppercase, lowercase, numbers, and special characters.", "error");
      return;
    }

    try {
      showMessage("passwordMessage", "Resetting password...", "info");
      
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, newPassword, resetToken })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("passwordMessage", "Password reset successfully", "success");

        setTimeout(() => {
          document.getElementById("step3").style.display = "none";
          document.getElementById("step4").style.display = "block";
        }, 1500);
      } else {
        showMessage("passwordMessage", data.message || "Failed to reset password", "error");
      }
    } catch (error) {
      console.error(error);
      showMessage("passwordMessage", "Error resetting password", "error");
    }
  });
}

// Back to Login
const backToLoginBtn = document.getElementById("backToLoginBtn");
if (backToLoginBtn) {
  backToLoginBtn.addEventListener("click", function () {
    forgotPasswordModal.classList.remove("show");
    resetForgotPasswordForm();
  });
}

// Add click event listener to login button
const loginBtn = document.querySelector(".login-btn");
if (loginBtn) {
  loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const messageDiv = document.getElementById("loginMessage");
    const isSignupMode = loginBtn.textContent.trim().toLowerCase() === 'signup';

    // Clear previous message
    if (messageDiv) {
      messageDiv.textContent = "";
      messageDiv.classList.remove("success", "error");
    }

    if (isSignupMode) {
      const fullName = document.getElementById('fullName');
      const universityRoll = document.getElementById('universityRoll');
      const admissionRoll = document.getElementById('admissionRoll');
      const department = document.getElementById('department');
      const batch = document.getElementById('batch');
      const semester = document.getElementById('semester');
      const createPassword = document.getElementById('createPassword');
      const confirmPassword = document.getElementById('confirmPassword');
      const mobile = document.getElementById('mobile');
      const signupEmail = document.getElementById('signupEmail');

      if (!fullName.value.trim()) return showInlineMessage(messageDiv, 'Please enter full name', 'error');
      if (/[0-9]/.test(fullName.value)) return showInlineMessage(messageDiv, 'Name must not contain numbers', 'error');
      if (!universityRoll.value.trim()) return showInlineMessage(messageDiv, 'Please enter university roll', 'error');
      if (!/^[0-9]+$/.test(universityRoll.value)) return showInlineMessage(messageDiv, 'University roll must contain numbers only', 'error');
      if (!admissionRoll.value.trim()) return showInlineMessage(messageDiv, 'Please enter admission roll', 'error');
      if (!/^[A-Za-z0-9]+$/.test(admissionRoll.value)) return showInlineMessage(messageDiv, 'Admission roll must be alphanumeric', 'error');
      if (!department.value) return showInlineMessage(messageDiv, 'Please select department', 'error');
      if (!batch.value.trim()) return showInlineMessage(messageDiv, 'Please enter batch', 'error');
      if (!semester.value) return showInlineMessage(messageDiv, 'Please select semester', 'error');
      if (!createPassword.value || !confirmPassword.value) return showInlineMessage(messageDiv, 'Please enter and confirm password', 'error');
      if (createPassword.value.length < 8) return showInlineMessage(messageDiv, 'Password must be at least 8 characters', 'error');
      if (!/[0-9]/.test(createPassword.value)) return showInlineMessage(messageDiv, 'Password must contain at least one numeric digit', 'error');
      if (!/[A-Z]/.test(createPassword.value)) return showInlineMessage(messageDiv, 'Password must contain at least one uppercase letter', 'error');
      if (createPassword.value !== confirmPassword.value) return showInlineMessage(messageDiv, 'Passwords do not match', 'error');
      if (!mobile.value.trim()) return showInlineMessage(messageDiv, 'Please enter mobile number', 'error');
      if (!/^[0-9]{10}$/.test(mobile.value)) return showInlineMessage(messageDiv, 'Mobile number must be 10 digits', 'error');
      if (!signupEmail.value.trim() || !isValidEmail(signupEmail.value)) return showInlineMessage(messageDiv, 'Please enter a valid email', 'error');

      try {
        showInlineMessage(messageDiv, 'Signing up...', 'success');
        
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName.value,
            email: signupEmail.value,
            password: createPassword.value,
            role: 'student'
          })
        });

        const data = await response.json();

        if (response.ok) {
          showInlineMessage(messageDiv, 'Signup successful. You can now login.', 'success');

          // Reset form and return to login mode after success
          setTimeout(() => {
            fullName.value = '';
            universityRoll.value = '';
            admissionRoll.value = '';
            department.value = '';
            batch.value = '';
            semester.innerHTML = '<option value="">Select Semester</option>';
            createPassword.value = '';
            confirmPassword.value = '';
            mobile.value = '';
            signupEmail.value = '';
            // revert button and dropdown
            loginBtn.textContent = 'Login';
            const signupAnchor = document.getElementById('signupLink');
            if (signupAnchor) signupAnchor.textContent = 'Signup';
            updateFormMode();
          }, 1500);
        } else {
          showInlineMessage(messageDiv, data.message || 'Signup failed', 'error');
        }
      } catch (error) {
        console.error(error);
        showInlineMessage(messageDiv, 'Server error. Is backend running?', 'error');
      }

      return;
    }

    // Otherwise perform login
    if (!emailInput.value || !passwordInput.value) {
      if (messageDiv) {
        messageDiv.textContent = "Please fill in all fields";
        messageDiv.classList.add("error");
      }
      return;
    }

    try {
      if (messageDiv) messageDiv.textContent = "Logging in...";

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save to local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (messageDiv) {
          messageDiv.textContent = "Login successful!";
          messageDiv.classList.add("success");
        }

        // Redirect logic
        setTimeout(() => {
          if (data.user.role === 'admin' || data.user.role === 'committee') {
            // Placeholder for admin dashboard
            alert(`Welcome ${data.user.name} (${data.user.role})`);
            // window.location.href = 'admin.html';
          } else {
            window.location.href = 'index.html';
          }
        }, 1000);
      } else {
        if (messageDiv) {
          messageDiv.textContent = data.message || "Login failed";
          messageDiv.classList.add("error");
        }
      }
    } catch (error) {
      console.error(error);
      if (messageDiv) {
        messageDiv.textContent = "Server error. Is backend running?";
        messageDiv.classList.add("error");
      }
    }
  });
}

// Helper to show inline messages in login area
function showInlineMessage(element, text, type = 'info') {
  if (element) {
    element.textContent = text;
    element.className = '';
    element.classList.add(type === 'error' ? 'error' : 'success');
  }
  return;
}

// Toggle visibility of signup fields based on login button text
function updateFormMode() {
  const loginBtn = document.querySelector('.login-btn');
  const signupFields = document.getElementById('signupFields');
  const loginInputs = document.getElementById('loginInputs');
  const forgotContainer = document.getElementById('forgotContainer');
  if (!loginBtn || !signupFields) return;
  const isSignup = loginBtn.textContent.trim().toLowerCase() === 'signup';
  signupFields.style.display = isSignup ? 'block' : 'none';
  if (loginInputs) loginInputs.style.display = isSignup ? 'none' : 'block';
  if (forgotContainer) forgotContainer.style.display = isSignup ? 'none' : 'block';
  // show password requirements container only when creating password
  const passwordReq = document.getElementById('passwordReq');
  if (passwordReq && !isSignup) passwordReq.style.display = 'none';
}

// Update password requirements UI live
function updatePasswordReq() {
  const p = document.getElementById('createPassword');
  const c = document.getElementById('confirmPassword');
  const req = document.getElementById('passwordReq');
  if (!req) return;
  const len = document.getElementById('pr-length');
  const up = document.getElementById('pr-upper');
  const di = document.getElementById('pr-digit');
  const ma = document.getElementById('pr-match');
  const val = p ? p.value : '';
  const cv = c ? c.value : '';
  const okLen = val.length >= 8;
  const okUp = /[A-Z]/.test(val);
  const okDi = /[0-9]/.test(val);
  const okMa = val && val === cv;
  len.textContent = (okLen ? '✓' : '✗') + ' At least 8 characters';
  up.textContent = (okUp ? '✓' : '✗') + ' One uppercase letter';
  di.textContent = (okDi ? '✓' : '✗') + ' One numeric digit';
  ma.textContent = (okMa ? '✓' : '✗') + ' Passwords match';
  req.style.display = (val.length || cv.length) ? 'block' : 'none';
  len.style.color = okLen ? 'green' : '#b00';
  up.style.color = okUp ? 'green' : '#b00';
  di.style.color = okDi ? 'green' : '#b00';
  ma.style.color = okMa ? 'green' : '#b00';
}

// Attach live handlers for password inputs
document.addEventListener('DOMContentLoaded', function () {
  const p = document.getElementById('createPassword');
  const c = document.getElementById('confirmPassword');
  if (p) p.addEventListener('input', updatePasswordReq);
  if (c) c.addEventListener('input', updatePasswordReq);
});

// Populate semester options based on department
const departmentSemesterMap = {
  cse: 8,
  ece: 8,
  me: 8,
  ce: 8,
  mca: 6,
  mtech: 4
};

const deptEl = document.getElementById('department');
if (deptEl) {
  deptEl.addEventListener('change', function () {
    const semEl = document.getElementById('semester');
    semEl.innerHTML = '<option value="">Select Semester</option>';
    const val = this.value;
    const maxSem = departmentSemesterMap[val] || 8;
    for (let i = 1; i <= maxSem; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      semEl.appendChild(opt);
    }
  });
}

// Input restrictions for signup fields
const nameEl = document.getElementById('fullName');
if (nameEl) {
  nameEl.addEventListener('input', function () {
    this.value = this.value.replace(/[0-9]/g, '');
  });
}

const uniEl = document.getElementById('universityRoll');
if (uniEl) {
  uniEl.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
}

const admEl = document.getElementById('admissionRoll');
if (admEl) {
  admEl.addEventListener('input', function () {
    this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
  });
}

const mobileEl = document.getElementById('mobile');
if (mobileEl) {
  mobileEl.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
  });
}

