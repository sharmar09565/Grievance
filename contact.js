let contact = document.querySelector(".grievance-card");
let grievanceContact = document.querySelector("#grievance-section");
contact.addEventListener("click", ()=>{
    grievanceContact.classList.remove("hide");
    grievanceContact.scrollIntoView({ behavior: "smooth" });
});
