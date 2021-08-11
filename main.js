$(document).ready(function(){
var responsejd = '';
var json_responsejd = '';
var responseo = '';
var json_responseo = '';
var responsefp = '';
var json_responsefp = '';
var counttaskhistory = 0;

var finaldate = '';
var finalday = '';

var request = new XMLHttpRequest();

document.getElementById("trackbutton").addEventListener("click", function tracknumber(){

    document.getElementById("trackinghistorydetails").innerHTML = "";
    document.getElementById("trackingresultbox").style.display = 'none';

        request.open('POST', 'https://api.tookanapp.com/v2/get_job_details');
    
        request.setRequestHeader('Content-Type', 'application/json');
    
        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                console.log('Status:', this.status);
                console.log('Headers:', this.getAllResponseHeaders());
                console.log('Body:', this.responseText);
                responsejd = this.responseText;
                json_responsejd = JSON.parse(responsejd);

                if(json_responsejd.status != 404){
                    document.getElementById('jobid').value = ''

                    request.open('POST', 'https://api.tookanapp.com/v2/get_job_details_by_order_id');
    
                    request.setRequestHeader('Content-Type', 'application/json');

                    request.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            console.log('Status:', this.status);
                            console.log('Headers:', this.getAllResponseHeaders());
                            console.log('Body:', this.responseText);
                            responseo = this.responseText;
                            json_responseo = JSON.parse(responseo);

                            if(json_responsejd.message = "Successful"){
                                request.open('POST', 'https://api.tookanapp.com/v2/view_fleet_profile');
    
                                request.setRequestHeader('Content-Type', 'application/json');

                                request.onreadystatechange = function () {
                                    if (this.readyState === 4) {
                                    console.log('Status:', this.status);
                                    console.log('Headers:', this.getAllResponseHeaders());
                                    console.log('Body:', this.responseText);
                                    responsefp = this.responseText;
                                    json_responsefp = JSON.parse(responsefp);

                                    id="trackingresultbox"

                                    document.getElementById("trackingresultbox").style.display = 'inline';
                                    document.getElementById("trackingresultbox2").style.display = 'inline';
                                    document.getElementById("trackingagentname").innerHTML = json_responsefp.data.fleet_details[0].username;
                                    document.getElementById("trackingnumberdetails").innerHTML = json_responsejd.data[0].job_id;

                                    counttaskhistory = json_responsejd.data[0].task_history["length"];

                                    var countassign = 0;
                                    var countassigned = 0;
                                    var countaccept = 0;
                                    var countfacility = 0;
                                    var deliverynote = '';

                                    for(let i = 0; i  < counttaskhistory; i++){

                                        var d = new Date(json_responsejd.data[0].task_history[i].creation_datetime);
                                        var ampm = '';
                                        var ampmhour = '';
                                        var ampmmin = '';

                                        function getTime(){
                                                if (d.getHours()<12){
                                                    ampm = 'am';
                                                    ampmhour = d.getHours();
                                                }

                                                if (d.getHours()==12){
                                                    ampm = 'pm';
                                                    ampmhour = d.getHours();
                                                }

                                                if (d.getHours()>12){
                                                    ampm = 'pm';
                                                    ampmhour = d.getHours() - 12;
                                                }

                                                if (d.getMinutes()<10){
                                                    ampmmin = "0" + d.getMinutes();
                                                }

                                                if (d.getMinutes()>=10){
                                                    ampmmin = d.getMinutes();
                                                }

                                                return (ampmhour + ":" + ampmmin + " " + ampm);
                                        }

                                        function getFullDate(){
                                            return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
                                        }

                                        function getFullDateWithDay(){
                                            if (d.getDay() == 1){
                                                finalday = "Monday"
                                            }

                                            if (d.getDay() == 2){
                                                finalday = "Tuesday"
                                            }

                                            if (d.getDay() == 3){
                                                finalday = "Wednesday"
                                            }

                                            if (d.getDay() == 4){
                                                finalday = "Thursday"
                                            }

                                            if (d.getDay() == 5){
                                                finalday = "Friday"
                                            }

                                            if (d.getDay() == 6){
                                                finalday = "Saturday"
                                            }

                                            if (d.getDay() == 0){
                                                finalday = "Sunday"
                                            }

                                            return finalday + ", " + d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
                                        }

                                        function checkDate(){
                                            if (getFullDate()!=finaldate){
                                            finaldate = getFullDate();
                                            var para = document.createElement("Pd" + i);
                                            para.innerHTML = "<br><b>" + getFullDateWithDay() + "</b><hr>";
                                            document.getElementById("trackinghistorydetails").appendChild(para);
                                            }
                                        }

                                        if(json_responsejd.data[0].task_history[i].label_description.includes('Status updated from')){
                                            checkDate()
                                            if(json_responsejd.data[0].task_history[i].description.includes('to Failed')){

                                                var para = document.createElement("P" + i);
                                                para.setAttribute("id", "faileddelivery2" + i);
                                                para.innerHTML = getTime() + " - " + "Go Rush Status Updated: <b>Failed</b>" + "<br><br>";
                                                document.getElementById("trackinghistorydetails").appendChild(para);
                                                document.getElementById("faileddelivery2" + i).style.color = "#b30000";

                                                var para = document.createElement("P" + i + "ff");
                                                para.innerHTML = "<b>Reason: </b>" + json_responsejd.data[0].task_history[i].reason + "<br><br>";
                                                document.getElementById("trackinghistorydetails").appendChild(para);
                                            }

                                            if(json_responsejd.data[0].task_history[i].description.includes('to Successful')){

                                                var para = document.createElement("P" + i);
                                                para.innerHTML = getTime() + " - " + "Go Rush Status Updated: <b>Successful</b>" + "<br><br>";
                                                document.getElementById("trackinghistorydetails").appendChild(para);
                                            }

                                            if(json_responsejd.data[0].task_history[i].description.includes('to Unassigned')){

                                                var para = document.createElement("P" + i);
                                                para.innerHTML = getTime() + " - " + "Go Rush Status Updated: <b>Unassigned</b>" + "<br><br>";
                                                document.getElementById("trackinghistorydetails").appendChild(para);
                                            }

                                            if(json_responsejd.data[0].task_history[i].description.includes('to Started')){

                                                var para = document.createElement("P" + i);
                                                para.innerHTML = getTime() + " - " + "Go Rush Status Updated: <b>Started</b>" + "<br><br>";
                                                document.getElementById("trackinghistorydetails").appendChild(para);
                                            }
                                        }

                                        if(json_responsejd.data[0].task_history[i].description.includes('Created By')){
                                            checkDate()

                                            var para = document.createElement("P" + i);
                                            para.innerHTML = getTime() + " - " + "Consignor, <b>Order Placed</b>" + "<br><br>";
                                            document.getElementById("trackinghistorydetails").appendChild(para);
                                        }

                                        if((json_responsejd.data[0].task_history[i].description.includes('task via bulk'))&&(countassign < 1)&&(countassigned < 1)){
                                            checkDate()

                                            var para = document.createElement("P" + i);
                                            para.innerHTML = getTime() + " - " + "Arrived in Brunei International Airport, <b>Undergoing Custom Clearance</b>" + "<br><br>";
                                            document.getElementById("trackinghistorydetails").appendChild(para);

                                            countassign = countassign + 1;
                                            countassigned = countassigned + 1;
                                        }

                                        if((json_responsejd.data[0].task_history[i].description.includes('Assigned'))&&(countassign < 1)&&(countassigned < 1)){
                                            checkDate()

                                            var para = document.createElement("P" + i);
                                            para.innerHTML = getTime() + " - " + "Arrived in Brunei International Airport, <b>Undergoing Custom Clearance</b>" + "<br><br>";
                                            document.getElementById("trackinghistorydetails").appendChild(para);

                                            countassign = countassign + 1;
                                            countassigned = countassigned + 1;
                                        }

                                        if(json_responsejd.data[0].task_history[i].description.includes('Accepted at')){
                                            checkDate()

                                            if(countaccept < 1){

                                                var para = document.createElement("P" + i);
                                                para.innerHTML = getTime() + " - " + "<b>Arrived in Go Rush</b>" + "<br><br>";
                                                document.getElementById("trackinghistorydetails").appendChild(para);

                                                countaccept = countaccept + 1;
                                                countassign = countassign + 1;
                                                countassigned = countassigned + 1;
                                            }

                                            if(countfacility < 1){

                                                var para = document.createElement("P" + i);
                                                para.innerHTML = getTime() + " - " + "<b>Go Rush Sorting Facility</b>" + "<br><br>";
                                                document.getElementById("trackinghistorydetails").appendChild(para);

                                                countfacility = countfacility + 1;
                                            }
                                        }

                                        if(json_responsejd.data[0].task_history[i].description.includes('Started at')){
                                            checkDate()

                                            var para = document.createElement("P" + i);
                                            para.innerHTML = getTime() + " - " + "<b>Out For Delivery</b>" + "<br><br>";
                                            document.getElementById("trackinghistorydetails").appendChild(para);

                                            countfacility = 0;
                                        }

                                        if(json_responsejd.data[0].task_history[i].description.includes('Arrived at')){
                                            checkDate()

                                            var para = document.createElement("P" + i);
                                            para.innerHTML = getTime() + " -  " + "<b>Arrived</b>" + "<br><br>";
                                            document.getElementById("trackinghistorydetails").appendChild(para);

                                            countfacility = 0;
                                        }

                                        if(json_responsejd.data[0].task_history[i].description.includes('Successful at')){
                                            checkDate()

                                            var para = document.createElement("P" + i);
                                            para.setAttribute("id", "successdelivery" + i);
                                            para.innerHTML = getTime() + " - " + "<b>Successful</b>" + "<br><br>";
                                            document.getElementById("trackinghistorydetails").appendChild(para);
                                            document.getElementById("successdelivery" + i).style.color = "#009933";

                                            var para = document.createElement("P" + i + "s");
                                            para.innerHTML = "<b>Address: </b>" + json_responsejd.data[0].job_address + "<br><br>" + "<b>Consignee Detail: </b>" + json_responsejd.data[0].customer_username + "<br><br>";
                                            document.getElementById("trackinghistorydetails").appendChild(para);

                                            if(deliverynote!=""){
                                                var para = document.createElement("P" + i + "sd");
                                                para.innerHTML = "<b>Delivery Note: </b>" + deliverynote + "<br><br>";
                                                document.getElementById("trackinghistorydetails").appendChild(para);
                                            }
                                        }

                                        if(json_responsejd.data[0].task_history[i].description.includes('Failed at')){
                                            checkDate()

                                            var para = document.createElement("P" + i);
                                            para.setAttribute("id", "faileddelivery" + i);
                                            para.innerHTML = getTime() + " - " + "<b>Failed Delivery</b>" + "<br><br>";
                                            document.getElementById("trackinghistorydetails").appendChild(para);
                                            document.getElementById("faileddelivery" + i).style.color = "#b30000";

                                            var para = document.createElement("P" + i + "f");
                                            para.innerHTML = "<b>Reason: </b>" + json_responsejd.data[0].task_history[i].reason + "<br><br>";
                                            document.getElementById("trackinghistorydetails").appendChild(para);
                                        }

                                        if(json_responsejd.data[0].task_history[i].type == "text_added"){
                                            deliverynote = json_responsejd.data[0].task_history[i].description;
                                        }
                                    }

                                    }
                                };

                                var body = {
                                    'api_key': '51676580f24b091114132d38111925401ee4c2f328d978375e1f03',
                                    'fleet_id': [json_responsejd.data[0].fleet_id],
                                };

                                request.send(JSON.stringify(body));
                            }
                        }
                    };

                    var body = {
                    'api_key': '51676580f24b091114132d38111925401ee4c2f328d978375e1f03',
                    'order_ids': [json_responsejd.data[0].job_id],
                    'include_task_history': 1
                    };

                    request.send(JSON.stringify(body));
                }

                if (json_responsejd.status == 404){
                    document.getElementById("trackingresultbox2").style.display = 'inline';
                    var para = document.createElement("P");
                    para.setAttribute("id", "wronginput");
                    para.innerHTML = "<b>Please check your Tracking Number.</b>";
                    document.getElementById("trackinghistorydetails").appendChild(para);
                    document.getElementById("wronginput").style.color = "#b30000";
                    document.getElementById("wronginput").style.textAlign = "center";
                }


            }
        };
    
        var body = {
          'api_key': '51676580f24b091114132d38111925401ee4c2f328d978375e1f03',
          'job_ids': [document.getElementById("jobid").value],
          'include_task_history': 1
        };
    
        request.send(JSON.stringify(body));
    });
});