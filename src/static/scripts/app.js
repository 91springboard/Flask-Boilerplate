/*---LEFT BAR ACCORDION----*/
$(function () {
    $('#nav-accordion').dcAccordion({
        eventType: 'click',
        autoClose: true,
        saveState: true,
        disableLink: true,
        speed: 'slow',
        showCount: false,
        autoExpand: true,
        classExpand: 'dcjq-current-parent'
    });
});

var Script = (function () {

//    sidebar dropdown menu auto scrolling
    $('#sidebar .sub-menu > a').click(function () {
        var o = ($(this).offset());
        var diff = 250 - o.top;
        if (diff > 0) {
            $('#sidebar').scrollTo('-=' + Math.abs(diff), 500);
        }
        else {
            $('#sidebar').scrollTo('+=' + Math.abs(diff), 500);

        }
    });


//    sidebar toggle

    $(function () {
        function responsiveView() {
            var wSize = $(window).width();
            if (wSize <= 768) {
                $('#container').addClass('sidebar-close');
                $('#sidebar > ul').hide();
            }

            if (wSize > 768) {
                $('#container').removeClass('sidebar-close');
                $('#sidebar > ul').show();
            }
        }

        $(window).on('load', responsiveView);
        $(window).on('resize', responsiveView);
    });

    $('.fa-bars').click(function () {
        if ($('#sidebar > ul').is(':visible') === true) {
            $('#main-content').css({
                'margin-left': '0px'
            });
            $('#sidebar').css({
                'margin-left': '-210px'
            });
            $('#sidebar > ul').hide();
            $('#container').addClass('sidebar-closed');
        } else {
            $('#main-content').css({
                'margin-left': '210px'
            });
            $('#sidebar > ul').show();
            $('#sidebar').css({
                'margin-left': '0'
            });
            $('#container').removeClass('sidebar-closed');
        }
    });

// custom scrollbar
    $('#sidebar').niceScroll({
        styler: 'fb',
        cursorcolor: '#4ECDC4',
        cursorwidth: '3',
        cursorborderradius: '10px',
        background: '#404040',
        spacebarenabled: false,
        cursorborder: ''
    });
    $('html').niceScroll({
        styler: 'fb',
        cursorcolor: '#4ECDC4',
        cursorwidth: '6',
        cursorborderradius: '10px',
        background: '#404040',
        spacebarenabled: false,
        cursorborder: '',
        zindex: '1000'
    });


//    tool tips
    $('.tooltips').tooltip();

//    popovers
    $('.popovers').popover();

}());

var chart = c3.generate({
    bindto: '#chart',
    data: {
        columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 50, 20, 10, 40, 15, 25]
        ]
    }
});
var chartWithAdditionalAxis = c3.generate({
    bindto: '#chart_a',
    data: {
        columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 50, 20, 10, 40, 15, 25]
        ],
        axes: {
            data2: 'y2' // ADD
        }
    },
    axis: {
        y2: {
            show: true // ADD
        }
    }
});

var chartStacked = c3.generate({
    bindto: '#chart_stacked',
    data: {
        columns: [
            ['data1', -30, 200, 200, 400, -150, 250],
            ['data2', 130, 100, -100, 200, -150, 50],
            ['data3', -230, 200, 200, -300, 250, 250]
        ],
        type: 'bar',
        groups: [
            ['data1', 'data2', 'data3']
        ]
    },
    grid: {
        y: {
            lines: [{value: 0}]
        }
    }
});


var chart1 = c3.generate({
    bindto: '#chart1',
    data: {
        x: 'x',
        columns: [
            ['x', '2013-01-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01'],
            ['sample', 30, 200, 100, 400, 150],
            ['sample2', 130, 300, 200, 450, 250]
        ]
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%d-%m-%Y'
            }
        }
    },
    zoom: {
        enabled: true,
        onzoom: function (domain) {
            console.log(this, domain);
        }
    }
});

var chart2 = c3.generate({
    bindto: '#chart2',
    data: {
        columns: [
            ['sample', 30, 200, 100, 400, 150],
            ['sample2', 130, 300, 200, 450, 250]
        ]
    },
    zoom: {
        enabled: true,
        onzoom: function (domain) {
            console.log(this, domain);
        }
    }
});

var chartJson = c3.generate({
    bindto: '#chart_json',
    data: {
        url: '/static/c3.json',
        mimeType: 'json',
        types: {
            data2: 'bar' // ADD
        }
    }
});

$.ajax({
    url: '/static/c3.json',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
        c3.generate({
            bindto: '#chart_ajax',
            data: {
                json: data,
                names: {
                    data1: 'Value 1',
                    data2: 'Value 2',
                    data3: 'Value 3'
                }
            }
        });
    }
});

var formatter;
function updateFormatter(byMonth) {
    formatter = d3.time.format(byMonth ? '%Y-%m' : '%Y-%m-%d');
}

updateFormatter();

var chartBtn = c3.generate({
    bindto: '#chart_btn',
    data: {
        x: 'date',
        columns: [
            ['date', '2014-01-01', '2014-01-02', '2014-01-03'],
            ['data1', 100, 200, 300],
        ]
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: function (x) { // x comes in as a time string.
                    return formatter(x);
                }
            }
        }
    }
});

d3.select('#btnByMonth').on('click', function () {
    updateFormatter(true);
    chartBtn.flush();
});
d3.select('#btnByWeek').on('click', function () {
    updateFormatter(false);
    chartBtn.flush();
});

function getMonthByName(x) {
    var months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    console.log(x);
    return months[x.getMonth()];
}

c3.generate({
    bindto: '#chart-2',
    data: {
        x: 'data1',
        xFormat: '%Y%m%d',
        columns: [
            ['data1', '20130101', '20130202', '20130303', '20130404', '20130505', '20130606'],
            ['data2', -30, 200, 200, 400, -150, 250],
            ['data3', 300, 20, 10, 40, 15, 25]
        ],
        groups: [
            ['data2', 'data3']
        ],
        type: 'bar'
    },
    grid: {
        y: {
            lines: [{value: 0}]
        }
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: function (x) {
                    return getMonthByName(x);
                }
            },
            label: {
                text: 'X-AXIS',
                position: 'outer-center'
            }
        }
    }
});

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                console.log(item + ':' + msg[item]);
            }
        }
    } else {
        console.log(msg);
    }
}