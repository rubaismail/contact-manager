const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");


loginTab.addEventListener("click", function () {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    loginTab.classList.add("active");
    registerTab.classList.remove("active");
});

registerTab.addEventListener("click", function () {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    registerTab.classList.add("active");
    loginTab.classList.remove("active");
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("login-username");
    const password = document.getElementById("login-password");

    const usernameError = document.getElementById("login-username-error");
    const passwordError = document.getElementById("login-password-error");

    usernameError.textContent = "";
    passwordError.textContent = "";

    let valid = true;

    if (username.value.trim() === "") {
        usernameError.textContent = "Username is required.";
        valid = false;
    }

    if (password.value.trim() === "") {
        passwordError.textContent = "Password is required.";
        valid = false;
    }

    if (valid) {
        console.log("Login form is valid.");
    }
});

registerForm.addEventListener("submit", function (event) {
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

    if (valid) {
        console.log("Registration form is valid.");
    }
});