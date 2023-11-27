let imgs_1 = document.querySelector(".imgs_1")
let content_1 = document.querySelector(".content_1")

window.onscroll = function() {
    if (this.scrollY >= 900) {
        imgs_1.classList.add("show")
    } else {
        imgs_1.classList.remove("show")
    } if (this.scrollY >= 500) {
        content_1.classList.add("show")
    } else {
        content_1.classList.remove("show")
    }
}
