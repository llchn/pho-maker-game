import React, { useState, useEffect, useCallback } from 'react';
import titleImage from './assets/phomaker-title.png';
import bowlQuestionImg from './assets/bowl-question.png';
import basketFullImg from './assets/basket-full.png';
import basketNotFullImg from './assets/basket-not-full.png';
import scumImg from './assets/scum.png';
import readyStockpotImg from './assets/ready-stockpot.png';
// ingredients
import gingerImg from './assets/newginger.png';
import onionImg from './assets/newonion.png';
import starAniseImg from './assets/lateststaranise.png';
import cinnamonImg from './assets/latestcinnamon.png';
import meatyBonesImg from './assets/latestmarrowbones.png';
import sugarImg from './assets/latestsugar.png';
import saltImg from './assets/latestsalt.png';
import lemonImg from './assets/newlemon.png';
import potatoImg from './assets/newpotato.png';
import carrotImg from './assets/latestcarrot.png';
import brisketImg from './assets/latestbrisket.png'
import fishSauceImg from './assets/newfishsauce.png'
import charredOnionImg from './assets/charred-onion.png'; 
import charredGingerImg from './assets/charred-ginger.png';
import spicesImg from './assets/spices.png';

// bowl stage 
import emptyBowlImg from './assets/bowl-empty.png';
import bowlNoodlesImg from './assets/bowl-noodles.png';
import bowlBeefImg from './assets/bowl-beef.png';
import bowlBrothImg from './assets/bowl-broth.png';
import bowlCompleteImg from './assets/bowl-complete.png';
// assembly
import noodlesImg from './assets/noodles.png';
import rawBeefImg from './assets/raw-beef.png';
import brothImg from './assets/broth.png';
import herbsImg from './assets/herbs.png';

// mapping ingredient names to imgs 
const ingredientImages = {
    'ginger': gingerImg,
    'onion': onionImg,
    'star anise': starAniseImg,
    'cinnamon': cinnamonImg,
    'marrow bones': meatyBonesImg,
    'sugar': sugarImg,
    'salt': saltImg,
    'lemon': lemonImg,
    'potato': potatoImg,
    'carrot': carrotImg,
    'brisket': brisketImg,
    'fish sauce': fishSauceImg,
    'Charred Onion': charredOnionImg, 
    'Charred Ginger': charredGingerImg, 
    'Bones': meatyBonesImg, // use marrow bones image for "Bones"
    'Spices': spicesImg,
    'Noodles': noodlesImg,
    'Raw Beef': rawBeefImg,
    'Broth': brothImg,
    'Herbs': herbsImg,
};

//new bowl stage image array
const bowlStageImages = [
    emptyBowlImg,
    bowlNoodlesImg,
    bowlBeefImg,
    bowlBrothImg,
    bowlCompleteImg,
];

// new typing text component
const TypingText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const typingSpeed = 40; // ms per character

    useEffect(() => {
        setDisplayedText('');
        setShowCursor(true);

        if (text.length === 0) {
            setShowCursor(false);
            return;
        }

        const intervalId = setInterval(() => {
            setDisplayedText(currentText => {
                if (currentText.length < text.length) {
                    return text.substring(0, currentText.length + 1);
                } else {
                    clearInterval(intervalId);
                    setTimeout(() => setShowCursor(false), 1200);
                    return currentText;
                }
            });
        }, typingSpeed);

        return () => {
            clearInterval(intervalId);
        };
    }, [text]);

    return (
        <p className="instruction">
            {displayedText}
            {showCursor && <span className="typing-cursor"></span>}
        </p>
    );
};


// config objs
const STAGE_1_CONFIG = {
    required: ['ginger', 'onion', 'star anise', 'cinnamon', 'marrow bones', 'sugar', 'salt', 'brisket', 'fish sauce'],
    distractors: ['lemon', 'potato', 'carrot'],
};

const STAGE_2_CONFIG = {
    char: { items: ['onion', 'ginger'], duration: 5000 },
    skim: { scumCount: 15, duration: 15 },
    simmer: { required: ['Charred Onion', 'Charred Ginger', 'Bones', 'Spices'] }, // Removed Brisket
};

const STAGE_3_CONFIG = {
    required: ['Noodles', 'Raw Beef', 'Broth', 'Herbs'],
};

// helper components
const Ingredient = ({ name, onClick, disabled = false, imageUrl }) => (
    <div
        onClick={!disabled ? () => onClick(name) : null}
        className={`ingredient ${disabled ? 'disabled' : ''}`}
    >
        <img src={imageUrl} alt={name} />
        {/* <span>{name}</span> */}
    </div>
);

// stage components
const StartScreen = () => {
    return (
        <div className="start-screen">
            <img src={bowlQuestionImg} alt="Mystery Bowl" className="start-screen-bowl" />
        </div>
    );
};

const TransitionScreen = ({ imageSrc, altText }) => {
    return (
        <div className="transition-screen">
            <img src={imageSrc} alt={altText} className="transition-image" />
        </div>
    );
};

const Stage1 = ({ onComplete, onGameEvent }) => {
    const [collected, setCollected] = useState([]);
    const [allItems, setAllItems] = useState([]);

    useEffect(() => {
        const items = [...STAGE_1_CONFIG.required, ...STAGE_1_CONFIG.distractors].sort(() => 0.5 - Math.random());
        setAllItems(items);
    }, []);

    const handleIngredientClick = (name) => {
        if (collected.includes(name)) return;

        if (STAGE_1_CONFIG.required.includes(name)) {
            const newCollected = [...collected, name];
            setCollected(newCollected);
            onGameEvent({ type: 'CORRECT_INGREDIENT' });

            if (newCollected.length === STAGE_1_CONFIG.required.length) {
                onComplete(true);
            }
        } else {
            onGameEvent({ type: 'WRONG_INGREDIENT' });
            setCollected([...collected, name]);
        }
    };

    return (
        <div className="stage-layout">
            <div className="ingredient-grid-container">
                <h3 style={{textAlign: 'center', fontWeight: '700'}}>here are the options we have!</h3>
                <div className="ingredient-grid">
                    {allItems.map(item => (
                        <Ingredient
                            key={item}
                            name={item}
                            onClick={handleIngredientClick}
                            disabled={collected.includes(item)}
                            imageUrl={ingredientImages[item]}
                        />
                    ))}
                </div>
            </div>
            <div className="recipe-list-container">
                <h3>recipe list:</h3>
                <ul>
                    {STAGE_1_CONFIG.required.map(item => (
                        <li key={item} className={collected.includes(item) ? 'collected' : ''}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const Stage2 = ({ onComplete, onGameEvent }) => {
    const [subStage, setSubStage] = useState('char');
    const [charredItems, setCharredItems] = useState([]);
    const [isCharring, setIsCharring] = useState(false);
    const [charProgress, setCharProgress] = useState(0);
    const [skimmedCount, setSkimmedCount] = useState(0);
    const [simmerItems, setSimmerItems] = useState([]);
    const [scumPositions, setScumPositions] = useState([]);

    const handleCharClick = (item) => {
        if (!charredItems.includes(item)) {
            setCharredItems([...charredItems, item]);
        }
    };

    useEffect(() => {
        let interval = null;
        if (charredItems.length === STAGE_2_CONFIG.char.items.length && isCharring) {
            interval = setInterval(() => {
                setCharProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        onGameEvent({ type: 'CHAR_BURNT' });
                        setTimeout(() => setSubStage('skim'), 1000);
                        return 100;
                    }
                    return prev + 1;
                });
            }, STAGE_2_CONFIG.char.duration / 100);
        }
        return () => clearInterval(interval);
    }, [charredItems, isCharring, onGameEvent]);
    
    useEffect(() => {
        if(charredItems.length === STAGE_2_CONFIG.char.items.length) {
            setIsCharring(true);
        }
    }, [charredItems]);
    
    const stopCharring = () => {
        setIsCharring(false);
    
        if (charProgress >= 60 && charProgress <= 85) {
            onGameEvent({ type: 'CHAR_PERFECT' });
        } else {
            onGameEvent({ type: 'CHAR_BURNT' });
        }
    
        setTimeout(() => setSubStage('skim'), 1000);
    };

    useEffect(() => {
        if (subStage === 'skim' && scumPositions.length === 0) {
            const positions = [...Array(STAGE_2_CONFIG.skim.scumCount)].map(() => {
                const angle = Math.random() * 2 * Math.PI;
                // sqrt to ensure uniform distribution over the area of the circle
                const radius = Math.sqrt(Math.random()) * 0.50; // max radius of 75% of half the container width
                
                // convert polar to cartesian coordinates and then to percentage for CSS
                // center is at 50% so we add the offset. then multiply by 50 because radius is 0-1, and need to map it to 0-50% offset.
                const left = 50 + (radius * Math.cos(angle) * 50);
                const top = 50 + (radius * Math.sin(angle) * 50);

                return {
                    left: `${left}%`,
                    top: `${top}%`,
                    visible: true,
                };
            });
            setScumPositions(positions);
        }
    }, [subStage, scumPositions.length]);

    const handleSkim = useCallback((indexToHide) => {
        if (!scumPositions[indexToHide]?.visible) return;

        onGameEvent({ type: 'SKIMMED_SCUM' });

        const newScumPositions = scumPositions.map((scum, index) => {
            if (index === indexToHide) {
                return { ...scum, visible: false };
            }
            return scum;
        });
        setScumPositions(newScumPositions);
        
        const newSkimmedCount = skimmedCount + 1;
        setSkimmedCount(newSkimmedCount);

        if (newSkimmedCount >= STAGE_2_CONFIG.skim.scumCount) {
            setTimeout(() => setSubStage('simmer'), 1000);
        }
    }, [onGameEvent, scumPositions, skimmedCount]);


    const handleSimmerClick = (item) => {
        if (!simmerItems.includes(item)) {
            const newSimmerItems = [...simmerItems, item];
            setSimmerItems(newSimmerItems);
            onGameEvent({ type: 'SIMMER_ITEM' });
            if (newSimmerItems.length === STAGE_2_CONFIG.simmer.required.length) {
                onComplete(true);
            }
        }
    };

    if (subStage === 'char') {
        return (
            <div className="stage2-container">
                <p>click the onion and ginger to put them on the grill.</p>
                <div className="char-ingredients">
                    {STAGE_2_CONFIG.char.items.map(item => (
                        <Ingredient key={item} name={item} onClick={handleCharClick} disabled={charredItems.includes(item)} imageUrl={ingredientImages[item]}/>
                    ))}
                </div>
                {charredItems.length === STAGE_2_CONFIG.char.items.length && (
                    <div>
                        <p>Charring in progress...</p>
                        <div className="progress-bar-container">
                            <div className="progress-bar-perfect-zone"></div>
                            <div className="progress-bar-inner" style={{ width: `${charProgress}%` }}></div>
                        </div>
                        <button onClick={stopCharring} className="stop-button"></button>
                    </div>
                )}
            </div>
        );
    }

     if (subStage === 'skim') {
        return (
            <div className="stage2-container">
                <p>the broth is boiling. click the scum to skim it!</p>
                <div className="pot">
                    {scumPositions.map((scum, i) => (
                        <div
                            key={i}
                            onClick={() => handleSkim(i)}
                            className="scum"
                            style={{
                                left: scum.left,
                                top: scum.top,
                                backgroundImage: `url(${scumImg})`,
                                display: scum.visible ? 'block' : 'none'
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }
    
    if (subStage === 'simmer') {
        return (
            <div className="stage2-container">
                <p>click the ingredients to add them to the pot.</p>
                <div className="simmer-ingredients">
                    {STAGE_2_CONFIG.simmer.required.map(item => (
                         <Ingredient key={item} name={item} onClick={handleSimmerClick} disabled={simmerItems.includes(item)} imageUrl={ingredientImages[item]} />
                    ))}
                </div>
                <div className="stockpot">
                    <div className="stockpot-ingredients">
                        {simmerItems.map(item => (
                            <img key={item} src={ingredientImages[item]} alt={item} className="simmer-ingredient-img" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
};

const Stage3 = ({ onComplete, onGameEvent }) => {
    const [assembled, setAssembled] = useState([]);

    const handleAssemblyClick = (item) => {
        const expectedItem = STAGE_3_CONFIG.required[assembled.length];
        if (item === expectedItem) {
            const newAssembled = [...assembled, item];
            setAssembled(newAssembled);
            onGameEvent({ type: 'ASSEMBLE_CORRECT' });
            if (newAssembled.length === STAGE_3_CONFIG.required.length) {
                onComplete(true);
            }
        } else {
            onGameEvent({ type: 'ASSEMBLE_WRONG' });
        }
    };

    return (
        <div className="stage-layout">
            <div className="assembly-ingredients">
                <h3 style={{textAlign: 'center', fontWeight: '700'}}>*click to assemble*</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    {STAGE_3_CONFIG.required.map(item => (
                        <Ingredient key={item} name={item} onClick={() => handleAssemblyClick(item)} disabled={assembled.includes(item)} imageUrl={ingredientImages[item]} />
                    ))}
                </div>
            </div>
            <div className="pho-bowl-container">
                <img 
                    src={bowlStageImages[assembled.length]} 
                    alt="Pho Bowl" 
                    className="pho-bowl-image" 
                />
            </div>
        </div>
    );
};

export default function App() {
    const [gameState, setGameState] = useState({ stage: 'START', score: 0, transitionImage: null});
    const [timer, setTimer] = useState(60);
    const [timerActive, setTimerActive] = useState(false);
    const [instruction, setInstruction] = useState("welcome! let's make some delicious Pho! click start to begin :)");
    const [stage3Assembled, setStage3Assembled] = useState(false);

    const handleGameEvent = useCallback((event) => {
        const pointMap = {
            'CORRECT_INGREDIENT': 10,
            'WRONG_INGREDIENT': -5,
            'CHAR_PERFECT': 20,
            'CHAR_BURNT': -10,
            'SKIMMED_SCUM': 2,
            'SIMMER_ITEM': 5,
            'ASSEMBLE_CORRECT': 10,
            'ASSEMBLE_WRONG': -5,
        };
        setGameState(prev => ({ ...prev, score: prev.score + (pointMap[event.type] || 0) }));
    }, []);

    const handleStageComplete = useCallback((success) => {
        setTimerActive(false);
        if (gameState.stage === 'STAGE_1') {
            if (success) {
                setInstruction("great job! we've gathered all the ingredients.");
                setGameState(prev => ({ ...prev, stage: 'STAGE_2_TRANSITION', transitionImage: basketFullImg }));
            } else {
                setInstruction("time's up! let's move to the next step anyway.");
                setGameState(prev => ({ ...prev, stage: 'STAGE_2_TRANSITION', transitionImage: basketNotFullImg }));
            }
        } else if (gameState.stage === 'STAGE_2') {
            setInstruction("everything is in the pot! the broth is now perfect :)");
            setGameState(prev => ({ ...prev, stage: 'STAGE_3_TRANSITION', transitionImage: readyStockpotImg }));
        } else if (gameState.stage === 'STAGE_3') {
            if(success) {
                setInstruction("all done! what a masterpiece.");
                setStage3Assembled(true);
            }
        }
    }, [gameState.stage]);

    useEffect(() => {
        let interval = null;
        if (timerActive) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        handleStageComplete(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive, handleStageComplete]);

    const handleControlButtonClick = () => {
        const { stage } = gameState;
        if (stage === 'START' || stage === 'END') {
            setGameState({ stage: 'STAGE_1', score: 0 });
            setInstruction("choose the correct ingredients from the shelves.");
            setTimer(60);
            setTimerActive(true);
        } else if (stage === 'STAGE_2_TRANSITION') {
            setGameState(prev => ({ ...prev, stage: 'STAGE_2' }));
            setInstruction("time to cook! follow the steps.");
        } else if (stage === 'STAGE_3_TRANSITION') {
            setGameState(prev => ({ ...prev, stage: 'STAGE_3' }));
            setInstruction("assemble the bowl in the correct order!");
        } else if (stage === 'STAGE_3' && stage3Assembled) {
            setGameState(prev => ({ ...prev, stage: 'END' }));
        }
    };
    
    const renderStage = () => {
        switch (gameState.stage) {
            case 'START':
                return <StartScreen />;
            case 'STAGE_1':
                return <Stage1 onComplete={handleStageComplete} onGameEvent={handleGameEvent} />;
            case 'STAGE_2_TRANSITION':
                return <TransitionScreen imageSrc={gameState.transitionImage} altText="Basket of ingredients" />;
            case 'STAGE_2':
                return <Stage2 onComplete={handleStageComplete} onGameEvent={handleGameEvent} />;
            case 'STAGE_3_TRANSITION':
                return <TransitionScreen imageSrc={gameState.transitionImage} altText="Ready Stockpot" />;
            case 'STAGE_3':
                 return <Stage3 onComplete={handleStageComplete} onGameEvent={handleGameEvent} />;
            case 'END':
                const maxScore = 145;
                const percentage = Math.max(0, gameState.score / maxScore);
                let stars = 0;
                if (percentage > 0.9) stars = 5;
                else if (percentage > 0.75) stars = 4;
                else if (percentage > 0.5) stars = 3;
                else if (percentage > 0.25) stars = 2;
                else if (percentage > 0) stars = 1;
                return (
                     <div className="end-screen">
                        <h2>congratulations!</h2>
                        <p>u made a delicious bowl of Pho!</p>
                        <div className="star-rating">{[...Array(5)].map((_, i) => i < stars ? '⭐' : '☆')}</div>
                        <p>final score: {gameState.score}</p>
                    </div>
                );
            default:
                return null;
        }
    };
    const getButtonText = () => {
        if (gameState.stage === 'STAGE_3' && stage3Assembled) {
            return "see the result!";
        }
        switch (gameState.stage) {
            case 'START': return 'start';
            case 'END': return 'play again?';
            case 'STAGE_2_TRANSITION':
            case 'STAGE_3_TRANSITION':
                return 'next step';
            default: return null;
        }
    };

    return (
        <div className="game-container">
            <img src={titleImage} alt="Phở Maker" className="game-title" />
            <TypingText text={instruction} />

            <div className="game-screen">
                {renderStage()}
            </div>

            <div className="controls-container">
                <div className={`timer-display ${timerActive ? '' : 'hidden'}`}>
                    time left: <span>{timer}</span>s
                </div>
                <div className="score-display">
                    score: <span>{gameState.score}</span>
                </div>
                {getButtonText() && (
                     <button onClick={handleControlButtonClick} className="control-button">
                        {getButtonText()}
                    </button>
                )}
               
            </div>
        </div>
    );
}