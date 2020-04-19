from bs4 import BeautifulSoup
import requests
import sys

if __name__ == "__main__":
    url="https://www.eneldistribuicaosp.com.br/para-sua-casa/tarifa-de-energia-eletrica"
    html_content = requests.get(url).text

    soup = BeautifulSoup(html_content, 'html.parser')

    tables = soup.findAll("table")
    tarifa_branca = tables[3]

    trs = tarifa_branca.findAll("tr")
    precos = trs[4]

    tds = precos.findAll("td")

    valores = tds[1:]
    tarifas = [0, 0, 0]

    for i, valor in enumerate(valores):
        tarifas[i%3] += float(valor.text.replace(",", ".").replace("\u200b", ""))

sys.stdout.write("%f, %f, %f" % (tarifas[0], tarifas[1], tarifas[2]))
