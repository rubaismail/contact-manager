const addContactForm = document.getElementById("add-contact-form");
const submitButton = addContactForm.querySelector(".submit-button");

function contactError(id, message) {
    document.getElementById(id).textContent = message;
}

addContactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("contact-first-name");
    const lastName = document.getElementById("contact-last-name");
    const email = document.getElementById("contact-email");
    const phone = document.getElementById("contact-phone");

    contactError("contact-first-name-error", "");
    contactError("contact-last-name-error", "");
    contactError("contact-email-error", "");
    contactError("contact-phone-error", "");

    let valid = true;

    if (firstName.value.trim() === "") {
        contactError("contact-first-name-error", "First name is required.");
        valid = false;
    }

    if (lastName.value.trim() === "") {
        contactError("contact-last-name-error", "Last name is required.");
        valid = false;
    }

    if (email.value.trim() === "") {
        contactError("contact-email-error", "Email is required.");
        valid = false;
    } else if (!email.value.includes("@") || !email.value.includes(".")) {
        contactError("contact-email-error", "Enter a valid email.");
        valid = false;
    }

    const phonePattern = /^[0-9\-\(\)\s]+$/;

    if (phone.value.trim() === "") {
        contactError("contact-phone-error", "Phone number is required.");
        valid = false;
    } else if (!phonePattern.test(phone.value.trim())) {
        contactError("contact-phone-error", "Enter a valid phone number.");
        valid = false;
    }

    if (valid) {
        submitButton.disabled = true;
        submitButton.textContent = "Adding...";

        // API request undone
    }
});