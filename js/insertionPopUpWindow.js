/**
 * Listener for when the page is loaded.
 * 
 * TO DO:
 * - 
 */
document.addEventListener('DOMContentLoaded', function () {
  // Creat the popup window and immediately hide it.
  const popupWindow = document.createElement('div');
  popupWindow.className = 'popup-window';
  popupWindow.innerHTML = `
    <h2 id="popUpWindowHeader">Insertion</h2>
    <div>
      <label for="dna-sequence-input">DNA Sequence:</label>
      <input type="text" id="dna-sequence-input">
    </div>
    <div>
      <label for="amino-acid-sequence-input">Amino Acid Sequence:</label>
      <input type="text" id="amino-acid-sequence-input">
      <p class="stop-codon-hint">Accepted STOP letter codes: "-", "X", "*".</p>
    </div>
    <div>
      <button id="create-primers-button">Create Primers</button>
      <button id="cancel-button">Cancel</button>
    </div>
  `;
  popupWindow.style.display = 'none';
  document.body.appendChild(popupWindow);

  // Button listeners
  popupWindow.addEventListener('click', function (event) {
    // Creat primers button
    if (event.target.id === 'create-primers-button') {
      // Get the entered values from the text inputs and sanitize them
      // To uppercase, then remove anything that is not ACTG
      dnaSequenceInput = document.getElementById('dna-sequence-input').value.toUpperCase().replace(/[^ATCG]/g, '');
      // To uppercase, replace "-" and "*" with X
      aminoAcidSequenceInput = document.getElementById('amino-acid-sequence-input').value.toUpperCase().replace(/[-*]/g, 'X');
      // Only keep allowed amino acid 1 letter codes
      const allowedLetterCodes = Object.keys(aaToCodon);
      aminoAcidSequenceInput = aminoAcidSequenceInput.split('').filter(char => allowedLetterCodes.includes(char)).join('');

      // Call the function to create insertion primers or replacement primers if we have text selected
      if (!selectionEndPos) {
        createReplacementPrimers(dnaSequenceInput, aminoAcidSequenceInput, insertionPosition);
      } else {
        createReplacementPrimers(dnaSequenceInput, aminoAcidSequenceInput, selectionStartPos, selectionEndPos);
      }
      
      // Clear the text inputs
      document.getElementById('dna-sequence-input').value = '';
      document.getElementById('amino-acid-sequence-input').value = '';

      // Hide the popup window
      hidePopupWindow();
      
      // Cancel button
    } else if (event.target.id === 'cancel-button') {
      // Hide the popup window
      hidePopupWindow();
    }
  });

  // On window resize, reposition the window
  window.addEventListener('resize', function () {
    positionContextMenu(event.clientX, event.clientY);
  });
});


/**
 * Display pop up window and change its header.
 */
function showPopupWindow(headerText) {
  const popupWindow = document.querySelector('.popup-window');
  popupWindow.style.display = 'block';

  const popupWindowHeader = document.getElementById('popUpWindowHeader');
  popupWindowHeader.innerText = headerText;
}


/**
 * Hide pop up window.
 */
function hidePopupWindow() {
  const popupWindow = document.querySelector('.popup-window');
  popupWindow.style.display = 'none';
}


/**
 * Move context menu to coordinates.
 */
function positionContextMenu(clientX, clientY) {
  const contextMenu = document.querySelector('.custom-context-menu');
  contextMenu.style.left = clientX + 'px';
  contextMenu.style.top = clientY + 'px';
  contextMenu.style.display = 'block';
}