document.getElementById('nameForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('nameInput').value;

    try {
      const response = await fetch('https://santaback-xta6.onrender.com/api/names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        document.getElementById('nameInput').value = '';
        fetchNames();
      } else {
        alert('Failed to submit name.');
      }
    } catch (err) {
      alert('Error submitting name: ' + err.message);
    }
  });

  async function fetchNames() {
    try {
      const response = await fetch('https://santaback-xta6.onrender.com/api/names');
      if (response.ok) {
        const names = await response.json();
        const nameList = document.getElementById('nameList');
        nameList.innerHTML = '<h2>Submitted Names:</h2>' + names.map(name => `<p>${name.name} (${name.created_at})</p>`).join('');
      } else {
        document.getElementById('nameList').textContent = 'Failed to fetch names.';
      }
    } catch (err) {
      document.getElementById('nameList').textContent = 'Error fetching names: ' + err.message;
    }
  }

  // Fetch names on page load
  fetchNames();