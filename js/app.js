/**
 * Created by nikhil on 4/23/2017.
 */
var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
var users = JSON.parse(sessionStorage.getItem('users'));
var reports = JSON.parse(sessionStorage.getItem('reports'));
if (reports === null) {
    reports = [];
}

$(document).ready(function() {
    if (currentUser.userRole === "User") {
        document.getElementById('purityReport').style.display = 'none';
        document.getElementById('historicalReport').style.display = 'none';
    }
    if (currentUser.userRole === "Worker") {
        document.getElementById('historicalReport').style.display = 'none';
    }
});
function SourceReport(email, waterType, waterCondition, latitude, longitude) {
    this.authorEmail = email;
    this.timeS = new Date();
    this.latitude = latitude;
    this.longitude = longitude;
    this.waterType = waterType;
    this.waterCondition = waterCondition;
}
function PurityReport(email, waterCondition, virus, contaminant, latitude, longitude) {
    this.authorEmail = email;
    this.timeS = new Date();
    this.latitude = latitude;
    this.longitude = longitude;
    this.waterCondition = waterCondition;
    this.virus = virus;
    this.contaminant = contaminant;
}
$(document).ready(function () {
    document.getElementById('descrp').innerHTML += currentUser.name;
});

$('#editProfileSubmit').click(function () {
    currentUser.name = document.getElementById('editName').value;
    currentUser.address = document.getElementById('editAddress').value;
    console.log(currentUser);
    removeCurrentUser();
    // sessionStorage.removeItem('currentUser');
    // sessionStorage.removeItem('users');
    users.push(currentUser);
    sessionStorage.setItem('currentUser',JSON.stringify(currentUser));
    sessionStorage.setItem('users',JSON.stringify(users));


});

$('#reportsList').click(function () {
    document.getElementById('listOfReports').innerHTML = "";
    reports.forEach(function (item) {
        document.getElementById('listOfReports').innerHTML += "Created by: " + item.authorEmail + " on " + item.timeS + " at " + item.latitude + "," + item.longitude+ " </br>";
    })
})

$('#createSourceReport').click(function () {
    var waterType = document.getElementById('waterType').value;
    var waterCondition = document.getElementById('waterCondition').value;
    var lat = Number(document.getElementById('lat1').value);
    var long = Number(document.getElementById('long1').value);
    var report = new SourceReport(currentUser.email, waterType, waterCondition, lat, long);
    console.log(report);
    reports.push(report);
    sessionStorage.setItem('reports',JSON.stringify(reports));
    $('#myModalSource').modal('hide');
    window.location = window.location.href;
    console.log("Refreshed?")

});
$('#createPurityReport').click(function () {
    var waterCondition = document.getElementById('waterCondition2').value;
    var lat = Number(document.getElementById('lat2').value);
    var long = Number(document.getElementById('long2').value);
    var virus = Number(document.getElementById('virusPPM').value);
    var contaminant = Number(document.getElementById('contaminantPPM').value);
    var report = new PurityReport(currentUser.email, waterCondition, virus, contaminant, lat, long);
    console.log(report);
    reports.push(report);
    sessionStorage.setItem('reports',JSON.stringify(reports));
    $('#myModalPurity').modal('hide');
    window.location.href = window.location.href;
    console.log("Refreshed?")
});

function removeCurrentUser() {
    users.forEach(function (item) {
        if (item.email === currentUser.email) {
            var index = users.indexOf(item);
            users.splice(index, 1);
        }
    })
}
$('#logOut').click(function () {
    console.log("logged you out bithc");
    currentUser = null;
    window.location.href = 'index.html';
});


console.log(reports);
console.log(JSON.parse(sessionStorage.getItem('currentUser')));