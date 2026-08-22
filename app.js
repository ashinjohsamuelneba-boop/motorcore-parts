document.addEventListener("DOMContentLoaded", () => {
    loadParts();

    const filterForm = document.getElementById("filter-form");
    if (filterForm) {
        filterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const make = document.getElementById("filter-make").value;
            const model = document.getElementById("filter-model").value;
            const year = document.getElementById("filter-year").value;
            loadParts({ make, model, year });
        });
    }

    const modal = document.getElementById("inquiry-modal");
    const closeModalBtn = document.getElementById("close-modal");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    const inquiryForm = document.getElementById("inquiry-form");
    if (inquiryForm) {
        inquiryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Inquiry submitted successfully! We will contact you soon.");
            modal.style.display = "none";
            inquiryForm.reset();
        });
    }
});

function loadParts(filters = {}) {
    const partsGrid = document.getElementById("parts-grid");
    if (!partsGrid) return;

    let parts = [
        { sku: 'BR-FORD-150', name: 'Front Ceramic Brake Pads', vehicle_make: 'Ford', vehicle_model: 'F-150', vehicle_year_start: 2015, vehicle_year_end: 2020, price: 45.99, condition: 'New', image_url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80' },
        { sku: 'ALT-CHEV-SIL', name: 'High-Output Alternator', vehicle_make: 'Chevrolet', vehicle_model: 'Silverado', vehicle_year_start: 2014, vehicle_year_end: 2018, price: 189.50, condition: 'New', image_url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80' },
        { sku: 'SUS-TOY-CAM', name: 'Front Suspension Strut Assembly', vehicle_make: 'Toyota', vehicle_model: 'Camry', vehicle_year_start: 2012, vehicle_year_end: 2017, price: 95.00, condition: 'New', image_url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80' }
    ];

    if (filters.make) {
        parts = parts.filter(p => p.vehicle_make.toLowerCase() === filters.make.toLowerCase());
    }
    if (filters.model) {
        parts = parts.filter(p => p.vehicle_model.toLowerCase().includes(filters.model.toLowerCase()));
    }
    if (filters.year) {
        const yr = parseInt(filters.year);
        parts = parts.filter(p => p.vehicle_year_start <= yr && p.vehicle_year_end >= yr);
    }

    if (parts.length === 0) {
        partsGrid.innerHTML = `<p style="color: var(--muted);">No matching auto parts found.</p>`;
        return;
    }

    partsGrid.innerHTML = parts.map(part => `
        <div class="part-card">
            <img src="${part.image_url}" alt="${part.name}" class="part-img">
            <div class="part-info">
                <div class="part-title">${part.name}</div>
                <div class="part-meta">Vehicle: ${part.vehicle_make} ${part.vehicle_model} (${part.vehicle_year_start}-${part.vehicle_year_end})</div>
                <div class="part-meta">SKU: ${part.sku} | Condition: ${part.condition}</div>
                <div class="part-price">$${part.price.toFixed(2)}</div>
                <button class="btn-inquire" onclick="openInquiryModal('${part.name} (SKU: ${part.sku})')">Request to Buy</button>
            </div>
        </div>
    `).join("");
}

function openInquiryModal(partDescription) {
    const modal = document.getElementById("inquiry-modal");
    document.getElementById("display-part-title").innerText = partDescription;
    document.getElementById("inq-part-desc").value = partDescription;
    modal.style.display = "flex";
}
