let weather = [];
let seedButton = document.getElementById("seed");
let addRecordButton = document.getElementById("add");
let inputTemp = document.getElementById("temperature");
let inputDate = document.getElementById("date");
var ctx = document.getElementById("myChart");

/////////////////RANDOM DATA//////////////////////

//Year 2020
function generateRandomDate() {
    let start = new Date(2020, 0, 1);
    let end = new Date();
    let date = new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

//Between -30 and 50
function generateRandomTemp() {
    return Math.floor(Math.random() * (50 - -30)) + -30;
}

function generateRandomObjects() {
    weatherArr = [];
    for (let i = 0; i < 10; i++) {
        weatherArr.push({ date: generateRandomDate(), temp: generateRandomTemp() });
    }
    return weatherArr;
}

//Seed random data to table and chart with Seed Data button
seedButton.addEventListener("click", function(e) {
    e.preventDefault();
    weather = generateRandomObjects();
    populateTable();
    refreshChart();
});

///////////////ADD DATA MANUALLY////////////////
//Generates new object manually since Page
function addNewObject(date, temp) {
    if (date && temp) {
        weather.push({ date: date, temp: temp });
        return weather;
    } else {
        return weather;
    }
}

//Change Table and Chart with Add Record button
addRecordButton.addEventListener("click", function(e) {
    e.preventDefault();

    if (inputDate.value && inputTemp.value) {
        addNewObject(inputDate.value, inputTemp.value);
        populateTable();
        refreshChart();
    }
});

//Change Chart
function refreshChart() {
    let x = weather.map((obj) => {
        return obj.date;
    });
    config.data.labels = x;
    let y = weather.map((obj) => {
        return Number(obj.temp);
    });
    config.data.datasets[0].data = y;

    myLineChart = new Chart(ctx, config); //se carga el chart cada vez que se carga data
}

////////////////////TABLE//////////////////

function populateTable() {
    let table = document.getElementById("resultsTable");
    table.innerHTML = `<thead>
         <tr class="table-head">
          <th>Temperature</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
      </tbody>`;
    console.log(table);
    let tbody = document.querySelector("#resultsTable tbody");
    weather.forEach((obj) => {
        tbody.innerHTML += builtTable(obj);
    });
}

//Creates every row
function builtTable(objectWeather) {
    return `<tr>
    <td>${objectWeather.temp}</td>
    <td>${objectWeather.date}</td>
</tr>`;
}

////////////////////CHART CONFIG//////////////////
//See https: //www.chartjs.org/docs/latest/
//Example in: https://www.chartjs.org/samples/latest/charts/line/basic.html

let config = {
    type: "line",
    data: {
        labels: [], //x
        datasets: [{
            data: [], //y
            label: "Temperature",
            borderColor: "#c45850",
            fill: false,
        }, ],
    },
    options: {
        title: {
            display: true,
            text: "Random Temperature in 2020",
            hover: {
                mode: "nearest",
                intersect: true,
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Date",
                    },
                }, ],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Temperature",
                    },
                }, ],
            },
        },
    },
};