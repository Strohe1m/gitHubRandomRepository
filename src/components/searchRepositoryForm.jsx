import './searchRepositoryForm.css'
import getRandomGitHubRepo from '../api/gitHubAPI.js'
import { useState } from 'react'
import icon from '../assets/icon.jpg'
import colors from 'github-colors';
import infoIcon from '../assets/info.svg'
import starIcon from '../assets/star.svg'
import gitForkIcon from '../assets/git-fork.svg'

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

    const _do = async (e, repos, randomIndex) => {
        repos = await getRandomGitHubRepo(e.target.value)
        randomIndex = Math.floor(Math.random() * repos.length);

        setRepoDataClass('got-data')
        setRepoData(<StructuredData repo={repos[randomIndex]}/>)
        setSubmitBtn(<SubmitBtn text={'Refresh'} 
                        repos={repos} 
                        changeRepoData={setRepoData}/>)
    }

    const submitHandler = async (e) => {
        e.stopPropagation()
        
        if (!e.target.value) { return }
        
        setSubmitBtn()

        let repos, randomIndex

        try {
            setRepoDataClass('')
            setRepoData('Loading, please wait...')
            await _do(e, repos, randomIndex)
        } catch {
            setRepoDataClass('got-error')
            setRepoData('Error fetching repositorioes')
            setSubmitBtn(<TryAgainBtn 
                text={'Try again...'}
                tryFunc={() => _do(e, repos, randomIndex)}
                repoDataSetter={setRepoData}
                repoDataClassSetter={setRepoDataClass}

            />)
        }
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

function TryAgainBtn ({ text, 
                        tryFunc, 
                        repoDataSetter, 
                        repoDataClassSetter }) {

    const clickHandler = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            repoDataClassSetter('')
            repoDataSetter('Loading, please wait...')
            await tryFunc()
        } catch {
            repoDataClassSetter('got-error')
            repoDataSetter('Error fetching repositorioes')
            console.error('Error')
        }
        
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

    const langColorBg = colors.get(language).color

    return (
        <div className='repo-data-inner'>
            <span>{name}</span>
            <p>
                {description || 'No Description'}
            </p>
            <div>
                <span>
                    <div className='lang-color' 
                    style={{
                        backgroundColor: langColorBg,
                    }}
                    ></div>
                    {language}
                </span>
                <span>
                    <img src={starIcon} alt="stars" className='icon'/>    
                    {stargazers_count}
                </span>
                <span>
                    <img src={gitForkIcon} alt="forks" className='icon'/>    
                    {forks_count}
                </span>
                <span>
                    <img src={infoIcon} alt="info" className='icon'/>
                    {open_issues_count}
                </span>
            </div>
        </div>
    )

}
