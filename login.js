function toggleDropdown() {
  document.getElementById("dropdown").classList.toggle("show");
}

// Add click event listeners to all .role buttons
document.querySelectorAll(".role").forEach(button => {
  button.addEventListener("click", function () {
    // Remove active class from all role buttons
    document.querySelectorAll(".role").forEach(btn => {
      btn.classList.remove("active");
    });
    // Add active class to clicked button
    this.classList.add("active");
  });
});

// Add click event listeners to dropdown items
document.addEventListener("DOMContentLoaded", function () {
  const dropdownItems = document.querySelectorAll(".dropdown a");
  const loginBtn = document.querySelector(".login-btn");

  dropdownItems.forEach(item => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      // Swap text between login-btn and dropdown item
      const temp = loginBtn.textContent;
      loginBtn.textContent = this.textContent;
      this.textContent = temp;
      // Close dropdown
      document.getElementById("dropdown").classList.remove("show");
    });
  });
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

// Store OTP and email temporarily (in real app, this would be on server)
let generatedOtp = "";
let userEmail = "";
let otpTimeRemaining = 300; // 5 minutes

// Open forgot password modal
forgotLink.addEventListener("click", function (e) {
  e.preventDefault();
  forgotPasswordModal.classList.add("show");
  resetForgotPasswordForm();
});

// Close modal when X is clicked
closeModal.addEventListener("click", function () {
  forgotPasswordModal.classList.remove("show");
  resetForgotPasswordForm();
});

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
  
  generatedOtp = "";
  userEmail = "";
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

// Generate a random OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clear message
function clearMessage(elementId) {
  const messageEl = document.getElementById(elementId);
  messageEl.textContent = "";
  messageEl.className = "modal-message";
  messageEl.style.display = "none";
}

// Show message
function showMessage(elementId, text, type = "info") {
  const messageEl = document.getElementById(elementId);
  messageEl.textContent = text;
  messageEl.className = `modal-message ${type}`;
  messageEl.style.display = "block";
}

// Step 1: Send OTP
document.getElementById("sendOtpBtn").addEventListener("click", function () {
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
  
  // Simulate OTP generation
  generatedOtp = generateOtp();
  userEmail = email;
  
  // In real app, send OTP via email
  console.log(`OTP sent to ${email}: ${generatedOtp}`);
  
  showMessage("forgotMessage", `OTP sent to ${email}`, "success");
  
  // Move to step 2 after 1 second
  setTimeout(() => {
    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
    startOtpTimer();
  }, 1000);
});

// OTP Timer
function startOtpTimer() {
  otpTimeRemaining = 300; // 5 minutes
  const timerElement = document.getElementById("timer");
  const resendBtn = document.getElementById("resendOtpLink");
  resendBtn.style.display = "none";
  
  const timerInterval = setInterval(() => {
    otpTimeRemaining--;
    const minutes = Math.floor(otpTimeRemaining / 60);
    const seconds = otpTimeRemaining % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
    if (otpTimeRemaining <= 0) {
      clearInterval(timerInterval);
      document.getElementById("step2").style.display = "none";
      document.getElementById("step1").style.display = "block";
      showMessage("forgotMessage", "OTP expired. Please try again.", "error");
    }
  }, 1000);
}

// Step 2: Verify OTP
document.getElementById("verifyOtpBtn").addEventListener("click", function () {
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
  
  if (enteredOtp === generatedOtp) {
    showMessage("otpMessage", "OTP verified successfully", "success");
    
    setTimeout(() => {
      document.getElementById("step2").style.display = "none";
      document.getElementById("step3").style.display = "block";
      clearMessage("otpMessage");
    }, 1000);
  } else {
    showMessage("otpMessage", "Invalid OTP. Please try again.", "error");
    document.getElementById("otpInput").value = "";
  }
});

// Resend OTP
document.getElementById("resendOtpLink").addEventListener("click", function (e) {
  e.preventDefault();
  
  generatedOtp = generateOtp();
  console.log(`OTP resent to ${userEmail}: ${generatedOtp}`);
  
  showMessage("otpMessage", "OTP resent to your email", "success");
  document.getElementById("otpInput").value = "";
  
  setTimeout(() => {
    clearMessage("otpMessage");
    startOtpTimer();
  }, 1500);
});

// Monitor password strength
document.getElementById("newPassword").addEventListener("input", function () {
  displayPasswordStrength(this.value);
});

// Step 3: Reset Password
document.getElementById("resetPasswordBtn").addEventListener("click", function () {
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
  
  // Simulate password reset
  console.log({
    email: userEmail,
    newPassword: newPassword
  });
  
  showMessage("passwordMessage", "Password resetting...", "info");
  
  setTimeout(() => {
    document.getElementById("step3").style.display = "none";
    document.getElementById("step4").style.display = "block";
  }, 1500);
});

// Back to Login
document.getElementById("backToLoginBtn").addEventListener("click", function () {
  forgotPasswordModal.classList.remove("show");
  resetForgotPasswordForm();
});

// Add click event listener to login button
const loginBtn = document.querySelector(".login-btn");
if (loginBtn) {
  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    
    // Get input values
    const emailInput = document.querySelector('input[placeholder="Email / Username"]');
    const passwordInput = document.querySelector('input[placeholder="Password"]');
    const messageDiv = document.getElementById("loginMessage");
    const roleActive = document.querySelector(".role.active").textContent;
    
    // Clear previous message
    messageDiv.textContent = "";
    messageDiv.classList.remove("success", "error");
    
    // Validate inputs
    if (!emailInput.value || !passwordInput.value) {
      messageDiv.textContent = "Please fill in all fields";
      messageDiv.classList.add("error");
      return;
    }
    
    // Perform login (you can add your login logic here)
    console.log({
      email: emailInput.value,
      password: passwordInput.value,
      role: roleActive
    });
    
    // Show success message
    messageDiv.textContent = "Login successful for " + roleActive;
    messageDiv.classList.add("success");
    
    // Clear form after 2 seconds
    setTimeout(() => {
      emailInput.value = "";
      passwordInput.value = "";
      messageDiv.textContent = "";
      messageDiv.classList.remove("success", "error");
    }, 2000);
  });
}

