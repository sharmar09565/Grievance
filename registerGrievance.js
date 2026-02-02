document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Collect data
    const formData = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        admission_no: document.getElementById("admissionNo").value,
        roll_no: document.getElementById("rollNo").value,
        mobile: document.getElementById("mobile").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
        description: document.getElementById("description").value,
        // Optional: Include user_id if logged in (from localStorage)
        // user_id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null
    };

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
        formData.user_id = user.id;
    }

    // Basic Validation
    if (!formData.first_name || !formData.mobile || !formData.email || !formData.department || !formData.description) {
        alert("Please fill in required fields");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/grievances', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Grievance registered successfully! Your Grievance ID is: ' + result.grievanceId);
            // Optional: Redirect or clear form
            document.querySelector("form").reset();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit grievance. Please ensure the backend is running.');
    }
});
