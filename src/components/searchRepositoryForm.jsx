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

    const submitHandler = (e) => {
        e.stopPropagation()
        
        if (!e.target.value) { return }

        setSubmitBtn(<SubmitBtn text={'Refresh'}/>)
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
                <div>
                    {repoData}
                </div>
            </div>
            {submitBtn}
        </form>
    )
}

function SubmitBtn ({ text }) {
    
    return (
        <button type='submit' className='submitBtn'>
            {text}
        </button>
    )
}
