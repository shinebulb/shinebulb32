import React, { useState } from 'react';
import text from './assets/json/text.json';

function RepoMenu({ settings }) {

    const [openClient, setOpenClient] = useState(true);

    return (
        <div className="repo-menu">
            <div className="tabs">
                <button onClick={() => setOpenClient(true)} style={{opacity: openClient ? "100%" : "40%"}}>
                    {text[settings.language].devSides[1]}
                </button>
                <button onClick={() => setOpenClient(false)} style={{opacity: openClient ? "40%" : "100%"}}>
                    {text[settings.language].devSides[2]}
                </button>
            </div>
            <div className="repos">
                {openClient ? <div>
                    <a className="devpage-link" target="_blank" href="https://github.com/shinebulb/shinebulb">
                        shinebulb ≤2
                    </a>
                    <a className="devpage-link" target="_blank" href="https://github.com/shinebulb/shinebulb-client">
                        shinebulb 3
                    </a>
                    <a className="devpage-link" target="_blank" href="https://github.com/aldortheold/shinebulb-3-1">
                        shinebulb ≥3.1
                    </a>
                </div> :
                <div>
                    <a className="devpage-link" target="_blank" href="https://github.com/shinebulb/shinebulb-server">
                        shinebulb ≥3
                    </a>
                </div>}
            </div>
        </div>
    );
}

export default RepoMenu
