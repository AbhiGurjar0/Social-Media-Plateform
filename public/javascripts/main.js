
// for toggle button
var content = document.getElementById('advanced-settings-content');
var icon = document.getElementById('advanced-settings-icon');

function toggleAdvancedSettings() {
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        content.classList.add('hidden');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}


//showing  right side conten according to sidebar

function showContent(left, content) {
    let tabs = document.querySelectorAll('.tabs');
    tabs.forEach((tab) => {
        tab.classList.add('hidden');

    })
    document.getElementById(content).classList.remove('hidden');
}


//All, reels, posts section content


function sectionToggle(top, contentType) {
    let allPosts = document.querySelectorAll(".post-card");
    allPosts.forEach(post => {
        post.classList.add("hidden"); // Hide all
    });

    // Show only matching type (or all)
    if (contentType === "all") {
        document.querySelectorAll(".post-card").forEach(post => post.classList.remove("hidden"));
    } else {
        document.querySelectorAll(`[content-type=${contentType}]`).forEach(post => post.classList.remove("hidden"));
    }
}

//video open 

const modal = document.getElementById("mediaModal");
const mediaContent = document.getElementById("mediaContent")

modal.addEventListener("click", function (e) {
    if (!mediaContent.contains(e.target)) {
      window.location.href ="/main";
    } 
});


