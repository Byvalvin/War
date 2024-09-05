// Function to load scripts from the stack dynamically
const loadScripts = (stack, onComplete) => {
  if (stack.length === 0) {
    if (typeof onComplete === 'function') onComplete(); // Execute callback if provided
    return;
  }

  const { src, msg } = stack.shift(); // Get the next script from the stack

  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  script.onload = () => {
    console.log(msg ? msg : `Done loading ${src.split("/")[1]}`);
    loadScripts(stack, onComplete); // Load the next script from the stack
  };
  script.onerror = () => {
    console.error(`Failed to load ${src}`);
    // Optionally, you could retry loading the script or handle failure
    loadScripts(stack, onComplete);
  };
  document.body.appendChild(script);
};

// Define the stack of scripts
const scriptStack = [
  { src: 'scripts/card.js },
  { src: 'scripts/deck.js },
  { src: 'scripts/game.js },
  { src: 'scripts/war.js' },
  // { src: 'scripts/mode.js'},
  // Add more scripts here as needed
];

// Start loading scripts from the stack
loadScripts(scriptStack, () => {
  console.log('All scripts have been loaded and initialized.');
  // Optionally, trigger additional actions here
});
