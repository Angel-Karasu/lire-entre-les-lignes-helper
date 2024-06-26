import {available_letters, generate_possibilities} from "./helper.js";

let possibilities_html, word_html, words_html;

function add_letters() {
    const letters_html = document.querySelector('#letters');
    const letter_html = document.querySelector('.letter');

    Object.keys(available_letters).forEach(letter => {
        let let_html = letter_html.cloneNode(true);
        let_html.querySelector('span').textContent = letter;
        letters_html.appendChild(let_html);
    });

    letter_html.remove();
}

function remove_letters_value() {
    for (let letter of document.querySelectorAll('.letter input')) letter.value = '';
}

function update_word_number(n) {
    let words = document.querySelectorAll('.word');

    Array.from(words).slice(n).forEach((word, i) => {
        word.querySelector('span').textContent = n+i;
        let input = word.querySelector('input');
        input.placeholder = `Word ${n+i} length`;
    });

    words[1].querySelector('.remove-word-button').style.visibility = words.length < 3 ? 'hidden':'';
}

function add_word() {
    let word = word_html.cloneNode(true);
    word.querySelector('.remove-word-button').onclick = () => remove_word(word);
    words_html.appendChild(word);
    update_word_number(document.querySelectorAll('.word').length - 1)
}

function remove_word(word) {
    const n = Array.from(document.querySelectorAll('.word')).indexOf(word);
    word.remove();
    update_word_number(n);
}

function show_possibilities() {
    let letters = {};
    for (let letter of document.querySelectorAll('.letter')) letters[letter.querySelector('span').textContent] = +letter.querySelector('input').value;
    generate_possibilities(
        Array.from(document.querySelectorAll('.word')).slice(1).map(word => +word.querySelector('input').value),
        letters
    ).then(possibilities => {
        console.log(possibilities);
        possibilities_html.innerHTML = '';
        possibilities.forEach(possibility => {
            let span = document.createElement('span');
            span.innerHTML = possibility;
            possibilities_html.appendChild(span);
        });
    });
}

window.onload = () => {
    possibilities_html = document.querySelector('#possibilities');
    word_html = document.querySelector('.word').cloneNode(true);
    word_html.style.display = '';
    words_html = document.querySelector('#words');

    document.querySelector('#add-word').onclick = add_word;
    document.querySelector('#remove-letters-value-button').onclick = remove_letters_value;
    document.querySelector('#show-possibilities-button').onclick = show_possibilities;

    add_letters();
    add_word();
};