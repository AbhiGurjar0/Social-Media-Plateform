
// // for toggle button
// var content = document.getElementById('advanced-settings-content');
// var icon = document.getElementById('advanced-settings-icon');

// const userModel = require("../../models/user-model");

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

// function showContent(left, content) {
//     document.getElementById(content).classList.remove('hidden');
// }

// //createPost
// let mainContent = document.getElementById('main-content');
// let openBtn = document.getElementById('openBtn');

// function createPost(left, content) {
//     let post = document.getElementById(content);
//     post.classList.remove('hidden');
//     mainContent.classList.add('blur-sm', 'pointer-events-none', 'select-none');
// }

// document.addEventListener("click", (event) => {
//     let post = document.getElementById('createPost')
//     let upload = document.getElementById("post");
//     let isOnPost = upload.contains(event.target);
//     let isOnButton = openBtn.contains(event.target);

//     if (!isOnPost && !isOnButton && !upload.classList.contains("hidden")) {
//         post.classList.add("hidden");
//         mainContent.classList.remove('blur-sm', 'pointer-events-none', 'select-none');
//     }
// });

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
// document.addEventListener('DOMContentLoaded', () => {
//     const input = document.getElementById('photo');
//     const previewContainer = document.getElementById('photo-upload');
//     // const cropBtn = document.getElementById('crop-btn');
//     // const canvas = document.getElementById('canvas');
//     // let cropper;

//     input.addEventListener('change', function () {
//         const file = input.files[0];
//         if (!file) return;

//         const fileType = file.type;
//         previewContainer.innerHTML = ''; // Clear previous
//         // cropBtn.style.display = 'none';

//         const url = URL.createObjectURL(file);

//         if (fileType.startsWith('image/')) {
//             const img = document.createElement('img');
//             img.src = url;
//             previewContainer.appendChild(img);

//             // img.onload = () => {
//             //     if (cropper) {
//             //         cropper.destroy(); // Clean up previous cropper instance
//             //     }
//             //     cropper = new Cropper(img, {
//             //         aspectRatio: 1,
//             //         viewMode: 1
//             //     });
//             //     cropBtn.style.display = 'inline';
//             // };
//         } else if (fileType.startsWith('video/')) {
//             const video = document.createElement('video');
//             video.controls = true;
//             video.src = url;
//             previewContainer.appendChild(video);
//         }
//         document.getElementById("next").classList.remove("hidden");


//     });

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
// });
// window.postOptionsShow = function (next) {
//     let post = document.getElementById("post");
//     post.classList.remove("w-[35vw]");
//     post.classList.add("w-[60vw]");
//     next.classList.add("hidden")
// }
// function cancelPost() {
//     let post = document.getElementById('createPost')
//     post.classList.add("hidden");
//     mainContent.classList.remove('blur-sm', 'pointer-events-none', 'select-none');

// }

// Like

async function like(element, postId) {

    if (!postId) {
        const postElement = document.getElementById('post');
        postId = postElement?.dataset?.postId;

        if (!postId) {
            console.error('Post ID is missing');
            return;
        }
    }
    fetch(`/post/like/${postId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        })
}



//view liked

async function openLike(like, postId) {
    try {
        await fetch(`/post/like/users/${postId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
            .then(response => response.json())
            .then(data => {
                let userDetails = data;
                userDetails.forEach(users => {
                    let user = document.createElement('div');


                });

            })
            .catch((err) => {
                console.log(err);
            })

    } catch (err) {
        console.log("err in opening like ");
        console.log(err);

    }

}




//open Post

async function openPost(element, postId) {
    let fullPage = document.getElementById("openPost");
    let post = document.getElementById("post");
    let postContent = document.getElementById("mediaContent");
    let postComment = document.getElementById("commentSection");
    let likeCount = document.getElementById("likeCount");
    const commentInput = document.getElementById('commentContent');
    commentInput.value = "";
    document.body.classList.add("overflow-hidden");// like count when post is opened
    post.dataset.postId = postId;
    const response = await fetch(`/post/postDetails/${postId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });

    const data = await response.json();

    postContent.innerHTML = "";
    if (data.video) {
        postContent.innerHTML = `
        <div class="w-full h-full object-cover relative">
            <video autoplay class="w-full h-full object-cover">
                <source src="data:video/mp4;base64,${data.video}"
                    type="video/mp4">
                    Your browser does not support the video tag.
            </video>
            <i class="fa-solid fa-play absolute top-2 right-2 text-white z-10"></i>
        </div>`
    }
    else {
        postContent.innerHTML = `<img src="data:image/jpeg;base64,${data.image}" alt="Post Image"
            class="w-full h-full object-cover" />`

    }

    // comment 
    //post creater
    let postUserProfile = document.getElementById("postUserProfile");
    postUserProfile.innerHTML = "";
    postUserProfile.innerHTML = `
    <img src="${data.createdBy.userProfile}" class="w-10 h-10 rounded-full object-cover border-2 border-pink-500" />
              <div>
                <div class="flex items-center gap-1">
                  <span class="font-semibold text-sm">
                    ${data.createdBy.userName}
                  </span>
                </div>
                <span class="text-xs text-gray-500">follow</span>
              </div>`;

    // All comments
    postComment.innerHTML = "";
    console.log(data.comments.length);
    data.comments.forEach(comment => {
        postComment.innerHTML += `
   <div class="flex items-start space-x-3 space-y-2">
  <img src="${comment.userProfile}" alt="${comment.userName}'s profile picture"
       class="w-8 h-8 rounded-full object-cover overflow-hidden" />

  <div class="flex-1 text-sm text-white">
    <div>
      <span class="font-semibold mr-1">${comment.userName}</span>
      <span class="text-gray-300">${comment.content}</span>
    </div>
    <div class="flex text-xs text-gray-400 space-x-4 mt-1">
      <span></span>
      <span class="cursor-pointer">Reply</span>
    </div>
  </div>

  <button class="text-xs text-gray-400 hover:text-pink-500">
    <i class="fa-regular fa-heart"></i>
  </button>
</div>

  `;
    });
    //likes on post 
    likeCount.innerHTML = "";
    likeCount.innerHTML = `${data.likeCount}`

    fullPage.classList.remove("hidden");
    setTimeout(() => {
        document.addEventListener("click", handleOutsideClick);
    }, 10);

}
function closePost() {
    const fullPage = document.getElementById("openPost");
    fullPage.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");

    // Remove event listener after closing
    document.removeEventListener("click", handleOutsideClick);
}
function handleOutsideClick(e) {
    const fullPage = document.getElementById("openPost");
    const post = document.getElementById("post");

    // If the popup is open AND the click is outside the post content, close it
    if (!fullPage.classList.contains("hidden") && !post.contains(e.target)) {
        closePost();
    }
}


// Add comment

async function addComment(element) {

    const commentInput = document.getElementById('commentContent');
    let postComment = document.getElementById("commentSection");
    const commentText = commentInput.value.trim();
    commentInput.value = "";
    if (!commentText) return;
    const postContainer = document.getElementById('post');
    const postId = postContainer.dataset.postId;
    let response = await fetch("/post/addComment", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            postId,
            comment: commentText,
        }),
    })
    const data = await response.json();

    postComment.innerHTML += `
   <div class="flex items-start space-x-3 space-y-2">
  <img src="${data.profilePic}" alt="${data.userName}'s profile picture"
       class="w-8 h-8 rounded-full object-cover overflow-hidden" />

  <div class="flex-1 text-sm text-white">
    <div>
      <span class="font-semibold mr-1">${data.userName}</span>
      <span class="text-gray-300">${commentText}</span>
    </div>
    <div class="flex text-xs text-gray-400 space-x-4 mt-1">
      <span></span>
      <span class="cursor-pointer">Reply</span>
    </div>
  </div>

  <button class="text-xs text-gray-400 hover:text-pink-500">
    <i class="fa-regular fa-heart"></i>
  </button>
</div>

  `

}


//Add comment from home 

async function addCommentFromHome(button, postId) {
    // Get input field related to this specific button
    const commentInput = button.parentElement.querySelector('.commentContent');
    const commentText = commentInput.value.trim();
    if (!commentText) return;

    // Clear the input early
    commentInput.value = "";

    try {
        const response = await fetch("/post/addComment", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId,
                comment: commentText,
            }),
        });

        const data = await response.json();
        if (data.success) {
            console.log("Comment added:", data.comment);
            // Optionally update UI here
        } else {
            console.error("Comment failed:", data.message);
        }
    } catch (err) {
        console.error("Error while commenting:", err);
    }
}


// see others profile

