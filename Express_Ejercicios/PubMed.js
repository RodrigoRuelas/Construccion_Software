const express = require('express');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const port = 3000;

app.get('/papers', async (req, res) => {
  const term = req.query.term;

  if (!term) {
    return res.status(400).json({ error: 'Falta el parámetro "term"' });
  }

  try {
    // Paso 1: Buscar IDs de artículos usando esearch
    const searchUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
    const searchParams = {
      db: 'pubmed',
      term: term,
      retmode: 'json',
      retmax: 5 // Máximo 5 resultados
    };

    const searchResponse = await axios.get(searchUrl, { params: searchParams });
    const ids = searchResponse.data.esearchresult.idlist;

    if (ids.length === 0) {
      return res.json({ titles: [] });
    }

    // Paso 2: Obtener detalles con efetch
    const fetchUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';
    const fetchParams = {
      db: 'pubmed',
      id: ids.join(','),
      rettype: 'abstract',
      retmode: 'xml'
    };

    const fetchResponse = await axios.get(fetchUrl, { params: fetchParams });
    const xml = fetchResponse.data;

    // Paso 3: Parsear el XML con fast-xml-parser
    const parser = new XMLParser();
    const json = parser.parse(xml);

    const articles = json.PubmedArticleSet?.PubmedArticle || [];
    const titles = [];

    for (const article of Array.isArray(articles) ? articles : [articles]) {
      const title = article?.MedlineCitation?.Article?.ArticleTitle;
      if (title) {
        titles.push(title);
      }
    }

    res.json({ titles });

  } catch (error) {
    console.error('Error consultando PubMed:', error.message);
    res.status(500).json({ error: 'Error consultando PubMed' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

