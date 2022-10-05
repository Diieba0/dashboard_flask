// contient les articles de presse, qui doivent être
// gardés en mémoire même après affichage du graphique
var news_data;
var debat_data;


// Palette de couleurs utilisée par tous les graphiques
var colors = ["#c503fa", "#d259f5", "#e09ef3", "#f1d4fa", "#838080FF"];

// Chargement des articles de presse
$.ajax({
    url: "/api/news",
    success: display_news
});

function display_news(result) {
    news_data = result["data"];
    display_wordcloud(news_data);
    display_all_articles();
}

function display_wordcloud(news_data) {

    var data = [];

    var keywords = news_data["keywords"];

    for (i in keywords) {
        data.push({
            name: keywords[i]["word"],
            weight: keywords[i]['cnt'],
            events: {
                click: function (event) {
                    var keyword = event.point.name;
                    display_articles_from_word(keyword);
                }
            }
        })
    }
    console.log("Voici les données formatées pour Highcharts :", data);

    Highcharts.chart('nuage', {
        series: [{
            type: 'wordcloud',
            data: data,
            name: 'Occurrences',
            colors:
            colors,
            rotation: {
                from: -60,
                to: 60,
                orientations: 8
            },
        }],
        title: {
            text: 'Actualité : nuage de mots'
        },
        chart: {
            backgroundColor: 'None'
        }
    });
}

function display_all_articles() {
    var all_articles = []
    for (i = 0; i < news_data['articles'].length; i++)
        all_articles.push(i);
    display_articles(all_articles);
}

function display_articles_from_word(word) {
    var articles;
    for (i in news_data['keywords']) {
        if (news_data['keywords'][i]['word'] === word) {
            articles = news_data['keywords'][i]['articles'];
            break;
        }
    }
    display_articles(articles);
}

function display_articles(articles) {
    var div = $("#tableauArticles").html("");
    div.append("<table></table");
    var tab = $("#tableauArticles table");
    for (i in articles) {
        var article = news_data['articles'][articles[i]];
        var title = article["title"];
        var source = article["source"];
        var url = article["url"];
        var newLine = "<tr><td class='newspaper'>" + source + "</td><td><a target='_blank' href='" + url + "'>" + title + "</a></td></tr>"
        tab.append(newLine);
    }
}


// Chargement des données météo
d3.json('/api/meteo', display_nvd3_graph);

function display_nvd3_graph(data) {

    if (data["status"] === "ok") {
        var temperature_data = [{
            key: 'Température',
            values: data["data"]
        }]

        var first_date = temperature_data[0]['values'][0][0];

        nv.addGraph(function () {

            var chart = nv.models.lineWithFocusChart()
                .x(function (d) {
                    return d[0]
                })
                .y(function (d) {
                    return d[1]
                })
                .yDomain([-5, 35])
                .height(270)
                .color(colors);

            chart.brushExtent([new Date(first_date), new Date(first_date + 24 * 3600 * 1000)]); // 24*3600*1000ms = 1jour

            chart.xAxis
                .showMaxMin(false)
                .tickFormat(function (d) {
                    return d3.time.format('%H:00 (%a)')(new Date(d))
                });

            chart.x2Axis
                .showMaxMin(false)
                .tickFormat(function (d) {
                    return d3.time.format('%a %-d/%-m')(new Date(d))
                });

            chart.yAxis //Chart y-axis settings
                .showMaxMin(false)
                .axisLabel('Température (°c)')
                .tickFormat(d3.format('.00f'));

            chart.y2Axis
                .showMaxMin(false)
                .ticks(false);

            d3.select('#meteo svg')
                .datum(temperature_data)
                .call(chart);

            //Update the chart when window resizes.
            nv.utils.windowResize(chart.update);

            return chart;
        });
    }
}


// Chargement des reponses du debat
$.ajax({
    url: "/api/debat/",
    success: display_debat
});

function display_debat(result1) {
    console.log(result1);
    debat_data = result1["data"];
    display_bargraph(debat_data)
}

function display_bargraph(participants) {
    if (participants["status"] === "ok") {
        var data = [{
            anonymes: participants["oui"],
            identifies: participants["non"],
        }]
    }

    Highcharts.chart("debat", {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Participants Anonymes'
        },

        series: [{
            name: 'Anonymes',
            data: data["anonymes"]
        }, {
            name: 'Identifies',
            data: data["identifies"]
        }],

        xAxis: {
            categories: ['', '',],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: null,
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ' participants'
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
    });
}