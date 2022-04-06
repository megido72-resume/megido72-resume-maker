import re
import requests
import json
from collections import defaultdict
from bs4 import BeautifulSoup

PAT_NUM = re.compile('(\d+)_03.png')
PAT_NAME = re.compile('(.*)（.*）')


def main():
  items = defaultdict(dict)
  for i in range(12):
    url = f'https://megido72-portal.com/megido?page={i+1}&sort=&q='
    res = requests.get(url)
    soup = BeautifulSoup(res.text)
    for item in soup.select('.characters > li'):
      name = item.select('.title')[0].text
      num = item.select('.detail')[0].text
      img_url = item.select('.card > img')[0]['data-original']
      m = PAT_NUM.search(img_url)
      if m:
        img_num = m.group(1)
      else:
        raise Exception(img_url + ' does not match PAT_NUM')
      m = PAT_NAME.match(name)
      if m:
        name = m.group(1)
        items[name]['re_n'] = img_num
      else:
        items[name]['n'] = img_num
      items[name]['num'] = num
  lst = []
  for k, v in sorted(items.items(), key=lambda x: x[1]['num']):
    lst.append({
      'name': k,
      'num': v['num'],
      'n': v.get('n'),
      're_n': v.get('re_n')
    })
  with open('./megido_list.json', 'w') as f:
    json.dump({'list': lst}, f)


if __name__ == '__main__':
  main()
