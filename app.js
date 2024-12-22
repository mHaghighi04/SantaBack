let participants = [];

// Add a participant
document.getElementById('add-participant').addEventListener('click', () => {
  if (!name || !email) {
    alert('Both name and email are required.');
    return;
  }
  if (participants.some(p => p.email === email)) {
    alert('This email has already been added.');
    return;
  }
      
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  if (name && email) {
    participants.push({ name, email });
    const list = document.getElementById('participants-list');
    const listItem = document.createElement('li');
    listItem.textContent = `${name} - ${email}`;
    list.appendChild(listItem);

    // Clear the input fields
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
  }
});

// Assign Santas
document.getElementById('assign-santas').addEventListener('click', async () => {
  if (participants.length < 2) {
    alert('At least two participants are needed!');
    return;
  }

  const assignments = assignSantas(participants);

  // Send assignments to the server to send emails
  const response = await fetch('https://santaback-xta6.onrender.com/assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assignments),
  });

  if (response.ok) {
    alert('Assignments sent successfully!');
  } else {
    alert('Failed to send assignments.');
  }
});

// Randomize assignments
function assignSantas(participants) {
  let shuffled;
  let valid = false;

  while (!valid) {
    shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    valid = participants.every((p, i) => p.name !== shuffled[i].name);
  }

  return participants.map((participant, i) => ({
    giver: participant.name,
    receiver: shuffled[i].name,
    email: participant.email,
  }));
}
