import './searchRepositoryForm.css'
import getRandomGitHubRepo from '../api/gitHubAPI.js'
import { useState } from 'react'
import icon from '../assets/icon.jpg'

const LANGUAGES = [
  { label: 'Select a Language', value: '' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Rust', value: 'rust' },
  { label: 'PHP', value: 'php' },
  { label: 'Ruby', value: 'ruby' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
];

export default function Form () {
    const [repoData, setRepoData] = useState('Please select Language')
    const [submitBtn, setSubmitBtn] = useState()
    const [repoDataClass, setRepoDataClass] = useState('')

    const submitHandler = async (e) => {
        e.stopPropagation()
        
        if (!e.target.value) { return }

        let repos, randomIndex

        try {
            setRepoData('Loading, please wait...')
            repos = await getRandomGitHubRepo(e.target.value)
            randomIndex = Math.floor(Math.random() * repos.length);

            setRepoDataClass('got-data')
            setRepoData(<StructuredData repo={repos[randomIndex]}/>)
        } catch {
            setRepoDataClass('got-error')
            setRepoData('Error fetching repositorioes')
            setSubmitBtn(<SubmitBtn text={'Try again...'}/>)
        }
        

        setSubmitBtn(<SubmitBtn text={'Refresh'} 
                            repos={repos} 
                            changeRepoData={setRepoData}/>)
    }

    return (
        <form className='form'>
            <div className='form-head'>
                <img src={icon} alt="icon" />
                <h1>GitHub Repository Finder</h1>
            </div>
            <div>
                <select name="language" id="lang" 
                    onChange={(e) => {
                        submitHandler(e)
                    }}>
                    {
                        LANGUAGES.map(( lang, idx ) => {
                            return (
                            <option key={idx} value={lang.value}>
                                { lang.label }
                            </option>
                            )
                        })
                    }
                </select>
                <div className={`repoData ${repoDataClass}`}>
                    {repoData}
                </div>
            </div>
            {submitBtn}
        </form>
    )
}

function SubmitBtn ({ text, repos, changeRepoData }) {
    
    const clickHandler = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const randomIndex = Math.floor(Math.random() * repos.length);
        changeRepoData(<StructuredData repo={repos[randomIndex]}/>)
    }

    return (
        <button
            className='submitBtn'
            onClick={(e) => clickHandler(e)}    
        >
            {text}
        </button>
    )
}

function StructuredData ({ repo }) {
    const {
        name,
        description,
        language,
        stargazers_count,
        forks_count,
        open_issues_count
    } = repo

    return (
        <div className='repo-data-inner'>
            <span>{name}</span>
            <p>
                {description || 'No Description'}
            </p>
            <div>
                <span>{language}</span>
                <span>{stargazers_count}</span>
                <span>{forks_count}</span>
                <span>{open_issues_count}</span>
            </div>
        </div>
    )

}
