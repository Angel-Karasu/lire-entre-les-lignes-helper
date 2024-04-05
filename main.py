import requests, unicodedata
from itertools import product

def check_string(string): return all([string.count(c) <= LETTERS[c] for c in set(string.replace(' ', ''))])

def init_dictionary(url:str) -> list[str]:
    dictionary = []
    
    for word in requests.get(url).text.split('\n'):
        word = ''.join(c for c in unicodedata.normalize('NFD', word) if unicodedata.category(c) != 'Mn')
        if set(word).issubset(LETTERS.keys()) and check_string(word): dictionary.append(word)

    return list(set(dictionary))

def init_letters() -> dict[chr:int]:
    letters = {chr(i):0 for i in range(97, 123)}|{'-':0, "'":0}

    while True:
        try:
            print(letters)
            l, n = input('Enter letter `l` and number `n` (ln) or anything to pass: ')
            letters[l] = int(n)
        except: break

    return letters

LETTERS = init_letters()
DICTIONARY = init_dictionary('https://raw.githubusercontent.com/hbenbel/French-Dictionary/master/dictionary/dictionary.csv')
WORDS_LENGTH = map(lambda n: int(n), input('Enter the length of each word separate by a space: ').split(' '))

def try_possibilities():
    words_dict = {n:[] for n in WORDS_LENGTH}

    for word in DICTIONARY:
        try: words_dict[len(word)].append(word)
        except: pass

    possibilities = list(words_dict.values())[0]

    for words in WORDS_LENGTH[1:]:
        possibilities = [string + ' ' + word for string, word in product(possibilities, words) if check_string(string + word)]

    return possibilities

def export_possibilities(possibilities, file='possibilities.txt'):
    with open(file, 'w+', encoding='utf-8') as f: f.write('\n'.join(possibilities))

export_possibilities(try_possibilities())

print('Done !')
