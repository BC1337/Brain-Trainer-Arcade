<script>
	import { onMount, onDestroy } from 'svelte';
	import Layout from '../../layouts/Layout.svelte';

	// Set Paragraphs as default game mode
	let gameMode = 'paragraphs';
	let letters = [];
	let paragraphText = '';
	let userInput = '';
	let currentIndex = 0;
	let timer = 0; // Count-up timer starts at 0
	let interval;
	let gameActive = false;
	let numCharacters = 10;
	let includeLetters = true;
	let includeNumbers = true;
	let includeSymbols = false;
	let caseSensitive = true;
	let correctLetters = 0;
	let totalTyped = 0;
	let message = '';
	let inputElement; // Reference to hidden input for mobile

	// Longer, varied sample paragraphs (3–5 sentences each, 8 total)
	const sampleParagraphs = [
		'In the neon-lit sprawl of New Tokyo, cybernetic runners dart through crowded streets, their augmented limbs humming with electric precision. Holographic billboards flash cryptic messages, advertising neural implants that promise eternal connection to the Net. Beneath the surface, hackers weave through digital shadows, chasing secrets buried in encrypted code. The city never sleeps, pulsing with the rhythm of a thousand interconnected minds.',
		'The starship Nexus glided silently through the void, its crew navigating a sea of distant stars. Captain Elara scanned the horizon for rogue asteroids, her augmented visor mapping threats in real-time. The AI onboard hummed softly, calculating routes through uncharted nebulae. Every decision carried the weight of survival in the infinite expanse of space.',
		'Deep in the virtual arena, gamers clashed in a high-stakes tournament, their avatars wielding weapons forged from pure data. The crowd roared as pixelated explosions lit up the holographic stage. Precision and speed were everything—one mistimed move could end a player’s run. Behind the scenes, coders tweaked algorithms to keep the game world alive and unpredictable.',
		'The old server room buzzed with the hum of forgotten machines, their screens glowing faintly in the dark. A lone programmer typed furiously, unraveling a bug that threatened to crash the global network. Lines of code scrolled endlessly, each one a puzzle piece in a digital labyrinth. Time was running out, and the stakes were higher than anyone could imagine.',
		'On the edge of the wastelands, a scavenger hunted for relics of a pre-digital age, buried under dunes of ash. Rusted circuit boards and shattered screens told stories of a world long gone. The wind carried whispers of rogue AIs still hiding in the ruins. Every find was a gamble—treasure or trap, no one could be sure.',
		'In the underbelly of Circuit City, drones whirred through smog-choked alleys, delivering illicit data to shadowy clients. A rogue coder named Vex hacked into the city’s mainframe, her fingers dancing over a holographic keyboard. Every keystroke risked exposure to the enforcers patrolling the digital grid. Freedom came at a cost, but the thrill of rebellion was worth it.',
		'The quantum processor hummed in the lab, its circuits glowing with forbidden energy. Scientists worked in secret, building an AI that could rewrite reality itself. Corporate spies lurked in the shadows, ready to steal the breakthrough for their own gain. One wrong move could unleash chaos across the connected world.',
		'High above the megacity, sky pirates piloted stealth rigs through a maze of floating platforms. Their cargo—stolen biotech—held the key to curing a digital plague. Guards patrolled the airways, their drones scanning for any trace of rebellion. The pirates thrived on the edge, where danger and freedom collided.'
	];

	function startGame() {
		resetGame();

		if (gameMode === 'letters') {
			letters = generateLetters(numCharacters);
		} else {
			const randomIndex = Math.floor(Math.random() * sampleParagraphs.length);
			paragraphText = sampleParagraphs[randomIndex];
			userInput = '';
		}

		timer = 0; // Start count-up timer at 0
		gameActive = true;
		message = '';
		interval = setInterval(() => {
			timer += 10; // Increment timer every 10ms
		}, 10);

		// Auto-focus input on mobile
		if (inputElement) {
			inputElement.focus();
		}
	}

	function resetGame() {
		clearInterval(interval);
		currentIndex = 0;
		correctLetters = 0;
		totalTyped = 0;
		timer = 0; // Reset timer to 0
		gameActive = false;
		message = '';
		userInput = '';
		paragraphText = '';
		letters = [];
	}

	function generateLetters(numCharacters) {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const lowercaseAlphabet = 'abcdefghijklmnopqrstuvwxyz';
		const numbers = '1234567890';
		const symbols = '!@#$%^&*()_+';
		let characters = '';

		if (includeLetters) characters += alphabet + (caseSensitive ? lowercaseAlphabet : '');
		if (includeNumbers) characters += numbers;
		if (includeSymbols) characters += symbols;

		if (!characters) {
			alert('Please select at least one character type.');
			return [];
		}

		const generated = [];
		for (let i = 0; i < numCharacters; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			generated.push(characters[randomIndex]);
		}
		return generated;
	}

	function handleKeyPress(event) {
		if (!gameActive) return;
		const ignoredKeys = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'];
		if (ignoredKeys.includes(event.key)) return;

		if (gameMode === 'letters') {
			handleLetterMode(event);
		} else {
			handleParagraphMode(event);
		}
	}

	function handleMobileInput(event) {
		if (!gameActive) return;
		const value = event.target.value;
		if (value.length > userInput.length) {
			const lastChar = value[value.length - 1];
			userInput += lastChar;
			totalTyped++;

			const currentPos = userInput.length - 1;
			if (gameMode === 'paragraphs' && currentPos < paragraphText.length && userInput[currentPos] === paragraphText[currentPos]) {
				correctLetters++;
			}

			if (gameMode === 'paragraphs' && userInput.length === paragraphText.length) {
				if (userInput === paragraphText) {
					endGame(`🏁 Well done! You completed the paragraph in ${(timer / 1000).toFixed(1)}s!`);
				} else {
					endGame(`❌ You finished, but made mistakes in ${(timer / 1000).toFixed(1)}s.`);
				}
			} else if (gameMode === 'letters') {
				const pressedKey = caseSensitive ? lastChar : lastChar.toUpperCase();
				const expected = caseSensitive ? letters[currentIndex] : letters[currentIndex].toUpperCase();
				if (pressedKey === expected) {
					correctLetters++;
					currentIndex++;
					if (currentIndex === letters.length) {
						endGame(`🎉 Perfect! You typed them all in ${(timer / 1000).toFixed(1)}s!`);
					}
				} else {
					endGame(`❌ Wrong key! Game over in ${(timer / 1000).toFixed(1)}s.`);
				}
			}

			// Clear input to allow continuous typing
			event.target.value = '';
		} else if (event.inputType === 'deleteContentBackward' && gameMode === 'paragraphs') {
			if (userInput.length > 0) {
				userInput = userInput.slice(0, -1);
				totalTyped++;
			}
		}
	}

	function handleLetterMode(event) {
		let pressedKey = caseSensitive ? event.key : event.key.toUpperCase();
		const expected = caseSensitive ? letters[currentIndex] : letters[currentIndex].toUpperCase();
		totalTyped++;

		if (pressedKey === expected) {
			correctLetters++;
			currentIndex++;
			if (currentIndex === letters.length) {
				endGame(`🎉 Perfect! You typed them all in ${(timer / 1000).toFixed(1)}s!`);
			}
		} else {
			endGame(`❌ Wrong key! Game over in ${(timer / 1000).toFixed(1)}s.`);
		}
	}

	function handleParagraphMode(event) {
		if (event.key === 'Backspace') {
			if (userInput.length > 0) {
				userInput = userInput.slice(0, -1);
				totalTyped++;
			}
			return;
		}

		if (event.key.length === 1) {
			userInput += event.key;
			totalTyped++;

			const currentPos = userInput.length - 1;
			if (currentPos < paragraphText.length && userInput[currentPos] === paragraphText[currentPos]) {
				correctLetters++;
			}

			if (userInput.length === paragraphText.length) {
				if (userInput === paragraphText) {
					endGame(`🏁 Well done! You completed the paragraph in ${(timer / 1000).toFixed(1)}s!`);
				} else {
					endGame(`❌ You finished, but made mistakes in ${(timer / 1000).toFixed(1)}s.`);
				}
			}
		}
	}

	function endGame(msg) {
		clearInterval(interval);
		gameActive = false;
		message = msg;
		if (inputElement) {
			inputElement.blur(); // Remove focus when game ends
		}
	}

	// Reset game when gameMode changes
	$: if (gameMode) {
		resetGame();
	}

	onMount(() => {
		const handler = (event) => {
			// Prevent default browser scrolling for spacebar globally
			if (event.key === ' ') {
				event.preventDefault();
			}
			if (!gameActive) return;
			handleKeyPress(event);
		};
		document.addEventListener('keydown', handler);

		return () => {
			document.removeEventListener('keydown', handler);
			clearInterval(interval);
		};
	});
</script>

<Layout>
	<div class="wrapper">
		<div class="card">
			<h1 class="title">⌨️ Type Racer</h1>

			<!-- Hidden input for mobile keyboard -->
			<input
				bind:this={inputElement}
				type="text"
				class="mobile-input"
				on:input={handleMobileInput}
				on:keydown|preventDefault={(e) => {
					if (e.key === 'Enter') e.preventDefault(); // Prevent form submission
				}}
			/>

			<div class="settings">
				<label>Game Mode:</label>
				<select bind:value={gameMode}>
					<option value="letters">Letters</option>
					<option value="paragraphs">Paragraphs</option>
				</select>

				{#if gameMode === 'letters'}
					<label>Number of Characters:</label>
					<input type="number" bind:value={numCharacters} min="1" max="30" />

					<label><input type="checkbox" bind:checked={includeLetters}>Include Letters</label>
					<label><input type="checkbox" bind:checked={includeNumbers}>Include Numbers</label>
					<label><input type="checkbox" bind:checked={includeSymbols}>Include Symbols</label>
					<label><input type="checkbox" bind:checked={caseSensitive}>Case Sensitive</label>
				{/if}
			</div>

			<p class="instructions">
				Type the {gameMode === 'letters' ? 'characters shown' : 'paragraph below'} quickly and accurately.
			</p>

			{#if gameMode === 'letters'}
				<div class="game-area">
					{#each letters as letter, index}
						<div class="letter-box" class:correct={index < currentIndex} class:current={index === currentIndex}>
							{letter}
						</div>
					{/each}
				</div>
			{:else}
				<div class="paragraph-box">
					{#each paragraphText.split('') as char, i}
						<span
							class:correct={i < userInput.length && userInput[i] === char}
							class:incorrect={i < userInput.length && userInput[i] !== char}
							class:current={i === userInput.length && gameActive}
						>
							{char === ' ' ? '\u00A0' : char}
						</span>
					{/each}
				</div>
			{/if}

			{#if !gameActive}
				<button on:click={startGame} class="start-btn">Start</button>
			{/if}

			<div class="stats">
				<div>✅ Correct: {correctLetters}</div>
				<div>🎯 Accuracy: {(totalTyped > 0 ? (correctLetters / totalTyped * 100).toFixed(2) : 0)}%</div>
				<div>⏱️ Time: {(timer / 1000).toFixed(1)}s</div>
			</div>

			{#if message}
				<p class="end-message">{message}</p>
			{/if}
		</div>
	</div>
</Layout>

<style>
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 20px;
		/* Inherit exact background from Layout.svelte's page-wrapper, which pulls from body */
		background: inherit;
		color: inherit;
		transition: background 0.3s ease, color 0.3s ease;
	}

	.card {
		background-color: #1a1a1a;
		padding: 40px;
		border-radius: 16px;
		box-shadow: 0 8px 30px rgba(0, 255, 255, 0.4), 0 0 10px rgba(255, 127, 80, 0.3);
		color: #fff;
		width: 100%;
		max-width: 800px;
		text-align: center;
		border: 2px solid rgba(0, 255, 255, 0.3);
		animation: fadeIn 0.5s ease-out;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.title {
		color: #00ffff;
		margin-bottom: 20px;
		text-shadow: 0 0 12px rgba(0, 255, 255, 0.7);
		font-size: 2.5rem;
		font-family: 'Courier New', monospace;
		letter-spacing: 3px;
	}

	.mobile-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.settings {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #222;
		padding: 20px;
		border-radius: 10px;
		margin-bottom: 20px;
		border: 1px solid rgba(255, 127, 80, 0.2);
	}

	.settings label {
		color: #ff7f50;
		margin-bottom: 8px;
		font-size: 1rem;
		font-family: 'Arial', sans-serif;
	}

	input,
	select {
		background: #333;
		color: #fff;
		border: 1px solid rgba(0, 255, 255, 0.3);
		border-radius: 6px;
		padding: 8px 12px;
		margin-bottom: 12px;
		width: 100%;
		max-width: 200px;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
		touch-action: manipulation;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #00ffff;
		box-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
	}

	.start-btn {
		background-color: #00bfff;
		color: white;
		border: none;
		border-radius: 8px;
		padding: 12px 24px;
		font-size: 1.1rem;
		font-family: 'Arial', sans-serif;
		cursor: pointer;
		margin-top: 15px;
		transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
		touch-action: manipulation;
	}

	.start-btn:hover {
		background-color: #009acd;
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(0, 159, 205, 0.5);
	}

	.instructions {
		color: rgba(255, 255, 255, 0.9);
		font-size: 1.1rem;
		margin-bottom: 20px;
		font-family: 'Arial', sans-serif;
	}

	.game-area {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		margin: 20px 0;
		animation: slideIn 0.5s ease-out;
	}

	@keyframes slideIn {
		from { opacity: 0; transform: translateY(10px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.letter-box {
		width: 50px;
		height: 50px;
		background: #2a2a2a;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: #fff;
		font-family: 'Courier New', monospace;
		border: 1px solid rgba(0, 255, 255, 0.2);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.letter-box:hover {
		transform: scale(1.05);
	}

	.correct {
		background-color: #28a745;
		box-shadow: 0 0 10px rgba(40, 167, 69, 0.7);
	}

	.current {
		background-color: #00bfff;
		border: 2px solid #00ffff;
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.7); }
		70% { box-shadow: 0 0 0 10px rgba(0, 255, 255, 0); }
		100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); }
	}

	.paragraph-box {
		background: #1a1a1a;
		padding: 20px;
		border-radius: 10px;
		text-align: left;
		font-family: 'Courier New', monospace;
		font-size: 1.2rem;
		line-height: 1.8;
		color: #eee;
		border: 1px solid rgba(0, 255, 255, 0.2);
		max-height: 300px;
		overflow-y: auto;
		display: flex;
		flex-wrap: wrap;
		gap: 0;
		margin: 20px 0;
		animation: slideIn 0.5s ease-out;
	}

	.paragraph-box span {
		display: inline-block;
		margin: 0;
		padding: 0 0.1px;
		font-kerning: none;
		letter-spacing: 0;
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	.paragraph-box span.correct {
		background-color: rgba(40, 167, 69, 0.4);
		color: #aef1ae;
	}

	.paragraph-box span.incorrect {
		background-color: rgba(255, 68, 68, 0.4);
		color: #ffaaaa;
	}

	.paragraph-box span.current {
		text-decoration: underline;
		text-decoration-color: #00ffff;
		text-decoration-thickness: 1px;
		color: #00ffff;
		background-color: rgba(0, 191, 255, 0.2);
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		gap: 10px;
		margin-top: 20px;
		color: #ff7f50;
		font-size: 1.1rem;
		font-family: 'Arial', sans-serif;
	}

	.end-message {
		margin-top: 20px;
		font-weight: bold;
		color: #00ffcc;
		font-size: 1.2rem;
		animation: fadeIn 0.5s ease-out;
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.card {
			padding: 20px;
			max-width: 95%;
		}

		.title {
			font-size: 1.8rem;
			letter-spacing: 2px;
		}

		.instructions {
			font-size: 1rem;
		}

		.letter-box {
			width: 40px;
			height: 40px;
			font-size: 1.2rem;
			border-radius: 6px;
		}

		.paragraph-box {
			font-size: 1rem;
			line-height: 1.6;
			max-height: 250px;
			padding: 15px;
		}

		.start-btn {
			padding: 10px 20px;
			font-size: 1rem;
			border-radius: 6px;
		}

		.settings {
			padding: 15px;
		}

		input,
		select {
			padding: 6px 10px;
			max-width: 160px;
			font-size: 0.9rem;
		}

		.stats {
			font-size: 0.9rem;
			gap: 8px;
		}

		.end-message {
			font-size: 1rem;
		}
	}

	/* Extra small screens (e.g., very narrow phones) */
	@media (max-width: 360px) {
		.card {
			padding: 15px;
		}

		.title {
			font-size: 1.5rem;
		}

		.letter-box {
			width: 35px;
			height: 35px;
			font-size: 1rem;
		}

		.paragraph-box {
			font-size: 0.9rem;
			max-height: 200px;
		}
	}
</style>