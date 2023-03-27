import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(inputCountry, DEBOUNCE_DELAY));

function inputCountry(evt) {
    const countryName = evt.target.value.trim();
    if (countryName === "") {
        clearSearchCountry();
        return;
    }

    
fetchCountries(countryName)
    .then(response => {
        clearSearchCountry();
        if (response.length > 10) {
            return Notify.info(
                'Too many matches found. Please enter a more specific name.'
            );
        }        
        if (response.length === 1) {
            searchOneCountry(response)
        } else {
            searchListCountry(response);
        }
    })
    .catch(error => {
        clearSearchCountry();
        Notify.failure("Oops, there is no country with that name")
        return error;
    });    
    }

function searchListCountry(response) {
    const markup = response
        .map(el => {
            return `<li class="item_country">
            <img class="img" src="${el.flags.svg}" width = 30 alt="flag">
            <h3 class="title">${el.name.official}</h3>
            </li>`;
        })
        .join('');
    countryList.innerHTML = markup;
}

    
function searchOneCountry(response) {
    const markup = response
    .map(el => {
    return `<div class="item_country"><img class="img" src="${
        el.flags.svg
    }" width=50 alt="flag">
    <h1 class ="title">${el.name.official}</h1></div>
    <p class="text"><span>Capital:</span> ${el.capital}</p>
    <p class="text"><span>Population:</span> ${el.population}</p>
    <p class="text"><span>Languages:</span> ${Object.values(el.languages)}</p>`;
    })
    .join('');
    countryInfo.innerHTML = markup;
}

function clearSearchCountry() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}