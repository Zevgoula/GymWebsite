document.addEventListener('DOMContentLoaded', function() {
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    const header = document.querySelector('.calendar-header h1');

    let currentDate = new Date();

    function updateHeader() {
        const options = { year: 'numeric', month: 'long' };
        header.textContent = currentDate.toLocaleDateString(undefined, options);
    }

    prevWeekBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 7);
        updateHeader();
    });

    nextWeekBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 7);
        updateHeader();
    });

    updateHeader();
});
