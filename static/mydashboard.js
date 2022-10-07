// contient les articles de presse, qui doivent être
// gardés en mémoire même après affichage du graphique

// Chargement des reponses du debat
$.ajax({
    url: "/api/debat",
    success: display_debat
});

var debat_data;

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


// chargement des différents themes abordés lors des autres réunions

$.ajax({
    url: "/api/themes/",
    success: display_themes
});

var themes_data;

function display_themes(result2) {
    themes_data = result2["data"];
    display_all_themes(themes_data);
}

function display_all_themes(themes_data) {
    var div = $("#themes").html("");
    div.append("<table></table");
    var tab = $("#themes table");
    var en_tete = "<thead><tr><th class='newspaper'>" + "les differents thèmes abordés" + "</th></tr></thead>"
    tab.append(en_tete)
    for (var i in themes_data['themes']) {
        var theme = themes_data["themes"][i];
        var newLine = "<tr><td class='newspaper'>" + theme + "</td></tr>"
        tab.append(newLine);
    }
}


// chargement nrb participants en fonction de la ville
$.ajax({
    url: "/api/participation/",
    success: display_participation
});

var participation_data;

function display_participation(result3) {
    participation_data = result3["data"];
    display_participants(participation_data);
}

function display_participants(participation_data) {

    var participation = participation_data["participation"];
    var affichage = []

    for (var i = 0; i <= 99; i++) {
        affichage.push(participation[i])
    }
    console.log(affichage)

    Highcharts.chart('participation', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Nombre de participants par ville'
        },

        series: [{
            name: 'Participants',
            data: affichage,
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
        }],

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
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: ''
        },
    });
}