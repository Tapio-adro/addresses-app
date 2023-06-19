import { useState } from 'react'
import streetsData from './StreetsData.tsx';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHippo } from "@fortawesome/free-solid-svg-icons";


function App() {

  function MyForm() {
    type userInfo = {username: string; age: number}

    const [inputs, setInputs] = useState<userInfo>({} as userInfo);
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const name: string = event.target.name;
      const value: string | number = event.target.value;
      setInputs(values => ({...values, [name]: value}))
    }
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log(inputs);
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <label>Enter your name:
        <input 
          type="text" 
          name="username" 
          value={inputs.username || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Enter your age:
          <input 
            type="number" 
            name="age" 
            value={inputs.age || ""} 
            onChange={handleChange}
          />
          </label>
          <input type="submit" />
      </form>
    )
  }

  return (
    <>
      <MyForm />
    </>
  )
}

export default App
