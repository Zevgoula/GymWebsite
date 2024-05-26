document.getElementById('zip').addEventListener('input', function (e) {
    let input = e.target.value.replace(/\D/g, '').substring(0, 5);
    e.target.value = input;
});

document.getElementById('zip-form').addEventListener('submit', function (e) {
    const zipInput = document.getElementById('zip');

    // Basic zip code pattern validation
    const zipPattern = /^\d{5}$/;
    const isValidZip = zipPattern.test(zipInput.value);

    if (!isValidZip) {
        e.preventDefault();
        zipError.style.display = 'inline';
    } else {
        zipError.style.display = 'none';
    }
});