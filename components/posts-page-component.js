import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { postIsLiked, postIsDisliked } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */


  const render = () => {

    const postsHTML = posts.
      map((post) => {

        return `<li class="post">
        <div class="post-header" data-user-id=${post.user.id}>
            <img src=${post.user.imageUrl} class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src=${post.imageUrl}>
        </div>
        <div class="post-likes">
          <button data-post-id=${post.id} class="like-button">
            <img src=${!post.isLiked ? './assets/images/like-not-active.svg' : './assets/images/like-active.svg'}>
          </button>
          <p class="post-likes-text">
          <strong>Нравится: </strong >${post.likes.length === 0 ? '0' : post.likes.length === 1 ? post.likes[0].name : post.likes[0].name + ' и ещё ' + (post.likes.length - 1)}
          </p >
        </div >
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
        ${post.createdAt}
        </p>
      </li > `;
      })
      .join("");


    const appHtml = `
        <div class="page-container">
          <div class="header-container"></div>
          <ul class="posts">
          ${postsHTML}
          </ul>
        </div>`;

    appEl.innerHTML = appHtml;


    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });


    for (let userEl of document.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        goToPage(USER_POSTS_PAGE, {
          userId: userEl.dataset.userId,
        });
      });
    }


    // for (let likeEl of document.querySelectorAll(".like-button")) {

    //   likeEl.addEventListener("click", () => {

    //     postIsLiked({
    //       token: getToken(),
    //       id: likeEl.dataset.postId,
    //     })
    //       .then(() => {

    //         // render();
    //       });

    //     console.log('лайкнуто');
    //   });
    // };

    // for (let likeEl of document.querySelectorAll(".like-button")) {

    //   likeEl.addEventListener("click", () => {

    //     postIsDisliked({
    //       token: getToken(),
    //       id: likeEl.dataset.postId,
    //     })
    //       .then(() => {

    //         // render();
    //       });

    //     console.log('разлайкнуто');
    //   });
    // };

    const likeButtons = document.querySelectorAll('.like-button');

    for (let i = 0; i < likeButtons.length; i++) {
      likeButtons[i].addEventListener('click', function () {

        function setLikedPost(newPost) {
          posts[i] = newPost;
        }

        if (!posts[i].isLiked) {

          postIsLiked({
            token: getToken(),
            id: posts[i].id,
          })
            .then((post) => {

              setLikedPost(post.post)
              return render();
            })
            .catch((error) => {

              if (error.message === "Неавторизованный пользователь") {

                alert("Лайкать посты могут только автризованные пользователи");
                return;
              }

              else {
                alert("Что-то пошло не так, попробуй позже");
                console.log(error);
                return;
              }
            });

          console.log('лайкнуто');
        }

        else {

          postIsDisliked({
            token: getToken(),
            id: posts[i].id,
          })
            .then((post) => {

              setLikedPost(post.post)
              return render();
            });

          console.log('разлайкнуто');
        }
      });
    };
  };

  render();
};

