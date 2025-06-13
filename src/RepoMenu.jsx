import React, { useState } from 'react';

function RepoMenu() {
    const [activeTab, setActiveTab] = useState('client');

    const tabs = [
        { id: 'client', label: 'client' },
        { id: 'server', label: 'server' },
    ];

    const content = {
        client: (
        <div>
            <a className="devpage-link" target="_blank" href="https://github.com/shinebulb/shinebulb">
                shinebulb ≤2
            </a>
            <a className="devpage-link" target="_blank" href="https://github.com/shinebulb/shinebulb-client">
                shinebulb 3
            </a>
            <a className="devpage-link" target="_blank" href="https://github.com/aldortheold/shinebulb-3-1">
                shinebulb ≥3.1
            </a>
        </div>
        ),
        server: (
        <div>
            <a className="devpage-link" target="_blank" href="https://github.com/shinebulb/shinebulb-server">
                shinebulb 3+
            </a>
        </div>
        ),
    };

    return (
        <div className="repo-menu">
            <div className="tabs">
                {tabs.map(tab =>
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{opacity: tab.id == activeTab ? "100%" : "40%"}}
                >
                    {tab.label}
                </button>)}
            </div>
            <div className="repos">
                {content[activeTab]}
            </div>
        </div>
    );
}

export default RepoMenu
