import { postPosts } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";


export function renderAddPostPageComponent({ token, appEl, onAddPostClick }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста

    let imageUrl = "";

    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">
          Добавить пост
        </h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
            <label>
              <p>Добавьте комментарий:</p>
              <br>
              <textarea class="input textarea" rows="4"></textarea>
            </label>
          <div class="form-error"></div>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>`;


    appEl.innerHTML = appHtml;


    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });


    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });


    document.getElementById("add-button").addEventListener("click", () => {

      const inputText = document.querySelector("textarea");
      const inputImage = document.querySelector(".file-upload-image");

      onAddPostClick({
        description: inputText.value,
        imageUrl: inputImage.src,
      });

      postPosts({
        token,
        description: inputText.value,
        imageUrl: inputImage.src,
      })
        .then(() => {

          render();
        });
    });
  };

  render();
}
