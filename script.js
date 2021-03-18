//api key: 5fab146a0dc286e1ebf8a578cd8b69c7
$(".weather").change(function(){
        $("div").remove("#weatherInput");
        var selValue = $("input[type='radio']:checked").val();


        $("#radioButtons").append("<div id='weatherInput'><div class='tooltip'><input name='"+selValue+"Input' id='"+selValue+"Input' class='weatherInputVal' placeholder='Enter "+selValue+"' value='' /></div><br /><button id='subButton'>Submit</button></div>");

        if(selValue === "coords"){
          $(".tooltip").append("<span class='tooltiptext'>Enter latitude followed by a comma then the longitude.</span>");

        }

        function callback(res){
          console.log(res)
          let tempArr = [];
          let date = new Date();
          let day = Number(date.getDate());
          for(let i = 0; i < 40; i++){
            for(let j = day; j <(day+3); j++){
              var forecastDate = new Date(res['list'][i]['dt_txt']);
              if(forecastDate.getDate() == j){
                let forecastDay = j;
                let temps = res['list'][i]['main']['temp_max'];
                let pressureVal = res['list'][i]['main']['pressure']
                let cloudCover = res['list'][i]['clouds']['all']
                tempArr.push({forecastDay, temps, pressureVal, cloudCover});
              }
            }
          }
          let maxArr = tempArr.reduce((red, {forecastDay, ...restofArray}) => {
              let i = 0;
              if (!red[forecastDay]) red[forecastDay] = { ...restofArray }
              else{
                for(i in restofArray){
                  if(restofArray[i] > red[forecastDay][i]){
                    red[forecastDay][i] = restofArray[i];
                  }
                }
              }
              return red;
          },{});
          for(let currDay = day; currDay < day+3; currDay++){
            $("#outputList").append("<h3>"+date.toDateString()+"</h3><ul><li>Max Temp: "+maxArr[currDay].temps+"</li><li>Max Pressure: "+maxArr[currDay].pressureVal + "</li><li>Cloud Cover: "+maxArr[currDay].cloudCover+"</li><ul><br />");
            date.setDate(date.getDate() + 1);

          }
        }

        $("#subButton").click(function(e){
            e.preventDefault();
            $("#error").empty();
            err = document.getElementById("error");
            $("#outputList").empty();
            apiKey = "&units=imperial&appid=5fab146a0dc286e1ebf8a578cd8b69c7"
            url = "https://api.openweathermap.org/data/2.5/forecast?"
            if(selValue !== 'coords'){
              apiInput = $("#"+selValue+"Input").val();
              if(selValue === 'city'){
                queryString = "q="+apiInput;
                query = url+queryString+apiKey;
                $.ajax({
                    url: query,
                    type: 'GET',
                    success: callback,
                    error: function(xhr, status, error) {
                      err.innerHTML = "An AJAX error occured:"+"<br /> Error: " + error;
                    }
                });
              }
              else{
                queryString = "zip="+apiInput;
                query = url+queryString+apiKey;
                $.ajax({
                    url: query,
                    type: 'GET',
                    success: callback,
                    error: function(xhr, status, error) {
                      err.innerHTML = "An AJAX error occured:"+"<br /> Error: " + error;
                    }
                });
              }
            }
            else{
              coordsInput = $("#coordsInput").val();
              var arr = coordsInput.split(",").map(function(item) {
                return item.trim();
              });

              queryString = "lat="+arr[0]+"&lon="+arr[1];
              query = url+queryString+apiKey;
              $.ajax({
                    url: query,
                    type: 'GET',
                    success: callback,
                    error: function(xhr, status, error) {
                      err.innerHTML = "An AJAX error occured:"+"<br /> Error: " + error;
                    }
                });
            }
        });
});