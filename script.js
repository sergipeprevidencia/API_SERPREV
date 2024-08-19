function toggleContent(event) {
    const content = event.target.nextElementSibling;
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

function fetchData(event) {
    const table = event.target.dataset.table;
    const filters = document.getElementById(`${table}Filters`).querySelectorAll('input');
    const url = `https://wtxoasyroqckpsnlibjx.supabase.co/rest/v1/${table}`;
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0eG9hc3lyb3Fja3BzbmxpYmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM3NTA1ODAsImV4cCI6MjAzOTMyNjU4MH0.y0f4drZkKN9K0gRzCsFuG0yErhAwOmJTsDTNaGjzlB4';

    let queryParams = `?select=*`;
    filters.forEach(filter => {
        if (filter.value) {
            queryParams += `&${filter.dataset.key}=eq.${filter.value}`;
        }
    });

    fetch(url + queryParams, {
        headers: {
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById(`${table}Output`).textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function downloadCSV(event) {
    const table = event.target.dataset.table;
    const jsonData = document.getElementById(`${table}Output`).textContent;
    const jsonArray = JSON.parse(jsonData);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += Object.keys(jsonArray[0]).join(',') + '\n';

    jsonArray.forEach(row => {
        csvContent += Object.values(row).join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${table}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadJSON(event) {
    const table = event.target.dataset.table;
    const jsonData = document.getElementById(`${table}Output`).textContent;
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${table}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.querySelectorAll('.toggle-button').forEach(button => {
    button.addEventListener('click', toggleContent);
});

document.querySelectorAll('.fetch-data').forEach(button => {
    button.addEventListener('click', fetchData);
});

document.querySelectorAll('.download-csv').forEach(button => {
    button.addEventListener('click', downloadCSV);
});

document.querySelectorAll('.download-json').forEach(button => {
    button.addEventListener('click', downloadJSON);
});