
// // for toggle button
// var content = document.getElementById('advanced-settings-content');
// var icon = document.getElementById('advanced-settings-icon');

// function toggleAdvancedSettings() {
//     if (content.classList.contains('hidden')) {
//         content.classList.remove('hidden');
//         icon.classList.remove('fa-chevron-down');
//         icon.classList.add('fa-chevron-up');
//     } else {
//         content.classList.add('hidden');
//         icon.classList.remove('fa-chevron-up');
//         icon.classList.add('fa-chevron-down');
//     }
// }


// //showing  right side conten according to sidebar

function showContent(left, content) {
    document.getElementById(content).classList.remove('hidden');
}

//createPost
let mainContent = document.getElementById('main-content');
let openBtn = document.getElementById('openBtn');

function createPost(left, content) {
    let post = document.getElementById(content);
    post.classList.remove('hidden');
    mainContent.classList.add('blur-sm', 'pointer-events-none', 'select-none');
}

document.addEventListener("click", (event) => {
    let post = document.getElementById('createPost')
    let upload = document.getElementById("post");
    let isOnPost = upload.contains(event.target);
    let isOnButton = openBtn.contains(event.target);

    if (!isOnPost && !isOnButton && !upload.classList.contains("hidden")) {
        post.classList.add("hidden");
        mainContent.classList.remove('blur-sm', 'pointer-events-none', 'select-none');
    }
});

// //All, reels, posts section content


// function sectionToggle(top, contentType) {
//     let allPosts = document.querySelectorAll(".post-card");
//     allPosts.forEach(post => {
//         post.classList.add("hidden"); // Hide all
//     });

//     // Show only matching type (or all)
//     if (contentType === "all") {
//         document.querySelectorAll(".post-card").forEach(post => post.classList.remove("hidden"));
//     } else {
//         document.querySelectorAll(`[content-type=${contentType}]`).forEach(post => post.classList.remove("hidden"));
//     }
// }

// //video open 

// const modal = document.getElementById("mediaModal");
// const mediaContent = document.getElementById("mediaContent")

// modal.addEventListener("click", function (e) {
//     if (!mediaContent.contains(e.target)) {
//       window.location.href ="/main";
//     } 
// });



//for cropping 
// const input = document.getElementById('media-input');
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('photo');
    const previewContainer = document.getElementById('photo-upload');
    // const cropBtn = document.getElementById('crop-btn');
    // const canvas = document.getElementById('canvas');
    // let cropper;

    input.addEventListener('change', function () {
        const file = input.files[0];
        if (!file) return;

        const fileType = file.type;
        previewContainer.innerHTML = ''; // Clear previous
        // cropBtn.style.display = 'none';

        const url = URL.createObjectURL(file);

        if (fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = url;
            previewContainer.appendChild(img);

            // img.onload = () => {
            //     if (cropper) {
            //         cropper.destroy(); // Clean up previous cropper instance
            //     }
            //     cropper = new Cropper(img, {
            //         aspectRatio: 1,
            //         viewMode: 1
            //     });
            //     cropBtn.style.display = 'inline';
            // };
        } else if (fileType.startsWith('video/')) {
            const video = document.createElement('video');
            video.controls = true;
            video.src = url;
            previewContainer.appendChild(video);
        }
        document.getElementById("next").classList.remove("hidden");


    });

    // cropBtn.addEventListener('click', function () {
    //     if (!cropper) return;

    //     const croppedCanvas = cropper.getCroppedCanvas();
    //     canvas.width = croppedCanvas.width;
    //     canvas.height = croppedCanvas.height;
    //     const ctx = canvas.getContext('2d');
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     ctx.drawImage(croppedCanvas, 0, 0);
    //     canvas.style.display = 'block';
    // });
});
window.postOptionsShow = function (next) {
    let post = document.getElementById("post");
    post.classList.remove("w-[35vw]");
    post.classList.add("w-[60vw]");
    next.classList.add("hidden")
}
function cancelPost() {
    let post = document.getElementById('createPost')
    post.classList.add("hidden");
    mainContent.classList.remove('blur-sm', 'pointer-events-none', 'select-none');

}




// 