import React from "react";
import { useState} from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name,setName]=useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
       
        const result = await fetch("http://localhost:3000/api/graph-api", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                mutation{
                    createUser(userInput:{name:"${name}",email:"${email}",password:"${password}"}){
                        name,
                        email
                    }
                  }
                `,
            }),
        });
        const res = await result.json();
        localStorage.setItem("user", JSON.stringify(res));
        setName("");
        setemail("");
        setpassword("");
        navigate("/");
    };

    return (
        <>
            <main>
                <form className="page-form" onSubmit={handleSubmit}>
                    <h2>
                        <strong>SignUp</strong>
                    </h2>
                    <div className="user-box">
                        <input
                            type="text"
                            autoComplete="off"
                            name="username"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            value={name}
                            required
                        />
                        <label htmlFor="username" className="label-class">
                            Name
                        </label>
                    </div>
                    <div className="user-box">
                        <input
                            type="email"
                            autoComplete="off"
                            name="username"
                            onChange={(e) => {
                                setemail(e.target.value);
                            }}
                            value={email}
                            required
                        />
                        <label htmlFor="username" className="label-class">
                            Email
                        </label>
                    </div>
                    <div className="user-box">
                        <input
                            type="password"
                            autoComplete="off"
                            name="password"
                            onChange={(e) => {
                                setpassword(e.target.value);
                            }}
                            required
                        />
                        <label htmlFor="password" className="label-class">
                            Password
                        </label>
                    </div>
                    <button className="login-signup-button" type="submit">
                        Create account
                    </button>
                </form>
            </main>
        </>
    );
};
export default Signup;
