/**
 * popup.js
 * Updated to handle Supabase sync and custom notifications.
 */

const $ = (s, root = document) => root.querySelector(s);

const storage = {
    async get(keys) { return new Promise((resolve) => chrome.storage.sync.get(keys, resolve)); },
    async set(obj) { return new Promise((resolve) => chrome.storage.sync.set(obj, resolve)); },
};

const state = {
    currentItem: {
        id: "lela-dress",
        title: "LELA DRESS",
        price: 248,
        shop: "Reformation",
        image: "icons/lela_dress.png",
    },
    similar: [
        {
            id: "floral-midi",
            title: "FLORAL STRETCH MIDI DRESS",
            shop: "ZARA",
            price: 39.99,
            oldPrice: 49.99,
            discountType: "sale",
            image: "icons/zara_dress.png",
            url: "https://www.zara.com/uk/en/floral-stretch-midi-dress-p05584225.html",
        },
        {
            id: "black-embroidered",
            title: "Black Floral Embroidered Dallas",
            shop: "NOBODY'S CHILD",
            price: 64.0,
            oldPrice: 80.0,
            discountType: "student",
            image: "icons/nobodys_child_dress.png",
            url: "https://www.nobodyschild.com/",
        },
    ],
    budget: 200,
    spent: 140,
    wishlist: [],
    wishlistCount: 0,
};

// --- UI HELPERS ---

function formatGBP(n) { return `£${Number(n).toFixed(2)}`; }

function showAlert(message, type = 'info') {
    const alertsBox = $("#alerts");
    alertsBox.style.display = "block";
    const el = document.createElement("div");
    el.className = `alert ${type}`;
    el.textContent = message;
    alertsBox.prepend(el);
    setTimeout(() => { el.remove(); if(!alertsBox.childNodes.length) alertsBox.style.display="none"; }, 3000);
}

function setThumb(el, token) {
    el.classList.add("item-thumb");
    if (!token) return;
    const isPath = token.startsWith("icons/") || token.startsWith("images/");
    if (isPath) {
        const url = chrome.runtime.getURL(token);
        el.style.backgroundImage = `url('${url}')`;
        el.style.backgroundSize = "cover";
        return;
    }
    el.style.background = "linear-gradient(135deg,#dfe7ff,#c5d1ff)";
}

function setBrandLogo() {
    const logoEl = $("#brandLogo");
    if (!logoEl) return;
    const candidates = [
        "icons/T_logo.png",
        "icons/thriftly_logo.png",
        "icons/logo.png",
        "icons/thriftly.png",
    ];
    candidates.forEach(path => {
        const url = chrome.runtime.getURL(path);
        logoEl.src = url;
        logoEl.onerror = () => {
            // If image fails to load, use text fallback
            const header = logoEl.parentElement;
            if (header) {
                logoEl.remove();
                const brand = document.createElement("div");
                brand.className = "brand";
                brand.textContent = "Thriftly";
                header.prepend(brand);
            }
        };
    });
}

function collectAlerts() {
    const alerts = [];
    if (state.similar.some((s) => s.discountType === "sale")) {
        alerts.push({ type: "sale", text: "Sale found on similar items" });
    }
    if (state.similar.some((s) => s.discountType === "student")) {
        alerts.push({ type: "student", text: "Student discount available" });
    }
    return alerts;
}

function renderAlerts() {
    const wrap = $("#alerts");
    wrap.innerHTML = "";
    const items = collectAlerts();
    items.forEach((a) => {
        const el = document.createElement("div");
        el.className = `alert ${a.type}`;
        el.textContent = a.text;
        if (a.type === "sale") {
            el.style.cursor = "pointer";
            el.title = "Jump to sale item";
            el.addEventListener("click", () => {
                const target = state.similar.find((s) => s.id === "floral-midi") || state.similar.find((s) => s.discountType === "sale");
                if (!target) return;
                const row = document.getElementById(`item-${target.id}`);
                if (!row) return;
                row.scrollIntoView({ behavior: "smooth", block: "center" });
                highlightRow(row);
            });
        }
        if (a.type === "student") {
            el.style.cursor = "pointer";
            el.title = "Jump to student discount item";
            el.addEventListener("click", () => {
                const target = state.similar.find((s) => s.id === "black-embroidered") || state.similar.find((s) => s.discountType === "student");
                if (!target) return;
                const row = document.getElementById(`item-${target.id}`);
                if (!row) return;
                row.scrollIntoView({ behavior: "smooth", block: "center" });
                highlightRow(row);
            });
        }
        wrap.appendChild(el);
    });
    if (!items.length) wrap.style.display = "none";
}

function highlightRow(row) {
    row.classList.add("highlight");
    setTimeout(() => row.classList.remove("highlight"), 1200);
}

function ensureSvgGradient() {
    const svg = $(".circular");
    if (!svg) return;
    if ($("defs", svg)) return;
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const lg = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    lg.setAttribute("id", "grad");
    lg.setAttribute("x1", "0%");
    lg.setAttribute("x2", "100%");
    lg.setAttribute("y1", "0%");
    lg.setAttribute("y2", "0%");
    const s1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    s1.setAttribute("offset", "0%");
    s1.setAttribute("stop-color", "#8a4bff");
    const s2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    s2.setAttribute("offset", "100%");
    s2.setAttribute("stop-color", "#c27dff");
    lg.appendChild(s1); lg.appendChild(s2); defs.appendChild(lg); svg.prepend(defs);
}

// --- RENDER LOGIC ---

function renderCurrentItem() {
    $("#currentTitle").textContent = state.currentItem.title;
    $("#currentPrice").textContent = formatGBP(state.currentItem.price);
    $(".current-item .meta").textContent = `${state.currentItem.shop} • New in`;
    setThumb($("#currentImage"), state.currentItem.image);
}

function renderSimilar() {
    const list = $("#similarList");
    list.innerHTML = "";
    state.similar.forEach((it) => {
        const row = document.createElement("div");
        row.className = "item";
        row.id = `item-${it.id}`;
        if (it.url) {
            row.style.cursor = "pointer";
            row.title = "Open product page";
            row.addEventListener("click", () => {
                chrome.tabs.create({ url: it.url });
            });
        }

        const thumb = document.createElement("div");
        setThumb(thumb, it.image);

        const main = document.createElement("div");
        main.className = "item-main";
        const title = document.createElement("p");
        title.className = "item-title";
        title.textContent = it.title;
        const sub = document.createElement("div");
        sub.className = "item-sub";
        sub.textContent = it.shop;
        main.append(title, sub);

        const right = document.createElement("div");
        right.className = "item-right";
        const pill = document.createElement("div");
        pill.className = "pill";
        if (it.discountType === "sale") pill.textContent = "Sale";
        else if (it.discountType === "student") pill.textContent = "Student";
        else pill.style.display = "none";

        const priceLine = document.createElement("div");
        priceLine.className = "price-line";
        priceLine.textContent = formatGBP(it.price);
        if (it.oldPrice) {
            const strike = document.createElement("span");
            strike.className = "strike";
            strike.textContent = formatGBP(it.oldPrice);
            priceLine.appendChild(strike);
        }

        const saveBtn = document.createElement("button");
        saveBtn.className = "chip small ghost";
        saveBtn.textContent = "Save";
        saveBtn.addEventListener("click", async () => {
            await addToWishlist(it);
        });
        saveBtn.addEventListener("click", (e) => { e.stopPropagation(); });

        right.append(pill, priceLine, saveBtn);
        row.append(thumb, main, right);
        list.appendChild(row);
    });
}

function updateBudgetUI() {
    $("#budget").textContent = formatGBP(state.budget);
    $("#spent").textContent = formatGBP(state.spent);
    const pct = state.budget > 0 ? Math.min(100, Math.round((state.spent / state.budget) * 100)) : 0;
    const arc = $("#progressArc");
    arc.setAttribute("stroke-dasharray", `${pct}, 100`);
}

// --- SUPABASE & STORAGE LOGIC ---

async function loadPersisted() {
    const stored = await storage.get(["budget", "spent", "wishlist"]);
    if (stored.budget) state.budget = stored.budget;
    if (stored.spent) state.spent = stored.spent;
    
    // Get wishlist count from Supabase
    try {
        const db = window.supabaseClient;
        if (db) {
            const { data, error } = await db.from('wishlist').select('id').execute();
            if (!error && data) {
                state.wishlistCount = data.length;
                renderWishlistCount();
            }
        }
    } catch (e) { 
        console.error("Supabase load error:", e);
        // Set default count if Supabase not available
        state.wishlistCount = 0;
        renderWishlistCount();
    }
}

async function addToWishlist(item) {
    const db = window.supabaseClient;
    
    // 1. Update Local State
    if (!state.wishlist.find(w => w.id === item.id)) {
        state.wishlist.push({ id: item.id, title: item.title, price: item.price });
    }

    // 2. Persist to Supabase
    try {
        if (db) {
            // Check if item already exists
            const { data: existingItem } = await db.from('wishlist').select('id').eq('item_id', item.id).execute();
            
            if (existingItem && existingItem.length > 0) {
                showAlert("Item already saved!", "info");
            } else {
                const { error } = await db.from('wishlist').upsert({
                    item_id: item.id,
                    title: item.title,
                    price: item.price,
                    shop: item.shop || 'Unknown',
                    image: item.image || '',
                    url: item.url || '',
                    created_at: new Date().toISOString()
                }, { onConflict: 'item_id' });

                if (error) throw error;
                
                // Update count from database
                const { data: countData } = await db.from('wishlist').select('id').execute();
                state.wishlistCount = countData.length;
                renderWishlistCount();
                
                showAlert("Saved to Cloud!", "success");
            }
        } else {
            showAlert("Supabase not available", "error");
        }
    } catch (e) {
        console.error("Cloud Save Error:", e);
        showAlert("Saved locally (Offline)", "info");
    }
    
    await storage.set({ wishlist: state.wishlist });
}

function renderWishlistCount() {
    $("#wishlistCount").textContent = String(state.wishlistCount || 0);
}

function wireEvents() {
    $("#saveItemBtn").onclick = () => addToWishlist(state.currentItem);
    $("#infoBtn").onclick = () => showAlert("Thriftly helps you stay on budget!", "info");
    $("#wishlistBtn").onclick = () => {
        showAlert(`View your ${state.wishlistCount || 0} saved items on your dashboard!`, "info");
    };
}

async function init() {
    ensureSvgGradient();
    setBrandLogo();
    await loadPersisted();
    renderCurrentItem();
    renderSimilar();
    renderAlerts();
    updateBudgetUI();
    renderWishlistCount();
    wireEvents();
}

document.addEventListener("DOMContentLoaded", init);