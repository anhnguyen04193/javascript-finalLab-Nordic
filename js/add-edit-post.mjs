import utils from "./utils.js";
import postApi from "./api/postApi.js";

const randomNumber = () => {
    // random Img: 100-2000
    const number = Math.trunc(Math.random() * (2000 - 100));
    return 100 + number;
};

const randomBannerImg = () => {
    const randomId = randomNumber();
    const bannerURL = `https://picsum.photos/id/${randomId}/1368/400`;
    utils.setBackgroundImageByElementId('postHeroImage', bannerURL);
};

const getPostFormValues = () => {
    return {
        title: utils.getValueByElementId('postTitle'),
        author: utils.getValueByElementId('postAuthor'),
        description: utils.getValueByElementId('postDescription'),
        imageUrl: utils.getBackgroundImageByElementId('postHeroImage'),
    }
};

const validatePostForm = (formValue) => {
    let isValid = true;
    // check title + author
    if (formValue.title.trim() === '') {
        isValid = false;
        utils.addClassByElementId('postTitle', ['is-invalid'])
    }
    if (formValue.author.trim() === '') {
        isValid = false;
        utils.addClassByElementId('postAuthor', ['is-invalid'])
    }

    return isValid;
};

const resetValidationError = () => {
    utils.removeClassByElementId('postTitle', ['is-invalid']);
    utils.removeClassByElementId('postAuthor', ['is-invalid']);
};

const handlePostSubmitForm = async (e, postId, button, loading) => {
    e.preventDefault();

    //reset validation error
    resetValidationError();
    //Get form value
    const formValue = getPostFormValues();
    console.log(formValue);

    //Validate form Value
    // Require :title + author
    const isValid = validatePostForm(formValue);
    if (!isValid) return;

    try {
        if (!postId) {
            //call API to create new post
            const post = await postApi.add(formValue);

            button.style.display = 'none';
            loading.style.display = 'inline-block';
            setTimeout(() => {
                loading.style.display = 'none';
                button.style.display = 'inline-block';
                // Redirect edit mode
                const editPostURL = `add-edit-post.html?postId=${post.id}`;
                window.location = editPostURL;
                //Inform user: post created
                alert('Add new post successfully');
            }, 3000);

        } else {
            const post = {
                id: postId,
                ...formValue,
            };
            const post1 = await postApi.update(post);
            button.style.display = 'none';
            loading.style.display = 'inline-block';
            setTimeout(() => {
                loading.style.display = 'none';
                button.style.display = 'inline-block';
                alert('Update new post successfully');
            }, 3000);
        }

    } catch (error) {
        alert(`Fail to add new post: ${error}`);
    }

};

const getDataFromDetail = (post) => {
    utils.setValueByElementId('postTitle', post.title);
    utils.setValueByElementId('postAuthor', post.author);
    utils.setValueByElementId('postDescription', post.description);
    utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl);
};

// MAIN LOGIC
const init = async () => {
    // Search postId
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    // define variable edit or add
    const mode = postId ? 'edit' : 'add';

    if (mode === 'add') {
        //add
        randomBannerImg();

    } else {
        //edit
        if (!postId) return;
        //fetch postId
        const post = await postApi.getDetail(postId);
        //fill data
        getDataFromDetail(post);

        const editlink = document.querySelector('#goToDetailPageLink');
        if (editlink) {
            editlink.href = `post-detail.html?postId=${post.id}`;
            editlink.innerHTML = `<i class="fas fa-kiss-beam"></i> View Detail Post`;
        }
    }

    // Bind events : form submit + change banner img

    const postForm = document.querySelector('#postForm');
    if (postForm) {
        const button = postForm.querySelector('#bt1');
        const loading = postForm.querySelector('#loading');
        loading.style.display = 'none';
        postForm.addEventListener('submit', (e) => handlePostSubmitForm(e, postId, button, loading));
    }
    const changeBannerImg = document.querySelector('#postChangeImage');
    if (changeBannerImg) {
        changeBannerImg.addEventListener('click', randomBannerImg);
    }
};
init();