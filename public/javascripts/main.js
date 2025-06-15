
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
// function showContent(left, content) {
//     document.getElementById(content).classList.remove('hidden');
// }

// //createPost
// let mainContent = document.getElementById('main-content');
// let openBtn = document.getElementById('openBtn');
// //createPost
// let mainContent = document.getElementById('main-content');
// let openBtn = document.getElementById('openBtn');

// function createPost(left, content) {
//     let post = document.getElementById(content);
//     post.classList.remove('hidden');
//     mainContent.classList.add('blur-sm', 'pointer-events-none', 'select-none');
// }
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
//     if (!isOnPost && !isOnButton && !upload.classList.contains("hidden")) {
//         post.classList.add("hidden");
//         mainContent.classList.remove('blur-sm', 'pointer-events-none', 'select-none');
//     }
// });

// //All, reels, posts section content

  function sectionToggle(clickedTab, sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));

    // Show selected section
    document.getElementById(`${sectionId}-section`).classList.remove('hidden');

    // Reset all tab button styles
    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.classList.remove('bg-amber-100', 'bg-amber-700', 'bg-black', 'text-white');
      tab.classList.add('bg-gray-200');
    });

    // Set active tab style
    clickedTab.classList.remove('bg-gray-200');
    clickedTab.classList.add('bg-blue-500', 'text-white');
  }

  // Optional: Default to "posts"
  window.addEventListener('DOMContentLoaded', () => {
    sectionToggle(document.querySelector('.tab-btn'), 'posts');
  });

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
// const cropBtn = document.getElementById('crop-btn');
// const canvas = document.getElementById('canvas');
// let cropper;
// document.addEventListener('DOMContentLoaded', () => {
//     const input = document.getElementById('photo');
//     const previewContainer = document.getElementById('photo-upload');
//     // const cropBtn = document.getElementById('crop-btn');
//     // const canvas = document.getElementById('canvas');
//     // let cropper;

// input.addEventListener('change', function () {
//     const file = input.files[0];
//     if (!file) return;
//     input.addEventListener('change', function () {
//         const file = input.files[0];
//         if (!file) return;

//     const fileType = file.type;
//     previewContainer.innerHTML = ''; // Clear previous
//     // cropBtn.style.display = 'none';
//         const fileType = file.type;
//         previewContainer.innerHTML = ''; // Clear previous
//         // cropBtn.style.display = 'none';

//     const url = URL.createObjectURL(file);
//         const url = URL.createObjectURL(file);

//     if (fileType.startsWith('image/')) {
//         const img = document.createElement('img');
//         img.src = url;
//         previewContainer.appendChild(img);
//         if (fileType.startsWith('image/')) {
//             const img = document.createElement('img');
//             img.src = url;
//             previewContainer.appendChild(img);

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
//     } else if (fileType.startsWith('video/')) {
//         const video = document.createElement('video');
//         video.controls = true;
//         video.src = url;
//         previewContainer.appendChild(video);
//     }
//     document.getElementById("next").classList.remove("hidden");
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


// });
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


//go back
function reverse(element) {
    window.history.back();
}



// For heart animation on double click
// document.querySelectorAll('.container').forEach(function (con) {
//     con.addEventListener("dblclick", function (e) {
//         var heart = con.querySelector('.heart-icon');
//         if (heart) {
//             heart.classList.remove('scale-50', 'opacity-0');
//             heart.classList.add('scale-110', 'opacity-80');
//             setTimeout(function () {
//                 heart.classList.remove('scale-110', 'opacity-80');
//                 heart.classList.add('scale-110', 'opacity-0');
//             }, 900);
//         }
//         var secHeart = con.parentElement.querySelector('.heart-icon-second');
//         if (secHeart) {
//             secHeart.classList.add('text-red-500');
//             secHeart.classList.remove('fa-regular');
//             secHeart.classList.add('fa-solid');
//         }
//     });
// });

// document.querySelectorAll('.all-icons').forEach(function (con2) {
//     let count = 0;
//     var secHeart = con2.querySelector('.heart-icon-second');
//     con2.addEventListener("click", function (e) {
//         if (secHeart) {
//             if (count === 0) {
//                
//                 count = 1;
//             } else {
//                 secHeart.classList.remove('text-red-500');
//                 secHeart.classList.add('fa-regular');
//                 secHeart.classList.remove('fa-solid');
//                 count = 0;
//             }
//         }
//     });
// });

//double click trigger

// document.addEventListener("DOMContentLoaded", () => {
//     const postArea = document.getElementById("post-area-<%= post._id %>");
//     const likeBtn = document.getElementById("like-btn-<%= post._id %>");


//     // // Double click on post
//     // if (postArea) {
//     postArea.addEventListener("dblclick", () => {
//         like(likeBtn, "<%= post._id %>", true);
//         console.log("postArea", postArea);
//     });
//     // }
// });





// Like

async function like(element, postId = "", triggeredByDoubleClick = false) {
    if (!postId) {
        const postElement = document.getElementById('post');
        postId = postElement?.dataset?.postId;

        if (!postId) {
            console.error('Post ID is missing');
            return;
        }
    }

    let likeCount = document.getElementById("likeCount");
    const likeCountSpan = document.getElementById(`likeCount-${postId}`);
    const animatedHeart = document.querySelector(`#heart-animation-${postId}`);
    let currentCount = parseInt(likeCountSpan.textContent.trim(), 10);

    try {
        const response = await fetch(`/post/like/${postId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        const data = await response.json();
        let heartIcon;

        if (triggeredByDoubleClick) {
            const postContainer = element.closest(".post-container");
            heartIcon = postContainer?.querySelector(`#like-icon-${postId}`);
        } else {
            heartIcon = element.querySelector("i") || element;
        }


        if (data.liked) {
            heartIcon.classList.add("fa-solid", "text-red-500");
            likeCountSpan.textContent = currentCount + 1;
            likeCount.innerHTML = `${currentCount + 1}`;
        } else {
            heartIcon.classList.remove("fa-solid", "text-red-500");
            heartIcon.classList.add("fa-regular", "text-gray-500");
            likeCountSpan.textContent = currentCount - 1;
            likeCount.innerHTML = `${currentCount - 1}`;
        }

        // ❤️ Trigger animation only on double click
        // if (triggeredByDoubleClick && animatedHeart) {
        //     animatedHeart.classList.remove("opacity-0", "scale-50");
        //     animatedHeart.classList.add("opacity-100", "scale-100");

        //     setTimeout(() => {
        //         animatedHeart.classList.remove("opacity-100", "scale-100");
        //         animatedHeart.classList.add("opacity-0", "scale-50");
        //     }, 600);
        // }

    } catch (err) {
        console.log(err);
    }
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
    document.body.classList.add("overflow-hidden");
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
            <video id="openPostVideo"   autoplay class="w-full h-full object-cover">
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
    postUserProfile.dataset.userId = data.createdBy.userId;
    postUserProfile.innerHTML = "";
    postUserProfile.innerHTML = `
  <img src="${data.createdBy.userProfile}" class="w-10 h-10 rounded-full object-cover border-2 border-pink-500" />
  <div class="flex items-center gap-1">
<span class="font-semibold text-md">${data.createdBy.userName}</span>
${!data.isOwner ? !data.isFollowing
            ? `<span onclick="followUser('${data.createdBy.userId}')" class="text-md text-blue-500 pl-2 cursor-pointer">Follow</span>`
            : `<span onclick="followUser('${data.createdBy.userId}')" class="text-md text-blue-500 pl-2 cursor-pointer">UnFollow</span>` : ''
        }
   
  </div>
`;


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

async function addComment(element, postId = "") {

    let commentInput = ""
    if (!postId) {
        postId = document.getElementById('post').dataset.postId;
        commentInput = document.getElementById('commentContent')
    }
    else {
        commentInput = element.parentElement.querySelector(".comment-input");
    }


    let postComment = document.getElementById("commentSection");
    const commentText = commentInput.value.trim();
    commentInput.value = "";
    if (!commentText) return;


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
//like 

// document.addEventListener("DOMContentLoaded", () => {
//     const likeBtn = document.getElementById("like-btn");
//     const likeCount = document.getElementById("likeCount");
//     const heartIcon = document.getElementById("heart-icon");
//     const dblHeart = document.getElementById("dbl-heart");
//     const postArea = document.getElementById("post-area");

//     let liked = window.isLiked;

//     // Initial state
//     updateHeartIcon();

//     likeBtn.addEventListener("click", () => {
//         toggleLike();
//     });

//     postArea.addEventListener("dblclick", () => {
//         showDoubleHeart();
//         toggleLike();
//     });

//     function toggleLike() {
//         fetch(`/like/${postId}`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ userId }),
//         })
//             .then(res => res.json())
//             .then(data => {
//                 liked = data.liked;
//                 likeCount.textContent = data.likes;
//                 updateHeartIcon();
//             });
//     }

//     function updateHeartIcon() {
//         if (liked) {
//             heartIcon.setAttribute("fill", "red");
//             heartIcon.setAttribute("stroke", "red");
//             heartIcon.classList.add("scale-110", "transition", "duration-300");
//         } else {
//             heartIcon.setAttribute("fill", "none");
//             heartIcon.setAttribute("stroke", "currentColor");
//             heartIcon.classList.remove("scale-110");
//         }
//     }

//     function showDoubleHeart() {
//         dblHeart.classList.remove("opacity-0");
//         dblHeart.classList.add("opacity-100");
//         setTimeout(() => {
//             dblHeart.classList.remove("opacity-100");
//             dblHeart.classList.add("opacity-0");
//         }, 700);
//     }
// });


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


// manage post(delete,edit etc.)

async function postOptions(element, userId = "") {

    let fullPage = document.getElementById("postManagePopUp");
    fullPage.classList.remove("hidden");
    let option1 = document.getElementById("option1");
    let option2 = document.getElementById("option2");
    if (!userId)
        userId = document.getElementById("postUserProfile").dataset.userId;

    const response = await fetch("/user/userDetails", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId
        }),
    });
    let data = await response.json();
    console.log(data.isOwner);
    if (data.isOwner) {
        option1.classList.remove("hidden");
        option2.classList.add("hidden");
    }
    else {
        option2.classList.remove("hidden");
        option1.classList.add("hidden");

    }
    document.body.classList.add("overflow-hidden");

    setTimeout(() => {
        document.addEventListener("click", handleClick);
    }, 10)
}


function handleClick(e) {
    let fullPage = document.getElementById("postManagePopUp");
    let option1 = document.getElementById("option1");
    let option2 = document.getElementById("option2");
    if (!fullPage.classList.contains("hidden") && !option1.contains(e.target) && !option2.contains(e.target)) {
        fullPage.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
        document.removeEventListener("click", handleClick);

    }

}

//post delete
async function deletePost(element) {
    let openedPost = document.getElementById("post");
    console.log("openedPost", openedPost);
    let postId = openedPost.dataset.postId;
    console.log("postId", postId);
    if (!postId) {
        console.error('Post ID is missing');
        return;
    }
    await fetch("/post/delete", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
    })
        .then(response => response.json())
        .then(data => {
            window.location.href = "/main";


        })
        .catch(err => {
            console.log(" Post deletion failed")
        })
}

//close popup
function closePopUp(element) {
    let fullPage = document.getElementById("postManagePopUp");
    fullPage.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
    document.removeEventListener("click", handleClick);
}

//goto post

function gotoPost(element) {
    let openedPost = document.getElementById("post");
    let postId = openedPost.dataset.postId;

    // Redirect using URL with query param
    window.location.href = `/postDetails?postId=${postId}`;
}



//profile picture

function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('profilePreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }

    // Optional: auto-submit the form
    input.form.submit();
}
//create Post  preview
function previewSelectedImage(event) {
    const input = event.target;
    const preview = document.getElementById("imagePreview");
    const uploadText = document.getElementById("uploadText");

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove("hidden");
            uploadText.classList.add("hidden");
        };

        reader.readAsDataURL(input.files[0]);
    }
}

//follow user

async function followUser(userId) {
    console.log("callled")
    let response = await fetch("/user/addFollower", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({ userId }),
    })
    let data = await response.json();
    console.log(data);


}

// toggle button followers and following


function openFollow(element, id) {
    let follow = document.getElementById('followers');
    let following = document.getElementById('followings');


    let tabs = document.querySelectorAll('.follow-tab');
    tabs.forEach(tab => tab.classList.remove('font-bold', 'opacity-100'));
    tabs.forEach(tab => tab.classList.add('opacity-60'));


    element.classList.add("font-bold", "opacity-100");
    element.classList.remove("opacity-60");

    if (id === 'followers') {
        following.classList.add("hidden");
        follow.classList.remove("hidden");
    } else {
        follow.classList.add("hidden");
        following.classList.remove("hidden");
    }

}


/// story upload


async function uploadStory(element) {
    document.getElementById('storyModal').classList.remove('hidden');


}

document.getElementById('closeModalBtn').onclick = () => {
    document.getElementById('storyModal').classList.add('hidden');
};
document.getElementById('modalBackdrop').onclick = () => {
    document.getElementById('storyModal').classList.add('hidden');
};



function pauseVideo(element, videoId) {
    const ariaLabel = element.getAttribute('aria-label');
    const video = document.getElementById(videoId);
    if (!video) return;

    if (ariaLabel === "Pause") {
        // Video is currently playing, so pause it
        video.pause();
        element.children[0].classList.remove("fa-pause")
        element?.children[1]?.classList.add("fa-play"); // Hide play icon
        element.setAttribute('aria-label', 'Play');
    } else {
        // Video is currently paused, so play it
        video.play();
        element.children[0].classList.add("fa-pause")
        element?.children[1]?.classList.remove("fa-play")
        element.setAttribute('aria-label', 'Pause');
    }
}

function muteVideo(element, videoId) {
    const ariaLabel = element.getAttribute('aria-label');
    const video = document.getElementById(videoId);
    if (!video) return;

    if (ariaLabel === "Mute") {
        // Video is currently playing, so pause it
        video.muted = false;
        element.children[0].classList.remove("fa-volume-mute")
        element.children[1].classList.add("fa-solid"); // Hide play icon
        element.setAttribute('aria-label', 'Unmute');
    } else {
        // Video is currently paused, so play it
        video.muted = true;
        element.children[0].classList.add("fa-volume-mute")
        element.children[1].classList.remove("fa-solid")
        element.setAttribute('aria-label', 'Mute');
    }
}


//save reel

 async function save(element, postId) {
    const icon = element.querySelector('i');

    try {
      const res = await fetch(`/reel/save/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // you can send more if needed
      });

      const result = await res.json();

      if (result.status === 'saved') {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid', 'text-blue-500');
      } else if (result.status === 'unsaved') {
        icon.classList.remove('fa-solid', 'text-blue-500');
        icon.classList.add('fa-regular');
      }
    } catch (err) {
      console.error("Error while saving/un-saving reel:", err);
    }
  }
