'use strict';

/* Helpers */
const {['log']: log} = console;

document.addEventListener('DOMContentLoaded', function() {
    const $app = document.getElementById('app');
    const $inputSearch = document.getElementById('df_search_input');
    const $searchError = document.querySelector('.df-search__error');
    const $btnSearch = document.getElementById('btn_search');

    const SEARCH_ERROR_MESSAGES = {
        'emptyValue': 'Please enter developer username',
    }

    $btnSearch.addEventListener('click', handleClickButtonSearch)

    function handleClickButtonSearch() {
        validateSearchForm() ?
            toggleAppState('loading') :
            toggleAppState('error');
    }

    /**
     * @description Toggle app state
     * @param {string} state New app state (loading | found | error)
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
});