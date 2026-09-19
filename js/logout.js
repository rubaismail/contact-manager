const logoutButton = document.getElementById("logout-button");
const dashboardMessage = document.getElementById("dashboard-message");


logoutButton.addEventListener("click", async function () {
    logoutButton.disabled = true;
    logoutButton.textContent = "Logging out...";

    try {
        await apiPost("LAMPAPI/Logout.php", {});

        window.location.href = "index.html";
    } catch (error) {
        if (error instanceof ApiAuthError) {
            return;
        }

        const message = error instanceof Error
            ? error.message
            : "Unable to log out.";

        dashboardMessage.textContent = message;
        dashboardMessage.classList.add("error");

        logoutButton.disabled = false;
        logoutButton.textContent = "Log Out";
    }
});
