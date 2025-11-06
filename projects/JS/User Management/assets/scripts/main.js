class User {
    constructor(username, email, password, isAdmin = false) {
        this.id = Date.now();
        this.username = username;
        this.email = email;
        this.password = password;

        this.isAdmin = isAdmin;
    }
}

class UserManager {
    constructor() {
        this.users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];
    }

    register(username, email, password, isAdmin = false) {
        let newUser = new User(username, email, password, isAdmin);
        this.users.push(newUser);

        localStorage.setItem("users", JSON.stringify(this.users));
        sessionStorage.setItem("loggedInUser", JSON.stringify(newUser));
        window.location.href = "./userManagement.html";
    }

    login(email, password) {
        let user = this.users.find(user => user.email === email && user.password === password);

        if (user) {
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));
            window.location.href = "./userManagement.html";
        } else {
            alert("Invalid email or password");
        }
    }

    removeUser(id) {
        this.users = this.users.filter(user => user.id !== id);

        localStorage.setItem("users", JSON.stringify(this.users));
    }
}

const userManager = new UserManager();

function registerUser() {
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (username && email && password) {
        if (userManager.users.find(user => user.email === email)) {
            alert("User already exists");
        } else {
            userManager.register(username, email, password);
        }
    }
}

function loginUser() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    if (email && password) {
        userManager.login(email, password);
    } else {
        alert("Please enter email and password");
    }
}

window.onload = () => {
    if (sessionStorage.getItem("loggedInUser")) {
        window.location.href = "./userManagement.html";
    }
}