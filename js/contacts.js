const addContactForm = document.getElementById("add-contact-form");

const firstName = document.getElementById("contact-first-name");
const lastName = document.getElementById("contact-last-name");
const email = document.getElementById("contact-email");
const phone = document.getElementById("contact-phone");

const firstNameError = document.getElementById("contact-first-name-error");
const lastNameError = document.getElementById("contact-last-name-error");
const emailError = document.getElementById("contact-email-error");
const phoneError = document.getElementById("contact-phone-error");

const contactMessage = document.getElementById("contact-message");
const addContactButton = document.getElementById("add-contact-button");


function showContactMessage(message, success) {
    contactMessage.textContent = message;

    contactMessage.classList.remove("success", "error");

    if (success) {
        contactMessage.classList.add("success");
    } else {
        contactMessage.classList.add("error");
    }
}


addContactForm.addEventListener("submit", async function (event) {
    event.preventDefault();


    // Clear previous errors

    firstNameError.textContent = "";
    lastNameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    contactMessage.textContent = "";


    let valid = true;


    // First name validation

    if (firstName.value.trim() === "") {
        firstNameError.textContent = "First name is required.";
        valid = false;
    }


    // Last name validation

    if (lastName.value.trim() === "") {
        lastNameError.textContent = "Last name is required.";
        valid = false;
    }


    // Email validation

    if (email.value.trim() === "") {
        emailError.textContent = "Email is required.";
        valid = false;

    } else if (
        !email.value.includes("@") ||
        !email.value.includes(".")
    ) {
        emailError.textContent = "Enter a valid email address.";
        valid = false;
    }


    // Phone validation

    const phonePattern = /^[0-9\-\(\)\s]+$/;

    if (phone.value.trim() === "") {
        phoneError.textContent = "Phone number is required.";
        valid = false;

    } else if (!phonePattern.test(phone.value.trim())) {
        phoneError.textContent = "Enter a valid phone number.";
        valid = false;
    }


    if (!valid) {
        return;
    }


    // Prevent duplicate submissions

    addContactButton.disabled = true;
    addContactButton.textContent = "Adding...";


    try {

        const response = await fetch("LAMPAPI/AddContact.php", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "same-origin",

            body: JSON.stringify({
                FirstName: firstName.value.trim(),
                LastName: lastName.value.trim(),
                Phone: phone.value.trim(),
                Email: email.value.trim()
            })
        });


        const data = await response.json();


        if (data.success) {

            showContactMessage(
                "Contact added successfully.",
                true
            );

            addContactForm.reset();


            /*
                The dashboard code will eventually refresh
                the contact list here.

                For example:

                loadContacts();

                Once the dashboard's contact-loading
                function exists, we can call it here.
            */

        } else {

            showContactMessage(
                data.error || "Unable to add contact.",
                false
            );
        }


    } catch (error) {

        showContactMessage(
            "Unable to connect to the server.",
            false
        );


    } finally {

        addContactButton.disabled = false;
        addContactButton.textContent = "Add Contact";

    }
});