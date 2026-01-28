 let registerGrievance = document.querySelector(".primary");
 registerGrievance.addEventListener("click", ()=>{
    window.location.href = "registerGrievance.html";
 });

 let trackGrievance = document.querySelector(".secondary");
 trackGrievance.addEventListener("click", () =>{
   window.location.href = "trackGrievance.html";
 });

// Set active navbar link based on current page
document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar nav a");
  
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    
    // Check if link matches current page
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    } else if (href.startsWith("#") && currentPage === "index.html") {
      // For hash links on index page
      link.classList.remove("active");
    } else {
      link.classList.remove("active");
    }
  });
});