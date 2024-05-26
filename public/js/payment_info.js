document.getElementById('ccn').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    let formattedValue = '';
    for (let i = 0; i < value.length; i += 4) {
        formattedValue += value.substring(i, i + 4) + '-';
    }
    formattedValue = formattedValue.substring(0, formattedValue.length - 1); // Remove the trailing dash
    e.target.value = formattedValue;
});

document.getElementById('exp-date').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    if (value.length > 2) {
        let month = value.substring(0, 2);
        let year = value.substring(2, 4);

        // Validate month
        if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
            month = '';
        }
        value = month + (year ? '/' + year : '');
    }
    e.target.value = value;
});