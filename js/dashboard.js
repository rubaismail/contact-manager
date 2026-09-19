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

const dashboardState = {
    page: 1,
    limit: 10,
    totalPages: 0,
    query: ""
};

let activeRequest = null;

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
        createContactDetail("Phone", contact.Phone),
        createContactDetail("Created", formatCreatedDate(contact.DateCreated))
    );

    actions.className = "contact-actions";

    editButton.className = "secondary-button";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.disabled = true;
    editButton.dataset.contactId = contact.ID;
    editButton.setAttribute("aria-label", `Edit ${fullName || "contact"}`);

    deleteButton.className = "danger-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.disabled = true;
    deleteButton.dataset.contactId = contact.ID;
    deleteButton.setAttribute("aria-label", `Delete ${fullName || "contact"}`);

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
        const response = await fetch("LAMPAPI/SearchContact.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            signal: requestController.signal,
            body: JSON.stringify({
                query: query,
                page: page,
                limit: dashboardState.limit
            })
        });

        let data;

        try {
            data = await response.json();
        } catch (error) {
            throw new Error("Unable to load contacts. Please try again.");
        }

        if (response.status === 401) {
            window.location.href = "index.html";
            return;
        }

        if (!response.ok || !data.success) {
            throw new Error(data.error || "Unable to load contacts.");
        }

        if (!Array.isArray(data.data) || !data.pagination) {
            throw new Error("The server returned an unexpected response.");
        }

        renderContacts(data.data);
        updatePagination(data.pagination);
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            return;
        }

        const message = error instanceof Error
            ? error.message
            : "Unable to load contacts.";

        setContactStatus(message, "error");
    } finally {
        if (activeRequest === requestController) {
            activeRequest = null;
            contactList.setAttribute("aria-busy", "false");
            searchButton.disabled = false;
            clearSearchButton.disabled = false;
        }
    }
}

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const query = searchInput.value.trim();
    clearSearchButton.classList.toggle("hidden", query === "");
    loadContacts(1, query);
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
