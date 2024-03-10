'use strict';

/* Helpers */
const {['log']: log} = console;

document.addEventListener('DOMContentLoaded', function() {
    const $app = document.getElementById('app');
    const $searchForm = document.getElementById('search_form');
    const $inputSearch = document.getElementById('df_search_input');
    const $searchError = document.querySelector('.df-search__error');
    /*const $btnSearch = document.getElementById('btn_search');*/

    const $infoElements = {
        'repos': document.querySelector('.df-card__stats-item_repos'),
        'followers': document.querySelector('.df-card__stats-item_followers'),
        'following': document.querySelector('.df-card__stats-item_following'),
        'userName': document.querySelector('.df-card__user-name'),
        'userLink': document.querySelector('.df-card__user-link-wr'),
        'userPhoto': document.querySelector('.df-card__user-link-img'),
        'userNickname': document.querySelector('.df-card__user-nickname'),
        'userBioText': document.querySelector('.df-card__user-bio-text'),
        'btnToProfile': document.getElementById('link_to_profile_btn'),
        'extraInfoLocation': document.querySelector('.df-card__extra-info-item_location'),
        'extraInfoTwitter': document.querySelector('.df-card__extra-info-item_twitter'),
        'extraInfoBlog': document.querySelector('.df-card__extra-info-item_blog'),
        'joined': document.querySelector('.df-card__joined-value'),
        'mainPhoto': document.querySelector('.df-card__user-photo'),
    }

    const API = 'https://api.github.com/users/';
    const SEARCH_ERROR_MESSAGES = {
        'emptyValue': 'Please enter developer username',
    };
    const REQUEST_DELAY = 1000;
    const DEFAULT_USER_AVATAR_LINK = 'assets/icons/icon-github.svg';

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
     * @description Set user data
     * @param {object | null} data user data
     * @returns {void}
     */
    function setUserData(data = null) {
        if (!data) return

        log('data - ', data);

        $infoElements.repos.innerText = data?.public_repos ?
            `${data?.public_repos} Repos` : '-';
        $infoElements.followers.innerText = data?.followers ?
            `${data?.followers} Followers` : '-';
        $infoElements.following.innerText = data?.following ?
            `${data?.following} Following` : '-';
        $infoElements.userName.innerText = data?.name ?
            `${data?.name}` : '-';
        $infoElements.userLink.href = data?.html_url ?
            `${data?.html_url}` : '-';
        $infoElements.userPhoto.src = data?.avatar_url ?
            `${data?.avatar_url}` : DEFAULT_USER_AVATAR_LINK;
        $infoElements.userNickname.innerText = data?.login ?
            `@${data?.login}` : '-';
        $infoElements.userBioText.innerText = data?.bio ?
            `${data?.bio}` : '-';
        $infoElements.userLink.href = data?.html_url ?
            `${data?.html_url}` : '#';
        $infoElements.extraInfoLocation.innerText = data?.location ?
            `${data?.location}` : '#';
        $infoElements.extraInfoLocation.innerText = data?.twitter_username ?
            `${data?.twitter_username}` : 'Not available';
        $infoElements.extraInfoBlog.innerText = data?.blog ?
            `${data?.data?.blog}` : 'Not available';

        if (data?.created_at) {
            const date = new Date(data?.created_at)
            $infoElements.joined.innerText = date.toLocaleDateString()
            $infoElements.joined.setAttribute('datetime', date.toISOString())
        }

        $infoElements.mainPhoto.src = data?.avatar_url ?
            `${data?.avatar_url}` : DEFAULT_USER_AVATAR_LINK;
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