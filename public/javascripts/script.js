const { list } = require("postcss");

//for sign up and sign in nevigation 
document.getElementById("signUp").addEventListener("click", () => {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("signup-container").classList.remove("hidden");

})

document.getElementById("signIn").addEventListener("click", () => {
    document.getElementById("signup-container").classList.add("hidden");
    document.getElementById("login-container").classList.remove("hidden");

})


//for eye Button Login

document.addEventListener("DOMContentLoaded", () => {
    const openIcon = document.getElementById("open");
    const closeIcon = document.getElementById("close");
    const password = document.getElementById("password");

    openIcon.addEventListener("click", () => {
        openIcon.style.display = 'none';
        password.type = "password";
        closeIcon.style.display = 'inline-block';
    });
    closeIcon.addEventListener("click", () => {
        closeIcon.style.display = 'none';

        password.type = "text";
        openIcon.style.display = 'inline-block';

    });
});

//for eye Button Register

document.addEventListener("DOMContentLoaded", () => {
    const openIcon = document.getElementById("openr");
    const closeIcon = document.getElementById("closer");
    const password = document.getElementById("passwordr");

    openIcon.addEventListener("click", () => {
        openIcon.style.display = 'none';
        password.type = "password";
        closeIcon.style.display = 'inline-block';
    });
    closeIcon.addEventListener("click", () => {
        closeIcon.style.display = 'none';

        password.type = "text";
        openIcon.style.display = 'inline-block';

    });
});

//for toggle button
var content = document.getElementById('advanced-settings-content');
var icon = document.getElementById('advanced-settings-icon');

function toggleAdvancedSettings(){
    if(content.classList.contains('hidden')){
        content.classList.remove('hidden');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }else{
        content.classList.add('hidden');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}
