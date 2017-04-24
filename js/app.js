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
function SourceReport(email, waterType, waterCondition, latitude, longitude, type) {
    this.authorEmail = email;
    this.timeS = new Date();
    this.latitude = latitude;
    this.longitude = longitude;
    this.waterType = waterType;
    this.waterCondition = waterCondition;
    this.reportType = type;
}
function PurityReport(email, waterCondition, virus, contaminant, latitude, longitude, type) {
    this.authorEmail = email;
    this.timeS = new Date();
    this.latitude = latitude;
    this.longitude = longitude;
    this.waterCondition = waterCondition;
    this.virus = virus;
    this.contaminant = contaminant;
    this.reportType = type;
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
        document.getElementById('listOfReports').innerHTML += "Created by: " + item.authorEmail + " on " + item.timeS + " at " + item.latitude + "," + item.longitude+ " type: " + item.reportType +" </br>";
    })
})

$('#createSourceReport').click(function () {
    var waterType = document.getElementById('waterType').value;
    var waterCondition = document.getElementById('waterCondition').value;
    var lat = Number(document.getElementById('lat1').value);
    var long = Number(document.getElementById('long1').value);
    var report = new SourceReport(currentUser.email, waterType, waterCondition, lat, long, 'Source');
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
    var report = new PurityReport(currentUser.email, waterCondition, virus, contaminant, lat, long, 'Purity');
    console.log(report);
    reports.push(report);
    sessionStorage.setItem('reports',JSON.stringify(reports));
    $('#myModalPurity').modal('hide');
    window.location.href = window.location.href;
    console.log("Refreshed?")
});

$('#createGraph').click(function () {
    var ppm = document.getElementById('ppm').value;
    var year = document.getElementById('year').value;
    var lat = Number(document.getElementById('lat3').value);
    var long = Number(document.getElementById('long3').value);
    document.getElementById('historyForm').style.display = 'none';
    document.getElementById('createGraph').style.display = 'none';
    document.getElementById('historyGraph').style.display = '';
    var purityReports = [];
    // Getting the purity reports lists
    reports.forEach(function (report) {
        if (report.reportType === 'Purity') {
            var repDate = new Date(report.timeS);
            if (JSON.stringify(repDate.getUTCFullYear()) === year) {
                if (isInRequestedRange(report, lat,long)) {
                    purityReports.push(report);
                }
            }
        }
    });
    // Getting the PPM values per month
    console.log(purityReports);
    var ppmLists = new Array(12);
    for (var i = ppmLists.length-1; i >= 0; -- i) ppmLists[i] = [];
    purityReports.forEach(function (report) {
        var repDate = new Date(report.timeS);
        var month = Number(repDate.getMonth());
        if (ppm === 'Virus') {
            ppmLists[month].push(report.virus);
        } else if (ppm === 'Contaminant') {
            ppmLists[month].push(report.contaminant);
        }
    });
    var ppmData = [];
    ppmLists.forEach(function (mnth) {
        if (mnth.length > 0) {
            ppmData.push((mnth.reduce((a, b) => a + b, 0)) / mnth.length);
        } else {
            ppmData.push(0);
        }
    });
    drawChart(ppm, ppmData);
});

function isInRequestedRange(report, lat, lng) {

    return report.latitude < lat + 10
        && report.latitude > lat - 10
        && report.longitude < lng + 10
        && report.longitude > lng - 10;
}

function closeHistoryGraph() {
    $('#myModalHistory').modal('hide');
    window.location.href = window.location.href;
}

function drawChart(ppm, ppmdata) {
    var ctx = document.getElementById('canvas').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                // fillColor: "rgba(220,220,220,0)",
                label: ppm + ' PPM',
                data: ppmdata,
                // data: [12, 19, 3, 17, 6, 3, 7, 14, 6, 0, 2, 15],
                backgroundColor: "rgba(153,140,251,0.7)",
                // strokeColor: "black",
                pointColor: "rgba(100,90,150,1)",
            }]
        },
        pointDotRadius: 10,
    });
}

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

