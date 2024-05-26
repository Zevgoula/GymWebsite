// Store selected button IDs for each date and name combination
const selectedButtons = {};
let selectedSessionIds = [];

// Select all buttons
const buttons = document.querySelectorAll('.schedule-cell button');

// Add click event listener to each button
buttons.forEach(button => {
    button.addEventListener('click', function() {
        // Get the clicked button's ID, date, and name
        const buttonId = this.getAttribute('id');
        const [sessionId, buttonDate, buttonTime, buttonName] = buttonId.split('_');

        // Check if the clicked button is already selected
        const isAlreadySelected = this.classList.contains('selected');

        if (isAlreadySelected) {
            // Deselect the clicked button
            this.classList.remove('selected');

            // Remove the button from selectedButtons and session IDs
            delete selectedButtons[buttonDate + '_' + buttonName];
            delete selectedButtons[buttonDate + '_' + buttonTime];
            const index = selectedSessionIds.indexOf(sessionId);
            if (index > -1) {
                selectedSessionIds.splice(index, 1);
            }
        } else {
            // Check if there's a selected button for the same date and name
            const prevSelectedButtonId = selectedButtons[buttonDate + '_' + buttonName];
            // Check if there's a selected button for the same date and time
            const prevSelectedButtonAtSameTimeId = selectedButtons[buttonDate + '_' + buttonTime];

            // Deselect the previously selected button for the same date and name (if any)
            if (prevSelectedButtonId && prevSelectedButtonId !== buttonId) {
                const prevSelectedButton = document.getElementById(prevSelectedButtonId);
                if (prevSelectedButton) {
                    prevSelectedButton.classList.remove('selected');
                    const prevSessionId = prevSelectedButtonId.split('_')[0];
                    const index = selectedSessionIds.indexOf(prevSessionId);
                    if (index > -1) {
                        selectedSessionIds.splice(index, 1);
                    }
                }
            }

            // Deselect the previously selected button for the same date and time (if any)
            if (prevSelectedButtonAtSameTimeId && prevSelectedButtonAtSameTimeId !== buttonId) {
                const prevSelectedButtonAtSameTime = document.getElementById(prevSelectedButtonAtSameTimeId);
                if (prevSelectedButtonAtSameTime) {
                    prevSelectedButtonAtSameTime.classList.remove('selected');
                    const prevSessionId = prevSelectedButtonAtSameTimeId.split('_')[0];
                    const index = selectedSessionIds.indexOf(prevSessionId);
                    if (index > -1) {
                        selectedSessionIds.splice(index, 1);
                    }
                }
            }

            // Select the clicked button
            this.classList.add('selected');

            // Update the selected button for the same date and name
            selectedButtons[buttonDate + '_' + buttonName] = buttonId;
            // Update the selected button for the same date and time
            selectedButtons[buttonDate + '_' + buttonTime] = buttonId;

            // Add the session ID to the list of selected session IDs if not already present
            if (!selectedSessionIds.includes(sessionId)) {
                selectedSessionIds.push(sessionId);
            }
        }

        console.log("Selected session IDs:", selectedSessionIds);
        document.getElementById('selectedSessionIDs').value = selectedSessionIds.join(',');
    });
});