import requests, unicodedata
from itertools import product

def init_dictionary(url:str) -> list[str]:
    dictionary = []
    
    for word in requests.get(url).text.split('\n'):
        word = ''.join(c for c in unicodedata.normalize('NFD', word) if unicodedata.category(c) != 'Mn')
        if set(word).issubset(list(LETTERS)): dictionary.append(word)

    return list(set(dictionary))

def init_letters() -> dict[chr:int]:
    letters = {chr(i):0 for i in range(97, 123)}|{'-':0, "'":0}

    while True:
        try:
            print(letters)
            l, n = input('Enter letter `l` and number `n` (ln) or anything to pass: ').split('')
            letters[l] = int(n)
        except: break

    return letters

LETTERS = init_letters()
DICTIONARY = init_dictionary('https://raw.githubusercontent.com/hbenbel/French-Dictionary/master/dictionary/dictionary.csv')
WORDS_LENGTH = map(lambda n: int(n), input('Enter the length of each word separate by a space: ').split(' '))

def try_possibilities():
    def check_string(string): return all([string.count(c) <= LETTERS[c] for c in LETTERS])
    def find_word_by_length(length:int): return [word for word in DICTIONARY if len(word) == length]

    possibilities = ['']

    for n in WORDS_LENGTH:
        possibilities = [string + ' ' + word for string, word in product(possibilities, find_word_by_length(n)) if check_string(string + ' ' + word)]

    return possibilities

print(try_possibilities())
