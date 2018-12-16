

//tabs
$('.tabgroup > div').hide();
$('.tabgroup > div:first-of-type').show();
$('.tabs a').click(function(e){
    e.preventDefault();
    var $this = $(this),
        tabgroup = '#'+$this.parents('.tabs').data('tabgroup'),
        others = $this.closest('li').siblings().children('a'),
        target = $this.attr('href');
    others.removeClass('active');
    others.removeClass('borderbtm');
    $this.addClass('active');
    $this.addClass('borderbtm');
    $(tabgroup).children('div').fadeOut();
    setTimeout(function () {

        $(target).fadeIn();
    },500)

})





///api start
let apiKey = "iun1sOoLUyHDJU4FaR9NNGAytnFnqVGgh7t4wtyo";


//Every day photography
$.ajax({
    let: url ="https://api.nasa.gov/planetary/apod?api_key="+ apiKey ,
    url: url,
    success: function success(result){

        // console.log(result);

        if(result.media_type == "video") {
            $("#apod_img_ofDay").css("display", "none");
            $("#apod_vid_id").attr("src", result.url);
        }
        else {
            $("#apod_vid_id").css("display", "none");
            $("#apod_img_ofDay").attr("src", result.url);
        }
        $("#apod_explaination").text(result.explanation);
        $("#apod_title").text(result.title);
    }
});

// getting today date for using it on the api url
let newDate = new Date();
let today = newDate.toJSON().slice(0,10).replace(/-/g,'-');
function addDays(dateObj, numDays) {
    dateObj.setDate(dateObj.getDate() - numDays);
    return dateObj;
}

let sevenDaysLess = addDays(new Date() , 7).toJSON().slice(0,10).replace(/-/g,'-');
let thirtyDay = addDays(new Date() , 30).toJSON().slice(0,10).replace(/-/g,'-');

// console.log(thirtyDay);
//
// console.log(today);

//Neo Feed TAble
$.ajax({
    let: url ="https://api.nasa.gov/neo/rest/v1/feed?start_date="+sevenDaysLess +"&end_date="+ today+"&api_key="+ apiKey ,
    url: url,
    success: function success(result) {
        // console.log(result.near_earth_objects)
        let tableHtml = `<table>
        <thead>
          <tr>
              <th>id</th>
              <th>name</th>
              <th>close approach date</th>
              <th>orbiting body</th>
              <th>miss distanclet: miles</th>

          </tr>
        </thead> 
        <tbody>`
        //for loop deep to the data
        for (let earthOject in result.near_earth_objects) {
            if (earthOject === today) {
                // console.log(result.near_earth_objects[earthOject]);
                for (let i = 0; i < result.near_earth_objects[earthOject].length; i++) {
                    let neoId = result.near_earth_objects[earthOject][i].neo_reference_id;
                    let neoName = result.near_earth_objects[earthOject][i].name;
                    let close_approach_date = result.near_earth_objects[earthOject][i].close_approach_data[0].close_approach_date;
                    let orbiting_body = result.near_earth_objects[earthOject][i].close_approach_data[0].orbiting_body;
                    let miss_distanclet = result.near_earth_objects[earthOject][i].close_approach_data[0].miss_distance.miles;
                    // console.log(miss_distanclet);

                    //adding data to the table row's
                    tableHtml += `<tr>
                                    <td>${neoId}</td>
                                    <td>${neoName}</td>
                                    <td>${close_approach_date}</td>
                                    <td>${orbiting_body}</td>
                                    <td>${miss_distanclet}</td>
                                  </tr>`
                }
            }
        }//end of for loop

        tableHtml += `</tbody>`

        $('.neoFeed').append(tableHtml);

    }

});


// Mars Rover API with a different approach by a direct browser request

    let exampleURL = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-10-31" ;


    let request = new XMLHttpRequest();
    request.open('GET', exampleURL + '&api_key=' + apiKey, true);

    request.addEventListener('load',function(){

        if(request.status >= 200 && request.status < 400){
            let response = JSON.parse(request.responseText);
        }
        else {
            console.log("Error in network request: " + request.statusText);
        }});
    request.send(null);


    //Rover API Implementation

document.addEventListener('DOMContentLoaded', submitButtonsReady);

function submitButtonsReady() {
    document.getElementById('dateInput').addEventListener('click', function (event) {
        // console.log('1');

        let request = new XMLHttpRequest();
        let date = document.getElementById('dateValue').value;
        let roverName = "";

        let buttonStatus1 = document.getElementById('button1').checked;
        let buttonStatus2 = document.getElementById('button2').checked;
        let buttonStatus3 = document.getElementById('button3').checked;

        if (buttonStatus1 === true) {
            roverName = "curiosity";
        }
        else if (buttonStatus2 === true) {
            roverName = "opportunity";
        }
        else {
            roverName = "spirit";
        }
        request.open('GET', 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + roverName + '/photos?earth_date=' + date + '&api_key=' + apiKey, true);
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                let response = JSON.parse(request.responseText);

                // Appending Rover Data

                document.getElementById('imageStatus').textContent = 'Found';
                document.getElementById('imageID').src = response.photos[0].img_src;
                document.getElementById('roverCaption').textContent = response.photos[0].rover.name;
                document.getElementById('landingCaption').textContent = response.photos[0].rover.landing_date;
                document.getElementById('endingCaption').textContent = response.photos[0].rover.max_date;

            }
            else {
                console.log("Error in network request: " + request.statusText);
            }
        });
        document.getElementById('imageStatus').textContent = 'Please try a different date or check your syntax!';
        request.send(null);
        event.preventDefault();
    })
}
    
    //epic


        document.addEventListener('DOMContentLoaded', submitEpicButtonsReady);

    function submitEpicButtonsReady(){
            console.log('1');
        // document.getElementById('epicDateInput').addEventListener('click', function(event){
            document.getElementById('epicDateInput').addEventListener('click', function(event){

                let request = new XMLHttpRequest();


            let date = document.getElementById('epicDateValue').value;
            let dateArray = date.split("-");
            let year = dateArray[0];
            let month = dateArray[1];
            let day = dateArray[2];

            request.open('GET', 'https://api.nasa.gov/EPIC/api/natural/date/' + date + '?api_key=' + apiKey, true);
            request.addEventListener('load',function(){
                if(request.status >= 200 && request.status < 400){

                    let response = JSON.parse(request.responseText);

                    if(typeof(response[0].image) === 'string')
                    {
                        document.getElementById('epicImageStatus').textContent = 'Found';
                        document.getElementById('epicImageID').src = 'https://epic.gsfc.nasa.gov/archive/natural/' + year + '/' + month + '/' + day + '/jpg/' + response[0].image + '.jpg';
                        document.getElementById('epicImageCaption').textContent = response[0].caption;
                    }

                }
                else
                {
                    console.log("Error in network request: " + request.statusText);

                }});
            document.getElementById('epicImageStatus').textContent = 'Please try a different date or check your syntax!';
            request.send(null);
            event.preventDefault();
        })

    }

    //load
setTimeout(() => {
    document.querySelector('body').classList.add('loaded');
}, 4000);

//Coronal Mass Ejection (CME) Analysis



$.ajax({
    let: url ="https://api.nasa.gov/DONKI/FLR?startDate="+thirtyDay+"&endDate="+today+"&api_key="+ apiKey ,
    url: url,
    success: function success(result){

        console.log(result);

    }
});
