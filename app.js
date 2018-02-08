// Update this with your API key from newsapi.org
const apiKey = 'yourApiKeyHere';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
// You can set this default to wahtever news source you want
const defaultSource = 'techcrunch';

// wait for page to load before fetching
window.addEventListener('load', async (e) => {
  updateNews();
  await updateSources();
  sourceSelector.value = defaultSource;

  // Listens to the selector to update news based on selection
  sourceSelector.addEventListener('change', (e) => {
    updateNews(e.target.value);
  })
})

// Gets a list of possible news sources and populates the select with them
async function updateSources(){
  const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
  const json = await res.json();

  // Convert the JSON response into usable HTML and fill selector with them
  sourceSelector.innerHTML = json.sources.map((src) => `<option value="${src.id}">${src.name}</option>`).join('\n');
}

// Updates news articles, source defaults to what you have set up top if a source is not provided
async function updateNews(source = defaultSource) {
  const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}`);
  const json = await res.json();

  // Calls createArticle function for each article in resonse and then populates/updates page
  main.innerHTML = json.articles.map(createArticle).join('\n');
}

// Used in updateNews function when mapping over JSON response to create useable HTML
function createArticle(article) {
  return `
    <div class="article">
      <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" alt="${article.title}">
        <p>${article.description}</p>
      </a>
    </div>
  `;
}
