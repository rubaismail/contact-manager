const contactList = document.getElementById("contact-list");
const contactStatus = document.getElementById("contact-status");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("contact-search");
const searchButton = document.getElementById("search-button");
const clearSearchButton = document.getElementById("clear-search");
const pagination = document.getElementById("pagination");
const previousPageButton = document.getElementById("previous-page");
const nextPageButton = document.getElementById("next-page");
const pageSummary = document.getElementById("page-summary");
const addContactButton = document.getElementById("add-contact-button");
const addContactDialog = document.getElementById("add-contact-dialog");
const addContactForm = document.getElementById("add-contact-form");
const addFirstName = document.getElementById("add-first-name");
const addLastName = document.getElementById("add-last-name");
const addPhone = document.getElementById("add-phone");
const addEmail = document.getElementById("add-email");
const addContactMessage = document.getElementById("add-contact-message");
const closeAddDialogButton = document.getElementById("close-add-dialog");
const cancelAddButton = document.getElementById("cancel-add");
const saveContactButton = document.getElementById("save-contact");
const editContactDialog = document.getElementById("edit-contact-dialog");
const editContactForm = document.getElementById("edit-contact-form");
const editFirstName = document.getElementById("edit-first-name");
const editLastName = document.getElementById("edit-last-name");
const editPhone = document.getElementById("edit-phone");
const editEmail = document.getElementById("edit-email");
const editContactMessage = document.getElementById("edit-contact-message");
const closeEditDialogButton = document.getElementById("close-edit-dialog");
const cancelEditButton = document.getElementById("cancel-edit");
const saveEditButton = document.getElementById("save-edit");
const deleteContactDialog = document.getElementById("delete-contact-dialog");
const deleteContactForm = document.getElementById("delete-contact-form");
const deleteContactName = document.getElementById("delete-contact-name");
const deleteContactMessage = document.getElementById("delete-contact-message");
const closeDeleteDialogButton = document.getElementById("close-delete-dialog");
const cancelDeleteButton = document.getElementById("cancel-delete");
const confirmDeleteButton = document.getElementById("confirm-delete");

const dashboardState = {
    page: 1,
    limit: 10,
    totalPages: 0,
    query: ""
};

let activeRequest = null;
let addInProgress = false;
let contactBeingEdited = null;
let contactBeingDeleted = null;
let deleteInProgress = false;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setContactStatus(message, type = "") {
    contactStatus.textContent = message;
    contactStatus.classList.remove("error", "success");

    if (type) {
        contactStatus.classList.add(type);
    }
}

function createContactDetail(label, value) {
    const wrapper = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");

    term.textContent = label;
    description.textContent = value || "Not provided";
    wrapper.append(term, description);

    return wrapper;
}

function formatCreatedDate(value) {
    if (!value) {
        return "Unknown";
    }

    const normalizedValue = value.includes("T")
        ? value
        : value.replace(" ", "T");
    const date = new Date(normalizedValue);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function normalizePhoneNumber(value) {
    const trimmedValue = value.trim();

    if (!/^[0-9()\-\s]+$/.test(trimmedValue)) {
        return null;
    }

    const digits = trimmedValue.replace(/\D/g, "");

    if (digits.length !== 10) {
        return null;
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatPhoneNumber(value) {
    if (!value) {
        return value;
    }

    return normalizePhoneNumber(String(value)) || value;
}

function normalizeSearchQuery(value) {
    const trimmedValue = value.trim();

    if (!/^[0-9()\-\s]+$/.test(trimmedValue)) {
        return trimmedValue;
    }

    const digits = trimmedValue.replace(/\D/g, "");

    return digits ? digits.split("").join("%") : trimmedValue;
}

function setAddMessage(message, type = "") {
    addContactMessage.textContent = message;
    addContactMessage.classList.remove("error", "success");

    if (type) {
        addContactMessage.classList.add(type);
    }
}

function openAddDialog() {
    addContactForm.reset();
    setAddMessage("");
    addContactDialog.showModal();
    addFirstName.focus();
}

function closeAddDialog() {
    if (!addInProgress && addContactDialog.open) {
        addContactDialog.close();
    }
}

function setEditMessage(message, type = "") {
    editContactMessage.textContent = message;
    editContactMessage.classList.remove("error", "success");

    if (type) {
        editContactMessage.classList.add(type);
    }
}

function openEditDialog(contact) {
    contactBeingEdited = contact;
    editFirstName.value = contact.FirstName || "";
    editLastName.value = contact.LastName || "";
    editPhone.value = contact.Phone || "";
    editEmail.value = contact.Email || "";
    setEditMessage("");
    editContactDialog.showModal();
    editFirstName.focus();
}

function closeEditDialog() {
    editContactDialog.close();
}

function setDeleteMessage(message, type = "") {
    deleteContactMessage.textContent = message;
    deleteContactMessage.classList.remove("error", "success");

    if (type) {
        deleteContactMessage.classList.add(type);
    }
}

function openDeleteDialog(contact) {
    const fullName = `${contact.FirstName || ""} ${contact.LastName || ""}`.trim();

    contactBeingDeleted = contact;
    deleteContactName.textContent = fullName || "this contact";
    setDeleteMessage("");
    deleteContactDialog.showModal();
    cancelDeleteButton.focus();
}

function closeDeleteDialog() {
    if (!deleteInProgress && deleteContactDialog.open) {
        deleteContactDialog.close();
    }
}

function createContactCard(contact) {
    const listItem = document.createElement("li");
    const card = document.createElement("article");
    const heading = document.createElement("h2");
    const details = document.createElement("dl");
    const actions = document.createElement("div");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    const fullName = `${contact.FirstName || ""} ${contact.LastName || ""}`.trim();

    card.className = "dashboard-contact-card";
    heading.textContent = fullName || "Unnamed contact";
    details.className = "contact-details";
    details.append(
        createContactDetail("Email", contact.Email),
        createContactDetail("Phone", formatPhoneNumber(contact.Phone)),
        createContactDetail("Created", formatCreatedDate(contact.DateCreated))
    );

    actions.className = "contact-actions";

    editButton.className = "secondary-button";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.dataset.contactId = contact.ID;
    editButton.setAttribute("aria-label", `Edit ${fullName || "contact"}`);
    editButton.addEventListener("click", function () {
        openEditDialog(contact);
    });

    deleteButton.className = "danger-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.contactId = contact.ID;
    deleteButton.setAttribute("aria-label", `Delete ${fullName || "contact"}`);
    deleteButton.addEventListener("click", function () {
        openDeleteDialog(contact);
    });

    actions.append(editButton, deleteButton);
    card.append(heading, details, actions);
    listItem.append(card);

    return listItem;
}

function renderContacts(contacts) {
    contactList.replaceChildren();

    if (contacts.length === 0) {
        if (dashboardState.query) {
            setContactStatus(`No contacts found for "${dashboardState.query}".`);
        } else {
            setContactStatus("You do not have any contacts yet.");
        }

        return;
    }

    const fragment = document.createDocumentFragment();

    contacts.forEach(function (contact) {
        fragment.append(createContactCard(contact));
    });

    contactList.append(fragment);
    setContactStatus("");
}

function updatePagination(paginationData) {
    dashboardState.page = paginationData.page;
    dashboardState.totalPages = paginationData.totalPages;

    if (paginationData.totalPages <= 1) {
        pagination.classList.add("hidden");
        return;
    }

    pagination.classList.remove("hidden");
    previousPageButton.disabled = paginationData.page <= 1;
    nextPageButton.disabled = paginationData.page >= paginationData.totalPages;
    pageSummary.textContent = `Page ${paginationData.page} of ${paginationData.totalPages}`;
}

async function loadContacts(page = 1, query = dashboardState.query) {
    if (activeRequest) {
        activeRequest.abort();
    }

    const requestController = new AbortController();
    activeRequest = requestController;
    dashboardState.query = query;

    setContactStatus(query ? "Searching contacts..." : "Loading contacts...");
    contactList.replaceChildren();
    contactList.setAttribute("aria-busy", "true");
    pagination.classList.add("hidden");
    searchButton.disabled = true;
    clearSearchButton.disabled = true;

    try {
        const data = await apiPost("LAMPAPI/SearchContact.php", {
            query: normalizeSearchQuery(query),
            page: page,
            limit: dashboardState.limit
        }, { signal: requestController.signal });

        if (!Array.isArray(data.data) || !data.pagination) {
            throw new Error("The server returned an unexpected response.");
        }

        renderContacts(data.data);
        updatePagination(data.pagination);
        return true;
    } catch (error) {
        if (error instanceof ApiAuthError) {
            return false;
        }

        if (error instanceof DOMException && error.name === "AbortError") {
            return false;
        }

        const message = error instanceof Error
            ? error.message
            : "Unable to load contacts.";

        setContactStatus(message, "error");
        return false;
    } finally {
        if (activeRequest === requestController) {
            activeRequest = null;
            contactList.setAttribute("aria-busy", "false");
            searchButton.disabled = false;
            clearSearchButton.disabled = false;
        }
    }
}

addContactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const newContact = {
        FirstName: addFirstName.value.trim(),
        LastName: addLastName.value.trim(),
        Phone: addPhone.value.trim(),
        Email: addEmail.value.trim()
    };

    if (!newContact.FirstName || !newContact.LastName ||
        !newContact.Phone || !newContact.Email) {
        setAddMessage("Please complete every field.", "error");

        if (!newContact.FirstName) {
            addFirstName.focus();
        } else if (!newContact.LastName) {
            addLastName.focus();
        } else if (!newContact.Phone) {
            addPhone.focus();
        } else {
            addEmail.focus();
        }

        return;
    }

    if (!emailPattern.test(newContact.Email)) {
        setAddMessage("Enter a valid email address.", "error");
        addEmail.focus();
        return;
    }

    const normalizedPhone = normalizePhoneNumber(newContact.Phone);

    if (!normalizedPhone) {
        setAddMessage("Enter a 10-digit phone number.", "error");
        addPhone.focus();
        return;
    }

    newContact.Phone = normalizedPhone;

    addInProgress = true;
    setAddMessage("Adding contact...");
    saveContactButton.disabled = true;
    cancelAddButton.disabled = true;
    closeAddDialogButton.disabled = true;

    try {
        const data = await apiPost("LAMPAPI/AddContact.php", newContact);

        addInProgress = false;
        closeAddDialog();

        const contactsReloaded = await loadContacts(1, dashboardState.query);

        if (contactsReloaded) {
            setContactStatus(data.message || "Contact added successfully.", "success");
        }
    } catch (error) {
        if (error instanceof ApiAuthError) {
            return;
        }

        const message = error instanceof Error
            ? error.message
            : "Unable to add this contact.";

        setAddMessage(message, "error");
    } finally {
        addInProgress = false;
        saveContactButton.disabled = false;
        cancelAddButton.disabled = false;
        closeAddDialogButton.disabled = false;
    }
});

addContactButton.addEventListener("click", openAddDialog);
closeAddDialogButton.addEventListener("click", closeAddDialog);
cancelAddButton.addEventListener("click", closeAddDialog);

addContactDialog.addEventListener("click", function (event) {
    if (event.target === addContactDialog) {
        closeAddDialog();
    }
});

addContactDialog.addEventListener("cancel", function (event) {
    if (addInProgress) {
        event.preventDefault();
    }
});

addContactDialog.addEventListener("close", function () {
    addContactForm.reset();
    setAddMessage("");
});

editContactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!contactBeingEdited) {
        setEditMessage("Unable to identify this contact. Please close the form and try again.", "error");
        return;
    }

    const updatedContact = {
        ID: Number(contactBeingEdited.ID),
        FirstName: editFirstName.value.trim(),
        LastName: editLastName.value.trim(),
        Phone: editPhone.value.trim(),
        Email: editEmail.value.trim()
    };

    if (!updatedContact.FirstName || !updatedContact.LastName ||
        !updatedContact.Phone || !updatedContact.Email) {
        setEditMessage("Please complete every field.", "error");

        if (!updatedContact.FirstName) {
            editFirstName.focus();
        } else if (!updatedContact.LastName) {
            editLastName.focus();
        } else if (!updatedContact.Phone) {
            editPhone.focus();
        } else {
            editEmail.focus();
        }

        return;
    }

    if (!emailPattern.test(updatedContact.Email)) {
        setEditMessage("Enter a valid email address.", "error");
        editEmail.focus();
        return;
    }

    const normalizedPhone = normalizePhoneNumber(updatedContact.Phone);

    if (!normalizedPhone) {
        setEditMessage("Enter a 10-digit phone number.", "error");
        editPhone.focus();
        return;
    }

    updatedContact.Phone = normalizedPhone;

    setEditMessage("Saving changes...");
    saveEditButton.disabled = true;
    cancelEditButton.disabled = true;
    closeEditDialogButton.disabled = true;

    try {
        const data = await apiPost("LAMPAPI/EditContact.php", updatedContact);

        closeEditDialog();

        const contactsReloaded = await loadContacts(
            dashboardState.page,
            dashboardState.query
        );

        if (contactsReloaded) {
            setContactStatus(data.message || "Contact updated successfully.", "success");
        }
    } catch (error) {
        if (error instanceof ApiAuthError) {
            return;
        }

        const message = error instanceof Error
            ? error.message
            : "Unable to save this contact.";

        setEditMessage(message, "error");
    } finally {
        saveEditButton.disabled = false;
        cancelEditButton.disabled = false;
        closeEditDialogButton.disabled = false;
    }
});

closeEditDialogButton.addEventListener("click", closeEditDialog);
cancelEditButton.addEventListener("click", closeEditDialog);

editContactDialog.addEventListener("click", function (event) {
    if (event.target === editContactDialog) {
        closeEditDialog();
    }
});

editContactDialog.addEventListener("close", function () {
    contactBeingEdited = null;
    editContactForm.reset();
    setEditMessage("");
});

deleteContactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!contactBeingDeleted) {
        setDeleteMessage("Unable to identify this contact. Please close the dialog and try again.", "error");
        return;
    }

    const contactID = Number(contactBeingDeleted.ID);
    const deletedContactName = deleteContactName.textContent;
    const pageAfterDelete = contactList.children.length === 1 && dashboardState.page > 1
        ? dashboardState.page - 1
        : dashboardState.page;

    deleteInProgress = true;
    setDeleteMessage("Deleting contact...");
    confirmDeleteButton.disabled = true;
    cancelDeleteButton.disabled = true;
    closeDeleteDialogButton.disabled = true;

    try {
        const data = await apiPost("LAMPAPI/DeleteContact.php", { ID: contactID });

        deleteInProgress = false;
        closeDeleteDialog();

        const contactsReloaded = await loadContacts(
            pageAfterDelete,
            dashboardState.query
        );

        if (contactsReloaded) {
            setContactStatus(
                data.message || `${deletedContactName} was deleted successfully.`,
                "success"
            );
        }
    } catch (error) {
        if (error instanceof ApiAuthError) {
            return;
        }

        const message = error instanceof Error
            ? error.message
            : "Unable to delete this contact.";

        setDeleteMessage(message, "error");
    } finally {
        deleteInProgress = false;
        confirmDeleteButton.disabled = false;
        cancelDeleteButton.disabled = false;
        closeDeleteDialogButton.disabled = false;
    }
});

closeDeleteDialogButton.addEventListener("click", closeDeleteDialog);
cancelDeleteButton.addEventListener("click", closeDeleteDialog);

deleteContactDialog.addEventListener("click", function (event) {
    if (event.target === deleteContactDialog) {
        closeDeleteDialog();
    }
});

deleteContactDialog.addEventListener("cancel", function (event) {
    if (deleteInProgress) {
        event.preventDefault();
    }
});

deleteContactDialog.addEventListener("close", function () {
    contactBeingDeleted = null;
    setDeleteMessage("");
});

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const query = searchInput.value.trim();
    clearSearchButton.classList.toggle("hidden", query === "");
    loadContacts(1, query);
});

searchInput.addEventListener("input", function () {
    if (searchInput.value.trim() !== "") {
        return;
    }

    clearSearchButton.classList.add("hidden");

    if (dashboardState.query !== "") {
        loadContacts(1, "");
    }
});

clearSearchButton.addEventListener("click", function () {
    searchInput.value = "";
    clearSearchButton.classList.add("hidden");
    searchInput.focus();
    loadContacts(1, "");
});

previousPageButton.addEventListener("click", function () {
    if (dashboardState.page > 1) {
        loadContacts(dashboardState.page - 1, dashboardState.query);
    }
});

nextPageButton.addEventListener("click", function () {
    if (dashboardState.page < dashboardState.totalPages) {
        loadContacts(dashboardState.page + 1, dashboardState.query);
    }
});

loadContacts();
