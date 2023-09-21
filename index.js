// initial user profile
const defaultProfile = {
  id: "hello.world",
  img: "assets/default_profile.svg",
  name: "헬로월드",
  description: `Hello, World!`,
  link: "https://en.wikipedia.org/wiki/%22Hello,_World!%22_program",
  posts: 0,
  followers: 103,
  follows: 96,
};

// constant elements
const postModal = document.querySelector(".post-modal");
const addPost = document.querySelector("#add-post");
const addPostModal = document.querySelector(".add-post-modal");
const addPostModalPost = document.querySelector(".add-post-modal__post");
const addPostFileInput = document.getElementById("add-post-file");
const addPostModalCloseBtn = addPostModal.querySelector(".modal__close-button");
const addPostShareButton = document.getElementById("add-post-share");
const addPostModalTextarea = addPostModal.querySelector(
  ".add-post-modal__textarea"
);
const postsGallery = document.querySelector(".posts__gallary");

const profileImg = document.getElementById("profile-img");
const profileId = document.getElementById("profile-id");
const profilePosts = document.getElementById("profile-posts");
const profileFollowers = document.getElementById("profile-followers");
const profileFollows = document.getElementById("profile-follows");
const profileName = document.getElementById("profile-name");
const profileDescription = document.getElementById("profile-description");
const profileLink = document.getElementById("profile-link");

const updateProfileImg = document.getElementById("update-profile-img");
const updateProfileId = document.getElementById("update-profile-id");
const updateProfileName = document.getElementById("update-profile-name");
const updateProfileDescription = document.getElementById(
  "update-profile-description"
);
const updateProfileFile = document.getElementById("update-profile-file");
const updateProfileSave = document.getElementById("update-profile-save");
const updateProfileLink = document.getElementById("update-profile-link");
const updateProfileBtn = document.getElementById("update-profile-btn");
const updateProfileModal = document.querySelector(".update-profile-modal");
const updateProfileCloseBtn = updateProfileModal.querySelector(
  ".modal__close-button"
);

window.addEventListener("load", () => {
  initEvents();
  updateProfileUI();
  updatePostsUI();
});

function initEvents() {
  addPost.addEventListener("click", () => addPostModal.showModal());
  addPostModalCloseBtn.addEventListener("click", () => {
    addModalShareToFileMode();
  });
  addPostFileInput.addEventListener("change", handleFileInputChangePost);

  updateProfileBtn.addEventListener("click", () =>
    updateProfileModal.showModal()
  );

  updateProfileSave.addEventListener("click", handleUpdateProfileSave);
  updateProfileCloseBtn.addEventListener("click", () => {
    updateProfileUI();
  });
  updateProfileFile.addEventListener("change", handleFileInputChangeProfile);
}

function updateUI() {
  updatePostsUI();
  updateProfileUI();
}

function updateProfileUI() {
  const profile = JSON.parse(localStorage.getItem("profile")) || defaultProfile;
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  document.title = `${profile.name}(@${profile.id}) • Instagram`;
  profile.posts = posts.length;

  profileImg.setAttribute("src", profile.img);
  profileId.innerText = profile.id;
  profilePosts.querySelector("strong").innerText = profile.posts;
  profileFollowers.querySelector("strong").innerText = profile.followers;
  profileFollows.querySelector("strong").innerText = profile.follows;
  profileName.innerText = profile.name;
  profileDescription.innerText = profile.description;
  profileLink.innerText = profile.link;
  profileLink.setAttribute("href", profile.link);

  updateProfileImg.setAttribute("src", profile.img);
  updateProfileId.value = profile.id;
  updateProfileName.value = profile.name;
  updateProfileLink.value = profile.link;
  updateProfileDescription.value = profile.description;
}

function handleUpdateProfileSave() {
  const { id, img, name, description, link, ...rest } =
    JSON.parse(localStorage.getItem("profile")) || defaultProfile;

  const newProfile = {
    id: updateProfileId.value,
    img: updateProfileImg.getAttribute("src"),
    name: updateProfileName.value,
    description: updateProfileDescription.value,
    link: updateProfileLink.value,
    ...rest,
  };

  localStorage.setItem("profile", JSON.stringify(newProfile));

  updateProfileUI();
}

function updateProfile(newProfile) {
  localStorage.setItem("profile", JSON.stringify(newProfile));

  updateProfileUI();
}

function handleFileInputChangeProfile() {
  const fr = new FileReader();

  fr.readAsDataURL(this.files[0]);

  const loadEvent = fr.addEventListener("load", function () {
    updateProfileImg.setAttribute("src", fr.result);
  });

  fr.removeEventListener("load", loadEvent);
}

function whichDialogOpen() {
  const allDialogs = Array.from(document.querySelectorAll("dialog.post-modal"));
  if (!allDialogs) return;

  const openedDialog = allDialogs.find(({ open }) => open);
  return openedDialog && openedDialog.parentNode.id;
}

function updatePostsUI() {
  const openedDialogPostId = whichDialogOpen();

  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  if (!posts.length) {
    postsGallery.classList.add("posts__gallary--no-posts");
    postsGallery.innerHTML = `<div class="posts__no-posts">
                                <div class="posts__circle">
                                  <img src="assets/camera_icon.svg" alt="camera_icon" />
                                </div>
                                <h3>게시물 없음</h3>
                              </div>`;
    return;
  }

  postsGallery.classList.remove("posts__gallary--no-posts");
  const innerHTML = posts.reduce((acc, post) => {
    return (
      acc +
      `<div class="post" id="post-${post.id}">
        <div class="post__info">
          <div class="post__info-item">
            <img src="assets/heart_icon.svg" alt="heart_icon" />
            ${post.likes}
          </div>
          <div class="post__info-item">
            <img src="assets/comment_icon.svg" alt="comment_icon" />
            ${post.comments}
          </div>
        </div>
        <img src="${post.image}" alt="post-${post.id}" />
        <dialog class="post-modal modal post-modal--view-mode">
          <form method="dialog">
            <img
              class="modal__image"
              src="${post.image}"
              alt="post-${post.id}"
            />
            <article class="post-modal__article">
              ${post.text}
            </article>
            <div class="post-modal__update">
              <textarea class="post-modal__textarea" placeholder="여기에 수정할 내용을 작성하세요.">${post.text}</textarea>
              <div class="post-modal__update-buttons">
                <button class="post-modal__update-submit-button">수정</button>
                <button class="post-modal__update-cancel-button">취소</button>
              </div>
            </div>

            <div class="post-modal__buttons">
              <button class="post-modal__button post-modal__update-button">
                <img src="assets/edit_icon.svg" alt="edit_icon" />
              </button>
              <button class="post-modal__button post-modal__delete-button"> 
                <img
                  src="assets/trashcan_icon.svg"
                  alt="trashcan_icon"
                />
              </button>
            </div>

            <button class="modal__close-button">
              <img src="assets/close_icon.svg" alt="close_icon" />
            </button>
          </form>
        </dialog>
      </div>`
    );
  }, "");

  postsGallery.innerHTML = innerHTML;

  posts.forEach(({ id, text }) => {
    const post = document.getElementById(`post-${id}`);

    if (!post) return;

    const postModal = post.querySelector(".post-modal");

    if (openedDialogPostId === `post-${id}`) postModal.showModal();

    post.addEventListener("click", () => postModal.showModal());

    postModal
      .querySelector(".modal__close-button")
      .addEventListener("click", () => {
        postModalUpdateToViewMode(postModal, text);
      });

    post
      .querySelector(".post-modal__delete-button")
      .addEventListener("click", () => {
        confirm("정말로 삭제하시겠습니까?") && deletePost(id);
      });

    post
      .querySelector(".post-modal__update-button")
      .addEventListener("click", (e) => {
        e.preventDefault();

        postModalViewToUpdateMode(postModal);
      });

    post
      .querySelector(".post-modal__update-submit-button")
      .addEventListener("click", (e) => {
        e.preventDefault();

        updatePost(id, postModal.querySelector(".post-modal__textarea").value);
      });

    post
      .querySelector(".post-modal__update-cancel-button")
      .addEventListener("click", (e) => {
        e.preventDefault();

        postModalUpdateToViewMode(postModal, text);
      });
  });
}

function postModalViewToUpdateMode(postModal) {
  postModal.classList.remove("post-modal--view-mode");
  postModal.classList.add("post-modal--update-mode");
}

function postModalUpdateToViewMode(postModal, originText) {
  postModal.querySelector(".post-modal__textarea").value = originText;
  postModal.classList.add("post-modal--view-mode");
  postModal.classList.remove("post-modal--update-mode");
}

function createPost(image, text) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const newPost = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    likes: 0,
    comments: 3,
    image,
    text,
  };

  posts.push(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));

  updateUI();
}

function deletePost(id) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  if (!posts.length) return;

  localStorage.setItem(
    "posts",
    JSON.stringify(posts.filter(({ id: postId }) => id !== postId))
  );

  updateUI();
}

function updatePost(id, text) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  if (!posts.length) return;

  localStorage.setItem(
    "posts",
    JSON.stringify(
      posts.map(({ id: postId, text: postText, ...rest }) =>
        id === postId
          ? { id: postId, text, ...rest }
          : { id: postId, text: postText, ...rest }
      )
    )
  );

  updatePostsUI();
}

function addModalShareToFileMode() {
  addPostModal.classList.remove("add-post-modal--share-mode");
  addPostModal.classList.add("add-post-modal--file-mode");
}

function addModalFileToShareMode() {
  addPostModal.classList.remove("add-post-modal--file-mode");
  addPostModal.classList.add("add-post-modal--share-mode");
}

function handleFileInputChangePost() {
  const fr = new FileReader();

  fr.readAsDataURL(this.files[0]);

  const loadEvent = fr.addEventListener("load", function () {
    addModalFileToShareMode();

    addPostShareButton.addEventListener(
      "click",
      () => {
        createPost(fr.result, addPostModalTextarea.value);
        addPostModalTextarea.value = "";

        addModalShareToFileMode();
      },
      { once: true }
    );

    addPostModalPost
      .querySelector(".modal__image")
      .setAttribute("src", fr.result);
  });

  fr.removeEventListener("load", loadEvent);
}
