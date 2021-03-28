import postApi from './api/postApi.js';
import utils from './utils.js';


const renderPost = (post) => {
  console.log('Post: ', post);
  // Set banner image
  utils.setBackgroundImageByElementId('postHeroImage', post.imageUrl);
  // Set title
  utils.setTextByElementId('postDetailTitle', post.title);
  // Set author
  utils.setTextByElementId('postDetailAuthor', post.author);
  // Set date time
  const dateString = utils.formatDate(post.createdAt);
  utils.setTextByElementId('postDetailTimeSpan', dateString);
  // Set description
  utils.setTextByElementId('postDetailDescription', post.description);

};

const renderEditLink = (post) => {
  //   editLink.innerHTML = '<i class="fas fa-edit"></i> Edit post';
  const editlink = document.querySelector('#goToEditPageLink');
  if (editlink) {
    editlink.href = `add-edit-post.html?postId=${post.id}`;
    editlink.innerHTML = `<i class="fas fa-edit"></i> Edit post`;
  }

};

// -----------------------
// MAIN LOGIC
// -----------------------
const init = async () => {
  try {
    // Retrieve postId from query params
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('postId');
    if (!postId) return;

    // Fetch post detail by id
    const post = await postApi.getDetail(postId);

    // render post
    renderPost(post);

    // update edit link
    renderEditLink(post);

  } catch (error) {
    console.log(error);
  }

};

init();


