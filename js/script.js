google.charts.load('current', {'packages':['corechart']});

var minAge = 0;
var maxAge = 100;
var minIncome = 42000;
var maxIncome = 100000;
var dataJSON;

$( function() {
    $( "#slider-range" ).slider({
        range: true,
        min: 1,
        max: 100,
        values: [ 1, 100 ],
        slide: function( event, ui ) {
            $( "#age" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        },
        stop: function(event, ui){
            minAge = $( "#slider-range" ).slider( "values", 0 );
            maxAge = $( "#slider-range" ).slider( "values", 1 );
            getData(minAge, maxAge, minIncome, maxIncome);
        }
    });

    $( "#age" ).val( $( "#slider-range" ).slider( "values", 0 ) +
    " - " + $( "#slider-range" ).slider( "values", 1 ) );

    $( "#slider-range2" ).slider({
      range: true,
      min: 42000,
      max: 100000,
      values: [ 42000, 100000 ],
      slide: function( event, ui ) {
         $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
     },
       stop: function(event, ui){
           minIncome = $( "#slider-range2" ).slider( "values", 0 );
           maxIncome = $( "#slider-range2" ).slider( "values", 1 );
           getData(minAge, maxAge, minIncome, maxIncome);
       }
     });

     $( "#amount" ).val( "$" + $( "#slider-range2" ).slider( "values", 0 ) +
       " - $" + $( "#slider-range2" ).slider( "values", 1 ) );
} );

var key;
$.ajax({
    url: "config.json",
    dataType: "json",
    type: "GET",
    success:function(data){
        key = data[0].API_KEY;
        getData(minAge, maxAge, minIncome, maxIncome);
    },
    error:function(error){
        console.log("ERROR");
        console.log(error);
    }
});

function getData(minAge, maxAge, minIncome, maxIncome){
    console.log("https://my.api.mockaroo.com/peopledata.json?min_age="+minAge+"&max_age="+maxAge+"&min_money="+minIncome+"&max_money="+maxIncome+"&key="+key);
    $.ajax({
        url: "https://my.api.mockaroo.com/peopledata.json?min_age="+minAge+"&max_age="+maxAge+"&min_money="+minIncome+"&max_money="+maxIncome+"&key="+key,
        dataType: "json",
        type: "GET",
        success:function(mockarooData){
            dataJSON = mockarooData;
            const dataTable = new google.visualization.DataTable();
            dataTable.addColumn("number", "Age");
            dataTable.addColumn("number", "Annual Income");

            for (var i = 0; i < mockarooData.length; i++) {
                dataTable.addRow([mockarooData[i].age, parseFloat(mockarooData[i].income.substr(1))]);
            }
            var options = {
              title: 'Age vs. Income comparison',
              hAxis: {title: 'Age', minValue: minAge, maxValue: maxAge},
              vAxis: {title: 'Annual Income', minValue: minIncome, maxValue: maxIncome},
              legend: 'none'
            };
            var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
            google.visualization.events.addListener(chart, 'select', clickEvent);
            chart.draw(dataTable, options);

            function clickEvent(){
                var tableRow = chart.getSelection()[0].row;
                chart.setSelection();
                var personData = dataJSON[tableRow];
                if(personData){
                    document.getElementById('name').innerText = personData.first_name + " " + personData.last_name;
                    document.getElementById('avatarImage').src = personData.profile_image;
                    document.getElementById('avatarImage').alt = "Image of " + personData.first_name;
                    document.getElementById('age').innerText = personData.age;
                    document.getElementById('gender').innerText = personData.gender;
                    document.getElementById('email').innerText = personData.email;
                    document.getElementById('company').innerText = personData.company;
                    document.getElementById('jobTitle').innerText = personData.occupation;
                    document.getElementById('income').innerText = personData.income;
                }
            }


        },
        error:function(error){
            console.log("error");
            console.log(error);
        }
    })
}
