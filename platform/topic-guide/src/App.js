import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { templates } from './templates/template';

import './App.css';

function App() {

  const queryParams = new URLSearchParams(window.location.search);
  const [taskData, setTaskData] = useState(null);
  const [activeAccordianKey, setActiveAccordianKey] = useState(null);
  const [introInfo, setIntroInfo] = useState(null);
  let version = queryParams.get('version') || 'latest';
  let task = queryParams.get('task') || 'Storyboard';
  let lang = queryParams.get('lang') || 'en';
  let pathBuild = window.location.href;
  let skipBuild = (pathBuild.indexOf('localhost') >=0 || pathBuild.indexOf('127.0.0.1') >=0) ? 'http://localhost:8080' : pathBuild.split('build')[0] +'/data';
  const pathMod = skipBuild + `/${version}/${task}/lang/${lang}`;

  useEffect(() => {
    fetch(pathMod+".json?"+new Date().getMilliseconds()).then((resp)=>{
     return resp.json()

    }).then(res=>{
      console.log(res);
      let { data, accordianActiveKey, info } = res;
      setTaskData(data);
      setActiveAccordianKey(accordianActiveKey);
      setIntroInfo(info);
    });
  }, []);

  return (
    <div className="App">
      <h3>{introInfo && introInfo.title}</h3>
      <div>
        <p>{introInfo && introInfo.description}</p>
      </div>
      {activeAccordianKey && <Accordion defaultActiveKey={activeAccordianKey - 1}>
        {taskData && taskData.map((data, index) => {
          return !data.hide && templates[data.type] && templates[data.type](data, index);
        })
        }

      </Accordion>
      }

    </div>
  );
}

export default App;
