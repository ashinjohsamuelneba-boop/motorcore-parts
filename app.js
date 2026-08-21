document.addEventListener("DOMContentLoaded", () => {
    // Check if we are on the homepage catalog
    const partsGrid = document.getElementById("parts-grid");
    if (partsGrid) {
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
    }

    // Inquiry Modal Logic
    const modal = document.getElementById("inquiry-modal");
    const closeModalBtn = document.getElementById("close-modal");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    const inquiryForm = document.getElementById("inquiry-form");
    if (inquiryForm) {
        inquiryForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const partDesc = document.getElementById("inq-part-desc").value;
            const data = {
                customer_name: document.getElementById("inq-name").value,
                customer_email: document.getElementById("inq-email").value,
                customer_phone: document.getElementById("inq-phone").value,
                location: document.getElementById("inq-location").value,
                delivery_preference: document.getElementById("inq-delivery").value,
                part_description: partDesc,
                vehicle_details: document.getElementById("inq-message").value
            };

            try {
                const res = await fetch("/api/inquiries", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    alert("Inquiry submitted successfully! We will contact you soon with payment and delivery details.");
                    modal.style.display = "none";
                    inquiryForm.reset();
                } else {
                    alert("Error: " + (result.error || "Could not submit inquiry"));
                }
            } catch (err) {
                alert("Network error. Please try again.");
            }
        });
    }

    // Admin Login Logic
    const adminLoginForm = document.getElementById("admin-login-form");
    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("admin-user").value;
            const password = document.getElementById("admin-pass").value;

            try {
                const res = await fetch("/api/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });
                const result = await res.json();
                if (result.success) {
                    localStorage.setItem("motorcore_admin_token", result.token);
                    window.location.href = "admin.html";
                } else {
                    alert("Invalid username or password");
                }
            } catch (err) {
                alert("Login failed. Check connection.");
            }
        });
    }

    // If on admin dashboard, load admin data
    const adminDashboard = document.getElementById("admin-dashboard-container");
    if (adminDashboard) {
        const token = localStorage.getItem("motorcore_admin_token");
        if (!token) {
            window.location.href = "admin.html";
            return;
        }
        loadAdminInquiries();
        
        const addPartForm = document.getElementById("add-part-form");
        if (addPartForm) {
            addPartForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const partData = {
                    sku: document.getElementById("part-sku").value,
                    name: document.getElementById("part-name").value,
                    category: document.getElementById("part-category").value,
                    vehicle_make: document.getElementById("part-make").value,
                    vehicle_model: document.getElementById("part-model").value,
                    vehicle_year_start: parseInt(document.getElementById("part-year-start").value) || 0,
                    vehicle_year_end: parseInt(document.getElementById("part-year-end").value) || 0,
                    price: parseFloat(document.getElementById("part-price").value) || 0,
                    stock_quantity: parseInt(document.getElementById("part-stock").value) || 1,
                    image_url: document.getElementById("part-image").value,
                    condition: document.getElementById("part-condition").value,
                    availability: document.getElementById("part-availability").value
                };

                const res = await fetch("/api/admin/parts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(partData)
                });
                const result = await res.json();
                if (result.success) {
                    alert("Part added successfully!");
                    addPartForm.reset();
                    loadPartsAdmin();
                } else {
                    alert("Error: " + result.error);
                }
            });
        }
    }
});

// Helper function to load parts into grid
async function loadParts(filters = {}) {
    const partsGrid = document.getElementById("parts-grid");
    if (!partsGrid) return;

    partsGrid.innerHTML = `<p style="color: var(--muted);">Loading inventory...</p>`;

    try {
        const res = await fetch("/api/parts");
        let parts = await res.json();

        // Apply filters client-side if specified
        if (filters.make) {
            parts = parts.filter(p => p.vehicle_make && p.vehicle_make.toLowerCase() === filters.make.toLowerCase());
        }
        if (filters.model) {
            parts = parts.filter(p => p.vehicle_model && p.vehicle_model.toLowerCase().includes(filters.model.toLowerCase()));
        }
        if (filters.year) {
            const yr = parseInt(filters.year);
            parts = parts.filter(p => (!p.vehicle_year_start || p.vehicle_year_start <= yr) && (!p.vehicle_year_end || p.vehicle_year_end >= yr));
        }

        if (parts.length === 0) {
            partsGrid.innerHTML = `<p style="color: var(--muted);">No matching auto parts found.</p>`;
            return;
        }

        partsGrid.innerHTML = parts.map(part => `
            <div class="part-card">
                <img src="${part.image_url || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80'}" alt="${part.name}" class="part-img">
                <div class="part-info">
                    <div class="part-title">${part.name}</div>
                    <div class="part-meta">Vehicle: ${part.vehicle_make || ''} ${part.vehicle_model || ''} (${part.vehicle_year_start || ''}-${part.vehicle_year_end || ''})</div>
                    <div class="part-meta">SKU: ${part.sku} | Condition: ${part.condition || 'New'}</div>
                    <div class="part-price">$${part.price.toFixed(2)}</div>
                    <button class="btn-inquire" onclick="openInquiryModal('${part.name} (SKU: ${part.sku})')">Request to Buy</button>
                </div>
            </div>
        `).join("");
    } catch (err) {
        partsGrid.innerHTML = `<p style="color: var(--muted);">Failed to load catalog.</p>`;
    }
}

function openInquiryModal(partDescription) {
    const modal = document.getElementById("inquiry-modal");
    document.getElementById("display-part-title").innerText = partDescription;
    document.getElementById("inq-part-desc").value = partDescription;
    modal.style.display = "flex";
}

async function loadAdminInquiries() {
    const container = document.getElementById("admin-inquiries-list");
    if (!container) return;
    try {
        const res = await fetch("/api/admin/inquiries");
        const inquiries = await res.json();
        if (inquiries.length === 0) {
            container.innerHTML = `<p style="color:var(--muted);">No customer inquiries yet.</p>`;
            return;
        }
        container.innerHTML = inquiries.map(inq => `
            <div style="background:var(--bg-dark); border:1px solid var(--border); padding:15px; border-radius:6px; margin-bottom:10px;">
                <p><strong>Customer:</strong> ${inq.customer_name} (${inq.customer_email}, ${inq.customer_phone || 'No Phone'})</p>
                <p><strong>Part Requested:</strong> ${inq.part_description}</p>
                <p><strong>Location / Delivery:</strong> ${inq.location || 'N/A'} via ${inq.delivery_preference}</p>
                <p><strong>Message:</strong> ${inq.vehicle_details || 'None'}</p>
                <p style="font-size:0.85rem; color:var(--muted); margin-top:5px;">Status: ${inq.status} | Date: ${inq.created_at}</p>
            </div>
        `).join("");
    } catch (err) {
        container.innerHTML = `<p style="color:var(--muted);">Failed to load inquiries.</p>`;
    }
}
  
