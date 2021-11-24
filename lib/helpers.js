
export function add(acc, a) {
  return acc + a;
};

export const createSlug = (name) => {
  const tr = {
    'ä': 'a',
    'á': 'a',
    'à': 'a',
    'ã': 'a',
    'â': 'a',
    'ë': 'e',
    'é': 'e',
    'è': 'e',
    'ö': 'o',
    'ô': 'o',
    'ü': 'u',
    'û': 'u'
  };

  const reg = new RegExp(/[,]/gi);
  const arr = Object.keys(tr).map(e => e).join().replace(reg, '');
  const value = name.toLowerCase().toString();
  const del = new RegExp(`[^0-9-zA-Z-&${arr}'/-\\s]`, 'gi')
  const rep1 = new RegExp(/[/'\s]/gi);
  const rep2 = new RegExp(/&/gi);
  const rep3 = new RegExp(/---|--/gi);
  const rep4 = new RegExp(`[${arr}]`, 'gi');

  const slug = value
    .replace(del, '')
    .replace(rep1, '-')
    .replace(rep2, 'en')
    .replace(rep3, '-')
    .replace(rep4, ($0) => tr[$0])

  return slug;
};
