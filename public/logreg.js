const forms = document.querySelector(".forms"),
    toggleshowhide = document.querySelectorAll(".eye-icon"),
    links = document.querySelectorAll(".link");

    console.log(forms,toggleshowhide, links);

    toggleshowhide.forEach(eyeicon => {
    eyeicon.addEventListener("click", () => {
        let pwh = eyeicon.parentElement.parentElement.querySelectorAll(".password");
        console.log(pwh)

        pwh.forEach(password => {
          if(password.type === "password"){
            password.type = "text";
            eyeicon.classList.replace("bx-hide", "bx-show");
            return 
          }
          password.type = "password";
          eyeicon.classList.replace("bx-show", "bx-hide");

        })
    })
})