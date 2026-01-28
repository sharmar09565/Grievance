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

