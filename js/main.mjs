'use strict';
import AppConstants from './appConstants.js';
import postApi from './api/postApi.js';
import utils from './utils.js';

const handleEditElement = (post) => {
  if (!post.id) return;
  window.location = `add-edit-post.html?postId=${post.id}`;

};

const handleRemoveElement = async (post, postLiElement) => {
  const confirmMessage = `Are you sure delete: ${post.title}`;
  if (window.confirm(confirmMessage)) {
    console.log('Delete ', post);
    const postId = post.id;
    console.log(postId);
    const remove = await postApi.remove(postId);
    // console.log(remove);
    postLiElement.remove();
  }

};

const buildPostItem = (post) => {

  //call template
  const postTemplate = document.querySelector('#postItemTemplate');
  if (!postTemplate) return;


  const postFragment = postTemplate.content.cloneNode(true);

  const postLiElement = postFragment.querySelector('li');

  // make loading on each item
  const postItem = postFragment.querySelector('#postItem');
  const load = postFragment.querySelector('#loading');
  postItem.style.display = 'none';
  setTimeout(() => {
    load.style.display = 'none';
    postItem.style.display = 'block';
  }, 2700);

  const postImgElement = postFragment.querySelector('#postItemImage');
  if (postImgElement) {

    const changeImg = post.imageUrl;

    postImgElement.src = changeImg;
  }

  const postTitleElement = postFragment.querySelector('#postItemTitle');
  if (postTitleElement) {
    postTitleElement.innerText = post.title;
  }

  const postDecriptionElement = postFragment.querySelector('#postItemDescription');
  if (postDecriptionElement) {
    postDecriptionElement.innerText = utils.truncateTextlength(post.description, 50);
  }
  const postAuthorElement = postFragment.querySelector('#postItemAuthor');
  if (postAuthorElement) {
    postAuthorElement.innerText = post.author;
  }

  const postTimeElement = postFragment.querySelector('#postItemTimeSpan');
  if (postTimeElement) {
    const datestring = utils.formatDate(post.createdAt);
    postTimeElement.innerText = datestring;
  }

  const postDetailElement = postLiElement.querySelector('#goToDetailPageLink');
  if (postDetailElement) {
    postDetailElement.href = `post-detail.html?postId=${post.id}`;
  }

  const postEditElement = postLiElement.querySelector('#postItemEdit');
  if (postEditElement) {


    postEditElement.addEventListener('click', () => handleEditElement(post));
  }

  const postRemoveElement = postLiElement.querySelector('#postItemRemove');
  if (postRemoveElement) {
    postRemoveElement.addEventListener('click', () => handleRemoveElement(post, postLiElement));
  }

  return postLiElement;

};


const renderUIPost = (posts) => {
  if (!Array.isArray(posts)) return;
  const postListElement = document.querySelector('#postsList');
  if (!postListElement) return;
  for (const post of posts) {
    const postItemElement = buildPostItem(post);
    if (postItemElement) {
      postListElement.appendChild(postItemElement);
    }
  }

};
const removeAttrActive = (liPagination) => {
  for (const liElment of liPagination) {
    liElment.removeAttribute('active');
  }
};

const setActivePage = (liPagination, objValidate) => {
  const params = new URLSearchParams(window.location.search);
  const page = Number(params.get('_page'));
  if (page === 1 || !page) {
    liPagination[1].classList.add('active')
  } else if (page === objValidate.totalPage) {
    if (page > 2) {
      liPagination[3].classList.add('active');
    } else {
      liPagination[2].classList.add('active');
    }
  } else {
    liPagination[2].classList.add('active');
  }
};
const setHrefFirstPage = (aPagination, liPagination, objValidate) => {
  const page = 1;

  aPagination[1].href = `index.html?_page=${page}&_limit=6`;
  aPagination[1].innerText = page;



  aPagination[2].href = `index.html?_page=${page + 1}&_limit=6`;
  aPagination[2].innerText = page + 1;


  aPagination[3].href = `index.html?_page=${page + 2}&_limit=6`;
  aPagination[3].innerText = page + 2;
  aPagination[4].href = `index.html?_page=${page + 1}&_limit=6`;
  liPagination[0].classList.add('disabled');
};

const setHrefEndPage = (aPagination, liPagination, objValidate) => {
  const page = objValidate.curPage;

  aPagination[3].href = `index.html?_page=${page}&_limit=6`;
  aPagination[3].innerText = page;


  aPagination[2].href = `index.html?_page=${page - 1}&_limit=6`;
  aPagination[2].innerText = page - 1;

  aPagination[1].href = `index.html?_page=${page - 2}&_limit=6`;
  aPagination[1].innerText = page - 2;


  aPagination[0].href = `index.html?_page=${page - 1}&_limit=6`;
  liPagination[4].classList.add('disabled');

};

const setHrefMidPage = (aPagination, liPagination, objValidate) => {
  const page = objValidate.curPage;

  aPagination[2].href = `index.html?_page=${page}&_limit=6`;
  aPagination[2].innerText = page;

  aPagination[3].href = `index.html?_page=${page + 1}&_limit=6`;
  aPagination[3].innerText = page + 1;

  aPagination[1].href = `index.html?_page=${page - 1}&_limit=6`;
  aPagination[1].innerText = page - 1;

  aPagination[0].href = `index.html?_page=${page - 1}&_limit=6`;
  aPagination[4].href = `index.html?_page=${page + 1}&_limit=6`;

}

const renderPagination = async (pagination) => {
  try {
    const postsPagination = document.querySelector('#postsPagination');
    if (postsPagination) {
      const totalPage = Math.ceil(pagination._totalRows / pagination._limit);
      const curPage = pagination._page;
      const objValidate = { curPage, totalPage };
      const aPagination = postsPagination.querySelectorAll('a.page-link');
      const liPagination = postsPagination.querySelectorAll('li.page-item');
      if (totalPage < 1) return;
      if (!curPage || curPage === 1) {
        removeAttrActive(liPagination);
        setHrefFirstPage(aPagination, liPagination, objValidate);
        setActivePage(liPagination, objValidate);
      }

      else if (curPage === totalPage) {
        removeAttrActive(liPagination);
        setHrefEndPage(aPagination, liPagination, objValidate);
        setActivePage(liPagination, objValidate);
      }
      else {
        removeAttrActive(liPagination);
        setHrefMidPage(aPagination, liPagination, objValidate);
        setActivePage(liPagination, objValidate);
      }
    }
    postsPagination.removeAttribute('hidden');
  } catch (error) {
    throw error
  }
};

// -----------------------
// MAIN LOGIC
// -----------------------
const init = async () => {
  try {

    let search = window.location.search;
    search = search ? search.substring(1) : '';
    const { _page, _limit } = window.Qs.parse(search);
    const params = {
      _page: _page || AppConstants.DEFAULT_PAGE,
      _limit: _limit || AppConstants.DEFAULT_LIMIT,
      _sort: 'updatedAt',
      _order: 'desc',
    };

    let newPostList = await postApi.getAll(params);
    console.log(newPostList);
    if (newPostList) {
      const { data: posts, pagination } = newPostList;

      renderUIPost(posts);
      renderPagination(pagination);
    }

    anime({
      targets: 'ul.posts-list>li',
      scale: [
        { value: 0, duration: 0 },
        { value: 1, duration: 500 }
      ],
      translateX: [
        { value: -50, duration: 500 },
        { value: 0, duration: 500 }
      ],
      delay: anime.stagger(150),
      easing: 'linear',

    });



  } catch (error) {
    console.log(error);
  }

};
init();