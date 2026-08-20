// Load inventory from live D1 Database
async function loadParts() {
  const partsGrid = document.getElementById('partsGrid');
  if (!partsGrid) return;

  try {
    const res = await fetch('/api/parts');
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      partsGrid.innerHTML = '<p>No parts available in inventory right now.</p>';
      return;
    }

    partsGrid.innerHTML = data.map(part => `
      <div class="part-card">
        <span class="badge">${part.category || 'General'}</span>
        <h3>${part.name}</h3>
        <p class="sku">SKU: ${part.sku}</p>
        <p class="desc">${part.description || ''}</p>
        <div class="card-footer">
          <span class="price">$${parseFloat(part.price).toFixed(2)}</span>
          <span class="stock">${part.stock > 0 ? `In Stock (${part.stock})` : 'Out of Stock'}</span>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load parts:', err);
    partsGrid.innerHTML = '<p>Unable to load inventory. Please try again later.</p>';
  }
}

// Handle Customer Part Requests
document.getElementById('requestForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    customer_name: document.getElementById('reqName').value,
    customer_email: document.getElementById('reqEmail').value,
    customer_phone: document.getElementById('reqPhone').value,
    vehicle_info: document.getElementById('reqVehicle').value,
    part_description: document.getElementById('reqDetails').value
  };

  try {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert('Your request has been submitted to the MotorCore team!');
      e.target.reset();
    } else {
      alert('Failed to submit request. Please try again.');
    }
  } catch (err) {
    alert('Server error. Please try again later.');
  }
});

document.addEventListener('DOMContentLoaded', loadParts);
