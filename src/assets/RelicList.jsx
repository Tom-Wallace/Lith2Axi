import React, { useState } from 'react';
import './RelicList.css'; // Import the CSS file
import relicData from '../../available_items.json';
import itemsWithComponents from '../../itemsWithComponents.json'; // Import the generated JSON file

function RelicList() {
    // State to track which relics or items are expanded
    const [expanded, setExpanded] = useState({});
    // State to track which buttons are hidden
    const [hidden, setHidden] = useState({});

    // Toggle the expanded state for a given key
    const toggleExpand = (key) => {
        setExpanded((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Hide a button entirely
    const hideButton = (key) => {
        setHidden((prev) => ({
            ...prev,
            [key]: true,
        }));
    };

    // Reset all hidden buttons
    const resetHidden = () => {
        setHidden({});
    };

    return (
        <div className="relic-list-container">
            {/* First column: Relics and their items */}
            <div className="relic-column">
                <h1>
                    Relics
                    <button className="reset-button" onClick={resetHidden}>
                        Reset Hidden
                    </button>
                </h1>
                {Object.entries(relicData).map(([relic, items]) => (
                    !hidden[relic] && (
                        <div key={relic} className="relic-section">
                            <button className="toggle-button" onClick={() => toggleExpand(relic)}>
                                {relic}
                                <span className="close-button" onClick={(e) => {
                                    e.stopPropagation(); // Prevent toggleExpand from firing
                                    hideButton(relic);
                                }}>
                                    X
                                </span>
                            </button>
                            <ul className={expanded[relic] ? 'expanded' : ''}>
                                {items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )
                ))}
            </div>

            {/* Second column: Items grouped by components and their relics */}
            <div className="relic-column">
                <h1>
                    Items and Components
                    <button className="reset-button" onClick={resetHidden}>
                        Reset Hidden
                    </button>
                </h1>
                {Object.entries(itemsWithComponents).map(([item, components]) => (
                    !hidden[item] && (
                        <div key={item} className="relic-section">
                            <button className="toggle-button" onClick={() => toggleExpand(item)}>
                                {item}
                                <span className="close-button" onClick={(e) => {
                                    e.stopPropagation(); // Prevent toggleExpand from firing
                                    hideButton(item);
                                }}>
                                    X
                                </span>
                            </button>
                            <ul className={expanded[item] ? 'expanded' : ''}>
                                {Object.entries(components).map(([component, relics], idx) => (
                                    <li key={idx}>
                                        {component}
                                        <ul>
                                            {relics.map((relic, relicIdx) => (
                                                <li key={relicIdx}>{relic}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

export default RelicList;
