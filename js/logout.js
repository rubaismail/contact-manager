const logoutButton = document.getElementById("logout-button");
const dashboardMessage = document.getElementById("dashboard-message");


async function checkSession() {
    try {
        const response = await fetch("LAMPAPI/SearchContact.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({
                query: "",
                page: 1,
                limit: 1
            })
        });

        if (response.status === 401) {
            window.location.href = "index.html";
        }

    } catch (error) {
        dashboardMessage.textContent =
            "Unable to verify your session.";
        dashboardMessage.classList.add("error");
    }
}


logoutButton.addEventListener("click", async function () {
    logoutButton.disabled = true;
    logoutButton.textContent = "Logging out...";

    try {
        const response = await fetch("LAMPAPI/Logout.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({})
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = "index.html";
        } else {
            dashboardMessage.textContent =
                data.error || "Unable to log out.";

            dashboardMessage.classList.add("error");

            logoutButton.disabled = false;
            logoutButton.textContent = "Log Out";
        }

    } catch (error) {
        dashboardMessage.textContent =
            "Unable to connect to the server.";

        dashboardMessage.classList.add("error");

        logoutButton.disabled = false;
        logoutButton.textContent = "Log Out";
    }
});


checkSession();