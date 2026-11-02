
export default async function getRandomGitHubRepo ( lang ) {
    const randomPage = Math.floor(Math.random() * 10) + 1

    const url = `https://api.github.com/search/repositories?q=language:${lang}+stars:>50&page=${randomPage}&per_page=100`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github+json'
            }
        })
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error(`Too many requests`)
            }
            throw new Error(`Fetch response: ${response.status}`)
        }

        const data = await response.json();
        const repos = data.items;

        if (!repos || repos.length === 0) {
        throw new Error('Репозитории не найдены');
        }

        return repos;

    } catch (e) {
        console.error(e.message);
        throw new Error(e);
    }
}
