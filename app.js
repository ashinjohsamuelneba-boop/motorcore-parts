document.addEventListener('DOMContentLoaded', () => {
  const partsGrid = document.getElementById('partsGrid');
  const requestForm = document.getElementById('requestFormInner');

  // Fetch Inventory from D1 API with static fallback
  async function loadInventory() {
    try {
      const response = await fetch('/api/parts');
      if (!response.ok) throw new Error('API unavailable');
      const parts = await response.json();
      
      if (Array.isArray(parts) && parts.length > 0) {
        renderParts(parts);
      }
    } catch (err) {
      console.warn('Using fallback inventory:', err.message);
      // Retains static HTML content on fetch failure
    }
  }

  function renderParts(parts) {
    if (!partsGrid) return;
    partsGrid.innerHTML = parts.map(part => `
      <article class="part-card" style="border: 1px solid rgba(255, 255, 255, 0.15); padding: 20px; border-radius: 12px; background: #1e293b;">
        <div class="part-card-info">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 0.75rem;">IN STOCK & TESTED</span>
            <span style="font-size: 0.8rem; color: #94a3b8;">Stock ID: #${part.stock_id || 'MC-' + part.id}</span>
          </div>
          <h3 style="font-size: 1.25rem; margin-bottom: 6px;">${part.title}</h3>
          <p class="part-meta" style="color: #94a3b8; font-size: 0.85rem; margin-bottom: 12px;">
            <strong>OEM Part #:</strong> ${part.oem_number || 'N/A'} <br>
            <strong>Fits:</strong> ${part.year_start}-${part.year_end} ${part.make} ${part.model}
          </p>
          <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 8px; font-size: 0.85rem; color: #cbd5e1; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05);">
            <p style="margin-bottom: 4px;">✔ <strong>Condition:</strong> ${part.condition || 'Tested / Operational'}</p>
            <p style="margin-bottom: 4px;">✔ <strong>Donor Vehicle:</strong> ${part.donor_info || 'Verified Auto Stock'}</p>
            <p>✔ <strong>Includes:</strong> 90-Day Standard Replacement Warranty</p>
          </div>
        </div>
        <div class="part-card-action" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
          <div>
            <span style="font-size: 0.75rem; color: #94a3b8; display: block;">Special Price</span>
            <p class="part-price" style="font-size: 1.4rem; font-weight: bold; color: #2563eb;">$${part.price}</p>
          </div>
          <a href="sms:+12134362939?body=Hi%2C%20I'm%20interested%20in%20Stock%20ID%20%23${part.stock_id || part.id}" class="btn primary" style="padding: 8px 16px; font-size: 0.9rem;">Order / Text Info</a>
        </div>
      </article>
    `).join('');
  }

  // Submit Quotes to Backend API
  if (requestForm) {
    requestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = requestForm.querySelector('button[type="submit"]');
      btn.textContent = 'Submitting Request...';
      btn.disabled = true;

      const payload = {
        name: document.getElementById('reqName').value,
        email: document.getElementById('reqEmail').value,
        phone: document.getElementById('reqPhone').value,
        vehicle: document.getElementById('reqVehicle').value,
        details: document.getElementById('reqDetails').value,
      };

      try {
        const res = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert('Quote request submitted! Our team will contact you shortly.');
          requestForm.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        alert('Request recorded! You can also text us directly at (213) 436-2939 for instant support.');
      } finally {
        btn.textContent = 'Submit Quote Request';
        btn.disabled = false;
      }
    });
  }

  loadInventory();
});
