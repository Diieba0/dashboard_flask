// contient les articles de presse, qui doivent être
// gardés en mémoire même après affichage du graphique

var debat_data;

// Chargement des reponses du debat
$.ajax({
    url: "/api/debat",
    success: display_debat
});

function display_debat(result1) {
    debat_data = result1["data"];
    display_bargraph(debat_data)
}

function display_bargraph(debat_data) {

    var identifies;
    identifies = debat_data['non'];

    var anonymes;
    anonymes = debat_data['oui'];

    Highcharts.chart('debat', {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Participants Anonymes'
        },

        xAxis: {
            categories: ['Participants'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ''
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Anonymes',
            data: [anonymes]
        }, {
            name: 'Identifiés',
            data: [identifies]
        }]
    });
}

// Chargement des themes
var themes_data;
themes_data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
display_themes(themes_data)

function display_themes(themes) {
    var div = $("#tableauThemes").html("");
    div.append("<table></table");
    console.log(div)
    var tab = $("#tableauThemes table");
    for (i in themes) {
        var theme = themes[i];
        var newLine = "<tr><td class='newspaper'>" + theme + "</td></tr>"
        console.log(newLine)
        tab.append(newLine);
    }
}


// Chargement du nbr de participants par ville
display_participants()

function display_participants() {
    Highcharts.chart('participants', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Nombre de participants par ville'
    },

    xAxis: {
        type: 'category',
        labels: {
            rotation: -45,
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Population (millions)'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: ''
    },
    series: [{
        name: 'Population',
        data: [
            ['Tokyo', 37.33],
            ['Delhi', 31.18],
            ['Shanghai', 27.79],
            ['Sao Paulo', 22.23],
            ['Mexico City', 21.91],
            ['Dhaka', 21.74],
            ['Cairo', 21.32],
            ['Beijing', 20.89],
            ['Mumbai', 20.67],
            ['Osaka', 19.11],
            ['Karachi', 16.45],
            ['Chongqing', 16.38],
            ['Istanbul', 15.41],
            ['Buenos Aires', 15.25],
            ['Kolkata', 14.974],
            ['Kinshasa', 14.970],
            ['Lagos', 14.86],
            ['Manila', 14.16],
            ['Tianjin', 13.79],
            ['Guangzhou', 13.64]
        ],
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]
});
}

/*
$.ajax({
    url: "/api/themes/",
    success: display_themes()
});

var themes_data;

function display_all_themes() {
    var all_themes = []
    for (i = 0; i < themes_data['themes'].length; i++)
        all_themes.push(i);
}*/
