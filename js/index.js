/**
 * Created by nikhil on 4/22/2017.
 */
var txtsignInEmail = document.getElementById('emailAddress');
var txtregisterEmail = document.getElementById('emailAddress2');
var txtsignInPassword = document.getElementById('password');
var txtregisterPassword = document.getElementById('password2');
var txtregisterPassword2 = document.getElementById('password3');
var txtregisterRole = document.getElementById('role');
var btnsignin = document.getElementById('login');
var btnregister = document.getElementById('register');
var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (currentUser === null) {
    currentUser = null;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
}
var reports = JSON.parse(sessionStorage.getItem('reports'));
if (reports === null) {
    reports = [];
    sessionStorage.setItem('reports', JSON.stringify(reports));
}
var users = JSON.parse(sessionStorage.getItem('users'));
if (users === null) {
    users = [];
}

function User(email, password, role, name, address) {
    this.email = email;
    this.pass = password;
    this.userRole = role;
    this.name = name;
    this.address = address;
}

function verifyPass() {
    if (txtregisterPassword.value === txtregisterPassword2.value) {
        return true;
    } else {
        document.getElementById('retypePass').innerHTML += " - Passwords do not match!";
        document.getElementById('retypePass').focus();
    }
}

$('#register').click(function(){
    if (verifyPass()) {
        var email = txtregisterEmail.value;
        var pass = txtregisterPassword.value;
        var role = txtregisterRole.value;
        var novel = true;
        users.forEach(function (user) {
            if (user.email === email) {
                novel = false;
            }
        });
        if (novel) {
            currentUser = new User(email, pass, role, email, 'N/A');
            users.push(currentUser);
            console.log("Created you" + currentUser.userRole);
            sessionStorage.setItem('users', JSON.stringify(users));
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = "main.html";
        } else {
            document.getElementById('emailLabel2').innerHTML = "Email Address - User already exists!";
            document.getElementById('emailLabel2').focus();
            console.log("User already exists");
        }
    } else {
        console.log("Passwords do not match!");
    }
});
//
// $('#register').click(function(){
//     if (verifyPass()) {
//         const email = txtregisterEmail.value;
//         const pass = txtregisterPassword.value;
//         const auth = firebase.auth();
//         const promise = auth.createUserWithEmailAndPassword(email, pass);
//         promise.catch(function (e) {
//             console.log(e.message);
//             return;
//         });
//         console.log("Created you");
//         // window.location.href = "main.html";
//     } else {
//         console.log("Passwords do not match!");
//     }
// });
$('#login').click(function(){
    var email = txtsignInEmail.value;
    var pass = txtsignInPassword.value;
    var role;
    if (currentUser === null) {
        role = 'N/A';
    } else {
        role = currentUser.userRole;
    }
    var auth = false;
    users.forEach(function (user) {
        if (user.email === email && user.pass == pass) {
            auth = true;
        }
    });
    if (auth) {
        currentUser = new User(email, pass, role, email, 'N/A');
        users.push(currentUser);
        console.log("Logged you in!" + currentUser);
        sessionStorage.setItem('users',JSON.stringify(users));
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = "main.html";
    } else {
        document.getElementById('emailLabel').innerHTML = "Email Address - User does not exist";
        document.getElementById('emailLabel').focus();
        console.log('User doesnot exist');
    }
});
// $('#login').click(function(){
//     const email = txtsignInEmail.value;
//     const pass = txtsignInPassword.value;
//     const auth = firebase.auth();
//     const promise = auth.signInWithEmailAndPassword(email,pass);
//     promise.catch(function(e) {
//         console.log(e.message);
//         return;
//     });
//     console.log("Logged you in!");
//     window.location.href="main.html";
// });
// $('#logOut').click(function () {
//     firebase.auth().signOut();
//     window.location.href='index.html'
// });

// firebase.auth().onAuthStateChanged(firebaseUser =>  {
//     if (firebaseUser) {
//         console.log(firebaseUser);
//         // newUser = new User()
//     } else {
//         console.log("Not Logged In")
//     }
// });

