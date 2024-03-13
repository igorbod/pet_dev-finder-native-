'use strict';

/* Helpers */
const {['log']: log} = console;

document.addEventListener('DOMContentLoaded', function () {
  const $app = document.getElementById('app');
  const $searchForm = document.getElementById('search_form');
  const $inputSearch = document.getElementById('df_search_input');
  const $searchError = document.querySelector('.df-search__error');
  /*const $btnSearch = document.getElementById('btn_search');*/

  const $infoElements = {
    'card': document.querySelector('.df-card'),
  }

  const API = 'https://api.github.com/users/';
  const SEARCH_ERROR_MESSAGES = {
    'emptyValue': 'Please enter developer username',
  };
  const REQUEST_DELAY = 1000;
  const DEFAULT_USER_AVATAR_LINK = 'assets/icons/icon-github.svg';
  const TWITTER_URL = 'https://twitter.com/';
  const NOT_AVAILABLE_TEXT = 'Not available';

  $searchForm.addEventListener('submit', handleSearchSubmit);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (validateSearchForm()) {
      toggleAppState('loading');
      setTimeout(() => {
        searchUser($inputSearch.value);
      }, REQUEST_DELAY)
    } else {
      toggleAppState('error');
    }
  }

  /**
   * @description Render extra info item html element
   * @param {object | null} data
   * @param {string} type Type of data ('twitter' | 'blog')
   * @return {string}
   */
  function renderExtraInfoItem(data, itemType = 'twitter') {

    const url = itemType === 'twitter' ? TWITTER_URL + data : data;
    const urlTitle = itemType === 'twitter' ? '@' + data : data;

    return !data ?
      `<span class="df-card__extra-info-value">${NOT_AVAILABLE_TEXT}</span>` :
      `<a href="${url}" 
            target="_blank" 
            class="df-link df-card__extra-info-value"
            >
              ${urlTitle}
        </a>`
  }

  /**
   * @description Render user card
   * @param {object | null} userData
   * @return {string}
   */
  function renderUserCard(userData = null) {
    if (!userData) return;

    const avatarUrl = userData?.avatar_url ?
      `${userData?.avatar_url}` :
      DEFAULT_USER_AVATAR_LINK;

    const userUrl = userData?.html_url;
    const twitterHtmlLayout = renderExtraInfoItem(userData?.twitter_username, 'twitter')
    const blogHtmlLayout = renderExtraInfoItem(userData?.blog, 'blog')
    const joinDate = new Date(userData?.created_at);

    return `
        <div class="df-card__inner">
          <div class="df-card__col df-card__col_info">
            <div class="df-card__header">
                <ul class="df-card__stats-list">
                    <li class="df-card__stats-item df-card__stats-item_repos">
                        <img class="df-card__stats-icon" src="assets/icons/icon-stats__repos.svg" alt="">
                        <span class="df-card__stats-title">
                          ${userData?.public_repos ? userData?.public_repos + 'Repos' : '-'}
                        </span>
                    </li>
                    <li class="df-card__stats-item df-card__stats-item_followers">
                        <img class="df-card__stats-icon" src="assets/icons/icon-stats__followers.svg" alt="">
                        <span class="df-card__stats-title">
                          ${userData?.followers ? userData?.followers + 'Followers' : '-'}
                        </span>
                    </li>
                    <li class="df-card__stats-item df-card__stats-item_following">
                        <img class="df-card__stats-icon" src="assets/icons/icon-stats__following.svg" alt="">
                        <span class="df-card__stats-title">
                          ${userData?.following ? userData?.following + 'Following' : '-'}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="df-card__user-name-wr">
                <h1 class="df-card__user-name">
                  ${userData?.name ? `${userData?.name}` : '-'}
                </h1>
                <a href="${userUrl}" class="df-card__user-link-wr">
                  <span class="df-card__user-link-img-wr">
                    <img src="${avatarUrl}" alt="" class="df-card__user-link-img">
                  </span>
                  <span class="df-card__user-nickname">
                    ${userData?.login ? '@' + userData?.login : '-'}
                  </span>
                </a>
            </div>
            <div class="df-card__user-bio">
              <div class="df-card__user-bio-text">
                ${userData?.bio ? `${userData?.bio}` : '-'}
              </div>
            </div>
            <div class="df-card__buttons">
                <a href="${userUrl}" class="df-button" id="link_to_profile_btn">
                  <span class="df-button__title">Go to profile</span>
                </a>
            </div>
            <div class="df-card__extra-info">
                <ul class="df-card__extra-info-list">
                    <li class="df-card__extra-info-item df-card__extra-info-item_location">
                        <span class="df-card__extra-info-title">Location</span>
                        <span class="df-card__extra-info-value">
                          ${userData?.location ? userData?.location : '-'}
                        </span>
                    </li>
                    <li class="df-card__extra-info-item df-card__extra-info-item_twitter">
                        <span class="df-card__extra-info-title">Twitter (X)</span>
                        ${twitterHtmlLayout}
                    </li>
                    <li class="df-card__extra-info-item df-card__extra-info-item_blog">
                        <span class="df-card__extra-info-title">Blog</span>
                        ${blogHtmlLayout}
                    </li>
                </ul>
            </div>
            </div>
          <div class="df-card__col df-card__col_photo">
            <div class="df-card__joined">
                <span>Joined</span>
                <time datetime="${joinDate.toISOString()}" class="df-card__joined-value">
                  ${joinDate.toLocaleDateString()}                
                </time>
            </div>
            <div class="df-card__user-photo-wr">
              <img class="df-card__user-photo" src="${avatarUrl}" alt="">
            </div>
          </div>
        </div>        
    `;
  }

  /**
   * @description Set user data
   * @param {object | null} data user data
   * @returns {void}
   */
  function setUserData(data = null) {
    $infoElements.card.innerHTML = '';
    if (!data) return
    log('data - ', data);
    $infoElements.card.insertAdjacentHTML('afterbegin', renderUserCard(data));
  }

  /**
   * @description Toggle app state
   * @param {string} state New app state (loading | complete | invalid | error)
   * @returns {void}
   */
  function toggleAppState(state = '') {
    $app.setAttribute('data-state', state);
  }

  /**
   * @description Validate search input
   * @returns {boolean} Validation result (true | false)
   */
  function validateSearchForm() {
    let result;
    if ($inputSearch.value.trim()) {
      $searchError.innerText = '';
      result = true;
    } else {
      $searchError.innerText = SEARCH_ERROR_MESSAGES.emptyValue;
      result = false;
    }

    return result;
  }

  /**
   * @description Search user
   * @param {string} username
   * @returns {void}
   */
  async function searchUser(username = '') {
    try {
      const response = await fetch(API + username);
      if (response.status !== 200) {
        toggleAppState('error');
      } else {
        const result = await response.json();
        toggleAppState('completed');
        setUserData(result);
      }
    } catch (error) {
      throw new Error(`Error getting user info: ${error}`);
    }
  }
});