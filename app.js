let weather = [];
const seedButton = document.getElementById("seed");
const addRecordButton = document.getElementById("add");
const inputTemp = document.getElementById("temperature");
const inputDate = document.getElementById("date");
const chartContainer = document.getElementById("myChart");
const getMaxButton = document.getElementById("maxTemp");
const getMinButton = document.getElementById("minTemp");
const calcAverageButton = document.getElementById("average");
const results = document.getElementById("results");
const redMsnDate = document.getElementById("red-msn-date");
const redMsnTemp = document.getElementById("red-msn-temp");
const formInput = document.querySelectorAll(".form__input"); //NodeList
const table = document.getElementById("resultsTable");
let myLineChart;

//-------------------UTILS--------------------//

function sortData() {
    return weather.sort((a, b) => {
        return a.date - b.date;
    });
}

function showDataResults(message, style) {
    results.innerHTML = message;
    results.setAttribute("class", style);
}

function hideDataResults() {
    results.innerHTML = "";
}
//clear info and color of inputs(date/temp)
function initialState() {
    redMsnDate.innerHTML = "";
    redMsnTemp.innerHTML = "";
    formInput.forEach((elem) => {
        elem.style.borderColor = "#ddd";
    });
}

//Change format of date for print in screen
function formatDate(date) {
    let month = date.getMonth() + 1 + "";
    if (month.length < 2) {
        month = "0" + month;
    }
    let day = date.getDate() + "";
    if (day.length < 2) {
        day = "0" + day;
    }
    return `${date.getFullYear()}-${month}-${day}`;
}

function refreshAllData() {
    sortData();
    populateTable();
    populateChart();
}

function clearData() {
    location.reload();
}
//-------------------RANDOM-MANUALLY DATA--------------------//

// 2000-2020
function generateRandomDate() {
    let start = new Date(2000, 0, 1);
    let end = new Date();
    let date = new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return date;
}

//Between -30 and 50
function generateRandomTemp() {
    return Math.floor(Math.random() * (50 - -30)) + -30;
}

//Populate array with random data
function generateRandomObjects() {
    weatherArr = [];
    for (let i = 0; i < 10; i++) {
        weatherArr.push({ date: generateRandomDate(), temp: generateRandomTemp() });
    }
    sortData();
    return weatherArr;
}

//Generates new index to weather array manually since page
function addNewRecord(date, temp) {
    if (date && temp) {
        weather.push({
            date: new Date(date),
            temp: Number(temp),
        });
        return weather;
    } else {
        return weather;
    }
}

//-------------------EVENTS--------------------//

//Seed random data to table and chart with Seed Data button
seedButton.addEventListener("click", function(e) {
    e.preventDefault();
    hideDataResults();
    weather = generateRandomObjects();
    initialState();
    refreshAllData();
    createClearButton();
});

//Change Table and Chart with Add Record button
addRecordButton.addEventListener("click", function(e) {
    e.preventDefault();

    hideDataResults();
    initialState();

    if (inputDate.value && inputTemp.value) {
        addNewRecord(inputDate.value, inputTemp.value);
        refreshAllData();
        createClearButton();
        return;
    }
    if (!inputTemp.value) {
        redMsnTemp.innerHTML = "Temperature should be provided, try again!";
        formInput[0].style.borderColor = "red";
    }
    if (!inputDate.value) {
        redMsnDate.innerHTML = "A date sould be provided, try again!";
        formInput[1].style.borderColor = "red";
    }
});

//Calculate max temperature with Get Max Button
getMaxButton.addEventListener("click", function(e) {
    e.preventDefault();

    let tempArray = weather.map((item) => {
        return item.temp;
    });
    if (tempArray.length < 1) {
        showDataResults("Add Record or Seed Data first", "fail");
    } else {
        let max = Math.max(...tempArray);
        showDataResults(`Maximun temperature is ${max}`);
    }
});

//Calculate min temperature with Get Min Button
getMinButton.addEventListener("click", function(e) {
    e.preventDefault();
    let tempArray = weather.map((item) => {
        return item.temp;
    });
    if (tempArray.length < 1) {
        showDataResults("Add Record or Seed Data first", "fail");
    } else {
        let min = Math.min(...tempArray);
        showDataResults(`Minimum temperature is ${min}`);
    }
});

//Calculate average temperature with Calculate Average Button
//Insert average line to chart
calcAverageButton.addEventListener("click", function(e) {
    e.preventDefault();

    let total = 0;
    for (var i = 0; i < weather.length; i++) {
        total += weather[i].temp; //Itero el objeto directa/
    }
    if (weather.length < 1) {
        showDataResults("Add Record or Seed Data first", "fail");
    } else {
        let average = Math.round(total / weather.length);
        showDataResults(`Average temperature is ${average}`);

        //new line to chart
        let averageArr = Array(weather.length).fill(average);
        console.log("averageArr", averageArr);
        chartConfig.data.datasets[1] = {
            data: averageArr,
            label: "Average Temperature",
            borderColor: "green",
            fill: false,
            pointRadius: 0,
        };
        paintChart();
    }
});

//-------------------NEW BUTTON-------------------//
//clear data with new Clear Data Button
function createClearButton() {
    if (document.getElementById("clear")) {
        return;
    }
    let newButton = document.createElement("button");
    let text = document.createTextNode("Clear Data");
    newButton.appendChild(text);
    newButton.setAttribute("class", "form__btn");
    newButton.setAttribute("id", "clear");
    const parent = document.querySelector(".row");
    parent.appendChild(newButton);
    newButton.addEventListener("click", function(e) {
        clearData();
    });
}

//-------------------TABLE-------------------//
function populateTable() {
    table.innerHTML = ` <thead>
                    <tr class = "table-head">
                    <th> Temperature </th> 
                    <th> Date </th> 
                    </tr> 
                    </thead> <tbody>
                    </tbody>`;

    let tbody = document.querySelector("#resultsTable tbody");
    weather.forEach((objectWeather) => {
        tbody.innerHTML += `<tr>
        <td>${objectWeather.temp}</td>
        <td>${formatDate(objectWeather.date)}
         </td> </tr>`;
    });
}

//-------------------CHART-------------------//

function populateChart() {
    let x = weather.map((item) => {
        return formatDate(item.date);
    });
    chartConfig.data.labels = x;
    let y = weather.map((item) => {
        return item.temp;
    });
    chartConfig.data.datasets[0].data = y;

    if (chartConfig.data.datasets[1]) {
        chartConfig.data.datasets.pop();
    }

    paintChart();
}

//Create -update chart
function paintChart() {
    if (!myLineChart) {
        myLineChart = new Chart(chartContainer, chartConfig); //se carga el chart cada vez que se carga data
    } else {
        myLineChart.update();
    }
}

//CHART configuration
//See https: //www.chartjs.org/docs/latest/
//Example in: https://www.chartjs.org/samples/latest/charts/line/basic.html

let chartConfig = {
    type: "line",
    data: {
        labels: [], //x
        datasets: [{
            data: [], //y
            label: "Temperature",
            borderColor: "#c45850",
            fill: false,
            pointHoverRadius: 5,
        }, ],
    },
    options: {
        title: {
            display: true,
            text: "Random Temperature 2000-2020",
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