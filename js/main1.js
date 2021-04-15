$(function(){
    $("#register").hide()
    $(".container-header-navigtion-form").on("click" , call => {

        if(call.target.parentNode.id == "loginTap"){
            $("#registerTap").removeClass("selected")
            $("#" + call.target.parentNode.id ).addClass("selected")
            $("#login").show()
            $("#register").hide()
        }else {
            $("#loginTap").removeClass("selected")
            $("#" + call.target.parentNode.id ).addClass("selected")
            $("#login").hide()
            $("#register").show()
        }  

    })
    })

    $("#formSubmitLogin").on("submit" , data => {
        let email = data.target[0].value
        if(email == ""){
            return false
        }
        let password = data.target[1].value
        if(password == ""){
            return false
        }

        let dataAlert = $("#alert");
        dataAlert[0].innerHTML = "";
        dataAlert.addClass("success");
        dataAlert.append("<p class='m-0'>Data process</p>");
        dataAlert.append("<div class='charger'></div>");

        if(true){
            let datauser = {
                email: email,
                password: password

            }

            login(datauser)
        }
    } )

    $("#formSubmitRegister").on("submit" , data => {
        console.log(data)
    } )

    function login (data) {
        let dataAlert = $("#alert");
       $.ajax({
           method: "POST",
           url: "https://reqres.in/api/login",
           data: data,
           success: function (response){
            setTimeout(function () {
                   dataAlert[0].innerHTML = "";
                   dataAlert.removeClass("Error")
                   dataAlert.addClass("success") 
                   dataAlert.append("<p class='m-0'>Data correct</p>")
                   
               } , 2000)
               localStorage.setItem("acesso", true);

               window.location.href = "indexApi.html";
           },
          

       }) 

.fail(function (response){
    
    setTimeout(function () {
        dataAlert[0].innerHTML = "";
        dataAlert.removeClasss = ("success")
        dataAlert.addClass("Error")
        dataAlert.append("<p class='m-0'>Data incorrect</p>")   
    } , 2000)
  
   })

   
}

