let loggedUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
let users = JSON.parse(localStorage.getItem("users"));

if (!loggedUser) {
    window.location.href = "./index.html";
}

let welcomeUsername = document.getElementById("username");
let userTableBody = document.getElementById("userTableBody");

welcomeUsername.innerText = loggedUser.username;

function loadUsers() {
    userTableBody.innerHTML = "";
    users = JSON.parse(localStorage.getItem("users"));

    for (let user of users) {
        let row = document.createElement("tr");
        let idCell = document.createElement("td");
        let usernameCell = document.createElement("td");
        let emailCell = document.createElement("td");
        let actionsCell = document.createElement("td");
    
        idCell.innerText = user.id;
        usernameCell.innerText = user.username;
        emailCell.innerText = user.email;
        actionsCell.innerHTML = `
            <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            <button class="btn btn-primary" onclick="editAndSaveUser(${user.id})">Edit</button>
        `;
    
        row.appendChild(idCell);
        row.appendChild(usernameCell);
        row.appendChild(emailCell);
        row.appendChild(actionsCell);
    
        userTableBody.appendChild(row);
    }
}

window.onload = loadUsers;

if (loggedUser.isAdmin) {
    welcomeUsername.innerText += " (Admin)";
    welcomeUsername.style.color = "red";
}

function logout() {
    sessionStorage.removeItem("loggedInUser");

    window.location.href = "./index.html";
}

function deleteUser(id) {
    if (!loggedUser) {
        return;
    }

    if (!loggedUser.isAdmin) {
        showAlert("warning", "You are not authorized to delete users");

        return;
    }

    let retrievedUsers = JSON.parse(localStorage.getItem("users"));
    retrievedUsers = retrievedUsers.filter(user => user.id !== id);

    localStorage.setItem("users", JSON.stringify(retrievedUsers));

    if (loggedUser.id === id) {
        logout();
    }

    loadUsers();

    showAlert("info", "User has been deleted successfully");
}

function editAndSaveUser(id) {
    if (!loggedUser) {
        return;
    }

    if (!loggedUser.isAdmin) {
        showAlert("warning", "You are not authorized to edit users");
        return;
    }

    let retrievedUsers = JSON.parse(localStorage.getItem("users"));
    let userToEdit = retrievedUsers.find(user => user.id === id);

    if (userToEdit) {
        let editUserModal = new bootstrap.Modal(document.getElementById("editUserModal"));
        editUserModal.show();

        document.getElementById("editUsername").value = userToEdit.username;
        document.getElementById("editEmail").value = userToEdit.email;
        document.getElementById("editIsAdmin").checked = userToEdit.isAdmin;

        document.getElementById("saveChangesButton").onclick = function() {
            const editUsername = document.getElementById("editUsername").value.trim();
            const editEmail = document.getElementById("editEmail").value.trim();
            const editIsAdmin = document.getElementById("editIsAdmin").checked;

            if (!editUsername || !editEmail) {
                showAlert("warning", "Username and Email cannot be empty");
                return;
            }

            if (userToEdit.username !== editUsername || userToEdit.email !== editEmail || userToEdit.isAdmin !== editIsAdmin) {
                userToEdit.username = editUsername;
                userToEdit.email = editEmail;
                userToEdit.isAdmin = editIsAdmin;
            }

            const updatedUsers = retrievedUsers.map(user => user.id === userToEdit.id ? userToEdit : user);
            localStorage.setItem("users", JSON.stringify(updatedUsers));
            loadUsers();
            showAlert("success", "User has been edited successfully");

            const modalElement = document.getElementById("editUserModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();

            if (loggedUser.id === userToEdit.id) {
                sessionStorage.setItem("loggedInUser", JSON.stringify(userToEdit));

                window.location.reload();
            }
        };
    }
}

function showAlert(alertType, alertMessage) {
    let alertNotification = document.getElementById("alertNotification");

    if (alertNotification && alertNotification.style.display === "block") {
        return;
    }

    switch (alertType) {
        case "success":
            alertNotification.classList = "alert alert-success";
            break;
        
        case "danger":
            alertNotification.classList = "alert alert-danger";
            break;

        case "warning":
            alertNotification.classList = "alert alert-warning";
            break;

        case "info":
            alertNotification.classList = "alert alert-info";
            break;
    
        default:
            break;
    }

    alertNotification.innerText = alertMessage;
    alertNotification.classList.add("animate__animated", "animate__fadeInDown");
    alertNotification.style.display = "block";

    setTimeout(() => {
        alertNotification.classList.add("animate__animated", "animate__fadeOutUp");
        
        setTimeout(() => {
            alertNotification.style.display = "none";
            alertNotification.innerText = "";
        }, 2000);
    }, 3000);
}
