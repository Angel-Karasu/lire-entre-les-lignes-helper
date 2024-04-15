export {available_letters, generate_possibilities};

const available_letters = (() => {
    let letters = {'-':0, "'":0};
    for (let i=0; i<26; i++) letters[String.fromCharCode(97+i)] = 0;
    return letters
})();

async function generate_possibilities(words_length = [], letters = {}) {
    const check_string = string => [...new Set(string)].every(c => string.split(c).length -1 <= letters[c]);

    const dictionary_by_length = (() => {
        let dictionary = {};
        [...new Set(words_length)].forEach(length => dictionary[length] = []);
        return dictionary
    })();
    
    let possibilities = [];

    await fetch('https://raw.githubusercontent.com/hbenbel/French-Dictionary/master/dictionary/dictionary.csv').then(res => res.text()).then(words => {
        words.normalize("NFD").replaceAll(/[\u0300-\u036f]/g, '').split('\n').forEach(word => {
            if (words_length.includes(word.length) && check_string(word)) dictionary_by_length[word.length].push(word);
        });
    
        possibilities = dictionary_by_length[words_length[0]];
        for (let length of words_length.slice(1)) {
            let tmp = [];
            possibilities.forEach(string => dictionary_by_length[length].forEach(word => {
                if (check_string(string.replaceAll(' ', '') + word)) tmp.push(string + ' ' + word)
            }));
            possibilities = tmp;
        }
    });

    return possibilities;
}