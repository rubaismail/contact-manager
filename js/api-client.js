class ApiAuthError extends Error {
    constructor() {
        super("Not logged in");
        this.name = "ApiAuthError";
    }
}

async function apiPost(endpoint, body, { signal } = {}) {
    let response;

    try {
        response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            signal,
            body: JSON.stringify(body)
        });
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw error;
        }

        throw new Error("Unable to connect to the server.");
    }

    let data;

    try {
        data = await response.json();
    } catch (error) {
        throw new Error("Unable to reach the server. Please try again.");
    }

    if (response.status === 401) {
        window.location.href = "index.html";
        throw new ApiAuthError();
    }

    if (!response.ok || !data.success) {
        throw new Error(data.error || "Something went wrong. Please try again.");
    }

    return data;
}
