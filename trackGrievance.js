document.getElementById("trackForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const grievanceId = document.getElementById("grievanceId").value;
    const searchEmail = document.getElementById("searchEmail").value; // Not used in simple ID lookup but could be for verification

    if (!grievanceId) {
        alert("Please enter Grievance ID");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/grievances/track/${grievanceId}`);
        const result = await response.json();

        const statusCard = document.querySelector(".status-card");

        if (response.ok) {
            // Update UI
            statusCard.style.display = "block";
            statusCard.innerHTML = `
                <h3>ℹ️ Status: <span>${result.status}</span></h3>
                <p><b>Grievance ID:</b> ${result.id}</p>
                <p><b>Created At:</b> ${new Date(result.created_at).toLocaleDateString()}</p>
                <p><b>Details:</b> ${result.description}</p>
            `;
            // Optional: Check email match if needed
            // if(result.email !== searchEmail && result.mobile !== searchEmail) alert("Warning: Email/Mobile doesn't match records");
        } else {
            statusCard.style.display = "none";
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to track grievance. Please ensure the backend is running.');
    }
});
