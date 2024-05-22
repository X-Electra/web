import React from "react";
import resumeData from './resumeData'
import "./App.css";
import "./fonts.css";

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <header id="home">
          <div className="row banner">
            <div className="banner-text">
              <h1 className="responsive-headline">{resumeData.name}.</h1>
              <h3 style={{ color: "#fff", fontFamily: "sans-serif " }}>
                We are a {resumeData.role} <br />
                {resumeData.roleDescription}
              </h3>
              <hr />
              <ul className="social">
                {resumeData.socialLinks &&
                  resumeData.socialLinks.map((item) => {
                    return (
                      <li key={item.name} >
                        <a href={item.url}  target="_blank" rel="noreferrer" >
                          <i className={item.className} />
                        </a>
                      </li>
                    );
                  })}
              </ul>
            <a href='/create' className="bg-white p-3 rounded-xl font-bold font-sans ">
              Create Bot Script
            </a>
            </div>
          </div>
        </header>
      </React.Fragment>
    </div>
  );
}

export default App;
