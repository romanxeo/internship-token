import React, {useEffect, useState} from 'react';
import './App.css';
import {Auth0Provider, useAuth0} from "@auth0/auth0-react";

const _App: React.FC = () => {
    const {
        isLoading,
        isAuthenticated,
        error,
        user,
        loginWithRedirect,
        logout,
        getAccessTokenSilently
    } = useAuth0();

    const [tokenData, setTokenData] = useState('')

    const loadToken = async () => {
        if (isAuthenticated) {
            const token = await getAccessTokenSilently()
            setTokenData(token)
        }
    }

    useEffect(() => {
        loadToken()
    }, [isAuthenticated])

    if (isLoading) {
        return <div className="content">Loading...</div>;
    }
    if (error) {
        return <div className="content">Oops... {error.message}</div>;
    }

    if (isAuthenticated) {
        return (
            <div className="content">
                Hello {user?.name}{' '}
                <button onClick={() => logout({returnTo: window.location.origin})}>
                    Log out
                </button>
                <div className="token">
                    {tokenData}
                </div>
            </div>
        );
    } else {
        return <div className="content"><button onClick={loginWithRedirect}>Log in</button></div>
    }
}

const App: React.FC = () => {

    const [domain, setDomain] = useState("")
    const [clientId, setClientId] = useState("")
    const [audience, setAudience] = useState("")

    useEffect(() => {
        const domain_value = localStorage.getItem("domain")
        const clientId_value = localStorage.getItem("clientId")
        const audience_value = localStorage.getItem("audience")
        domain_value && setDomain(domain_value)
        clientId_value && setClientId(clientId_value)
        audience_value && setAudience(audience_value)
    }, [])

    const save = () => {
        localStorage.setItem("domain", domain)
        localStorage.setItem("clientId", clientId)
        localStorage.setItem("audience", audience)
        alert('save completed')
    }

    return (
        <div className="body">
            <div className="line">Domain: <input value={domain} onChange={(e) => setDomain(e.target.value)}/></div>
            <div className="line">Client Id: <input value={clientId} onChange={(e) => setClientId(e.target.value)}/></div>
            <div className="line">Audience: <input value={audience} onChange={(e) => setAudience(e.target.value)}/></div>
            <div className="line"><button onClick={save}>Save to localStorage</button></div>

            {!!domain && !!clientId && !!audience &&
                <Auth0Provider
                    domain={`${domain}`}
                    clientId={`${clientId}`}
                    audience={`${audience}`}
                    redirectUri='https://romanxeo.github.io/internship-token'
                >
                    <_App/>
                </Auth0Provider>
            }
        </div>

    )
}

export default App;