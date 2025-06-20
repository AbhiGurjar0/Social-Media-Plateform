
// for sign up and sign in nevigation 
document.addEventListener("DOMContentLoaded", () => {
    const signUpBtn = document.getElementById("signUp");
    const signInBtn = document.getElementById("signIn");
    const loginContainer = document.getElementById("login-container");
    const signupContainer = document.getElementById("signup-container");

    if (signUpBtn && loginContainer && signupContainer) {
        signUpBtn.addEventListener("click", () => {
            loginContainer.classList.add("hidden");
            signupContainer.classList.remove("hidden");
        });
    }

    if (signInBtn && loginContainer && signupContainer) {
        signInBtn.addEventListener("click", () => {
            signupContainer.classList.add("hidden");
            loginContainer.classList.remove("hidden");
        });
    }
});



// for eye Button Login

document.addEventListener("DOMContentLoaded", () => {
    const openIcon = document.getElementById("open");
    const closeIcon = document.getElementById("close");
    const password = document.getElementById("password");
    if(openIcon===null) return ;

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

// for eye Button Register

document.addEventListener("DOMContentLoaded", () => {
    const openIcon = document.getElementById("openr");
    const closeIcon = document.getElementById("closer");
    const password = document.getElementById("passwordr");
     if(openIcon===null) return ;

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
