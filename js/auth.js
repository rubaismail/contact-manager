const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");

const loginButton = document.getElementById("login-button");
const registerButton = document.getElementById("register-button");

function showMessage(element, message, success) {
    element.textContent = message;

    element.classList.remove("success", "error");

    if (success) {
        element.classList.add("success");
    } else {
        element.classList.add("error");
    }
}


loginTab.addEventListener("click", function () {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginMessage.textContent = "";
    registerMessage.textContent = "";
});


registerTab.addEventListener("click", function () {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    loginMessage.textContent = "";
    registerMessage.textContent = "";
});


loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("login-username");
    const password = document.getElementById("login-password");

    const usernameError = document.getElementById("login-username-error");
    const passwordError = document.getElementById("login-password-error");

    usernameError.textContent = "";
    passwordError.textContent = "";
    loginMessage.textContent = "";

    let valid = true;

    if (username.value.trim() === "") {
        usernameError.textContent = "Username is required.";
        valid = false;
    }

    if (password.value.trim() === "") {
        passwordError.textContent = "Password is required.";
        valid = false;
    }

    if (!valid) {
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {
        const response = await fetch("LAMPAPI/Login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify({
                Username: username.value.trim(),
                Password: password.value
            })
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = "contacts.html";
        } else {
            showMessage(
                loginMessage,
                data.error || "Unable to log in. Please try again.",
                false
            );
        }

    } catch (error) {
        showMessage(
            loginMessage,
            "Unable to connect to the server.",
            false
        );
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Log In";
    }
});


registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const username = document.getElementById("register-username");
    const password = document.getElementById("register-password");
    const confirmPassword = document.getElementById("confirm-password");

    const firstNameError = document.getElementById("first-name-error");
    const lastNameError = document.getElementById("last-name-error");
    const usernameError = document.getElementById("register-username-error");
    const passwordError = document.getElementById("register-password-error");
    const confirmPasswordError = document.getElementById("confirm-password-error");

    firstNameError.textContent = "";
    lastNameError.textContent = "";
    usernameError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";
    registerMessage.textContent = "";

    let valid = true;

    if (firstName.value.trim() === "") {
        firstNameError.textContent = "First name is required.";
        valid = false;
    }

    if (lastName.value.trim() === "") {
        lastNameError.textContent = "Last name is required.";
        valid = false;
    }

    if (username.value.trim() === "") {
        usernameError.textContent = "Username is required.";
        valid = false;
    }

    if (password.value.trim() === "") {
        passwordError.textContent = "Password is required.";
        valid = false;
    }

    if (confirmPassword.value.trim() === "") {
        confirmPasswordError.textContent = "Please confirm your password.";
        valid = false;
    } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.textContent = "Passwords do not match.";
        valid = false;
    }

    if (!valid) {
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = "Creating account...";

    try {
        const response = await fetch("LAMPAPI/Register.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                FirstName: firstName.value.trim(),
                LastName: lastName.value.trim(),
                Username: username.value.trim(),
                Password: password.value
            })
        });

        const data = await response.json();

        if (data.success) {
            registerForm.reset();

            registerForm.classList.add("hidden");
            loginForm.classList.remove("hidden");

            registerTab.classList.remove("active");
            loginTab.classList.add("active");

            showMessage(
                loginMessage,
                "Account created successfully. You can now log in.",
                true
            );

        } else {
            showMessage(
                registerMessage,
                data.error || "Unable to create account. Please try again.",
                false
            );
        }

    } catch (error) {
        showMessage(
            registerMessage,
            "Unable to connect to the server.",
            false
        );
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = "Create Account";
    }
});