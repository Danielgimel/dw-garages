let vehicles = [];
let currentVehicles = [];
let selectedVehicle = null;
let currentCategory = 'all';
let currentGarage = null;
let sharedGarages = [];
let currentHoveredVehicle = null;
let isHoverPanelVisible = false;
let currentRequestData = null;
let isLoading = false;
let currentSharedGarageId = null;
let isRemovingFromSharedGarage = false;
let originalVehicles = [];
let impoundedVehicles = [];
let currentImpoundLot = null;
let selectedImpoundVehicle = null;
let vehiclesAlreadyOut = {}; 


const DOM = {
    garageContainer: document.getElementById('quantum-garage'),
    vehiclesGrid: document.getElementById('vehicles-carousel'),
    vehicleDetails: document.getElementById('vehicle-details'),
    noSelection: document.getElementById('no-selection'),
    emptyState: document.getElementById('empty-state'),
    loadingOverlay: document.getElementById('loading-overlay'),
    sharedGarageSelect: document.getElementById('shared-garage-select'),
    navItems: document.querySelectorAll('.nav-item'),
    garageToggle: document.getElementById('garage-toggle'),
    currentGarageName: document.getElementById('current-garage-name'),
    searchInput: document.getElementById('quantum-search'),
    infoVehicleName: document.getElementById('info-vehicle-name'),
    infoPlate: document.getElementById('info-plate'),
    infoModel: document.getElementById('info-model'),
    infoOwner: document.getElementById('info-owner'),
    infoGarage: document.getElementById('info-garage'),
    fuelBar: document.getElementById('fuel-bar'),
    engineBar: document.getElementById('engine-bar'),
    bodyBar: document.getElementById('body-bar'),
    fuelPercentage: document.getElementById('fuel-percentage'),
    enginePercentage: document.getElementById('engine-percentage'),
    bodyPercentage: document.getElementById('body-percentage'),
    takeOutBtn: document.getElementById('take-out-btn'),
    favoriteBtn: document.getElementById('favorite-btn'),
    renameBtn: document.getElementById('rename-btn'),
    shareBtn: document.getElementById('share-btn'),
    renameModal: document.getElementById('rename-modal'),
    sharedGarageModal: document.getElementById('shared-garage-modal'),
    garageSelectionModal: document.getElementById('garage-selection-modal'),
    sharedGarageSelectorModal: document.getElementById('shared-garage-selector-modal'),
    membersModal: document.getElementById('members-modal'),
    joinRequestModal: document.getElementById('join-request-modal'),
    closeModalButtons: document.querySelectorAll('.close-modal'),
    vehicleNameInput: document.getElementById('vehicle-name-input'),
    saveRenameBtn: document.getElementById('save-rename'),
    cancelRenameBtn: document.getElementById('cancel-rename'),
    sharedGaragesList: document.getElementById('shared-garages-list'),
    noSharedGarages: document.getElementById('no-shared-garages'),
    sharedTabs: document.querySelectorAll('.shared-tab'),
    joinCode: document.getElementById('join-code'),
    joinGarageBtn: document.getElementById('join-garage-btn'),
    newGarageName: document.getElementById('new-garage-name'),
    createGarageBtn: document.getElementById('create-garage-btn'),
    garageOptions: document.getElementById('garage-options'),
    sharedGarageList: document.getElementById('shared-garage-list'),
    selectSharedGarageBtn: document.getElementById('select-shared-garage'),
    membersList: document.getElementById('members-list'),
    noMembers: document.getElementById('no-members'),
    requesterName: document.getElementById('requester-name'),
    requestGarageName: document.getElementById('request-garage-name'),
    approveRequestBtn: document.getElementById('approve-request-btn'),
    denyRequestBtn: document.getElementById('deny-request-btn'),
    vehicleHoverPanel: document.getElementById('vehicle-hover-panel'),
    hoverVehicleName: document.getElementById('hover-vehicle-name'),
    hoverVehiclePlate: document.getElementById('hover-vehicle-plate'),
    hoverFuelBar: document.getElementById('hover-fuel-bar'),
    hoverEngineBar: document.getElementById('hover-engine-bar'),
    hoverBodyBar: document.getElementById('hover-body-bar'),
    hoverFuelValue: document.getElementById('hover-fuel-value'),
    hoverEngineValue: document.getElementById('hover-engine-value'),
    hoverBodyValue: document.getElementById('hover-body-value'),
    hoverEnterBtn: document.getElementById('hover-enter-btn'),
    hoverStoreBtn: document.getElementById('hover-store-btn')
};

window.addEventListener('message', function(event) {
    const data = event.data;
    
    switch(data.action) {
        case 'openGarage':
            openGarage(data);
            break;
        case 'closeGarage':
            closeGarage();
            break;
        case 'openSharedGarageManager':
            openSharedGarageManager(data);
            break;
        case 'openSharedGarageSelection':
            openSharedGarageSelection(data);
            break;
        case 'openSharedGarageMembersManager':
            openSharedGarageMembersManager(data);
            break;
        case 'openJoinRequest':
            openJoinRequest(data);
            break;
        case 'refreshVehicles':
            refreshVehicles(data.vehicles);
            break;
        case 'setImpoundOnly':
            setImpoundOnly(data.forceImpoundOnly);
            break;
        case 'showVehicleHover':
            showVehicleHoverPanel(data.vehicleData);
            break;
        case 'hideVehicleHover':
            hideVehicleHoverPanel();
            break;
        case 'openImpound':
            openImpoundUI(data);
            break;
        case 'garageDeleted':
            // Handle garage deletion notification
            const index = sharedGarages.findIndex(g => g.id === data.garageId);
            if (index !== -1) {
                sharedGarages.splice(index, 1);
                renderSharedGarages();
            }
            break;
    }
});

function init() {
    vehiclesAlreadyOut = {};
    setupEventListeners();
    setupImpoundEventListeners();
}

function setupEventListeners() {
    document.getElementById('close-quantum').addEventListener('click', closeGarage);
    
DOM.navItems.forEach(item => {
    item.addEventListener('click', () => {
        const category = item.dataset.category;
        if (category) {
            if (category === 'shared') {
                openSharedGarageSelector();
            } else if (category === 'impound') {
                // If we already have impound data, we can just filter and show it
                if (impoundedVehicles.length > 0) {
                    setActiveCategory('impound');
                } else {
                    // Otherwise show empty state
                    setActiveCategory('impound');
                    DOM.emptyState.classList.remove('hidden');
                }
            } else {
                setActiveCategory(category);
            }
        } else if (item.dataset.action === 'manage-shared') {
            handleManageShared();
        }
    });
});
    
    if (DOM.selectSharedGarageBtn) {
        DOM.selectSharedGarageBtn.addEventListener('click', openSharedGarageSelector);
    }
    
    const manageSharedBtn = document.getElementById('manage-shared');
    if (manageSharedBtn) {
        manageSharedBtn.addEventListener('click', handleManageShared);
    }
    
    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', () => {
            const searchTerm = DOM.searchInput.value.toLowerCase();
            searchVehicles(searchTerm);
        });
    }
    
    DOM.closeModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.garage-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    const closeSharedModal = document.getElementById('close-shared-modal');
    if (closeSharedModal) {
        closeSharedModal.addEventListener('click', () => {
            const modal = document.getElementById('shared-garage-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    }
    
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeAllModals();
            }
        });
    });

    document.querySelector('[data-category="jobvehicles"]').addEventListener('click', function() {
        setActiveCategory('jobvehicles');
        loadJobVehicles();
    });
    
    DOM.sharedTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            setActiveSharedTab(tabName);
        });
    });
    
    if (DOM.renameBtn) {
        DOM.renameBtn.addEventListener('click', () => {
            if (!selectedVehicle) return;
            
            DOM.vehicleNameInput.value = selectedVehicle.name;
            DOM.renameModal.classList.remove('hidden');
        });
    }
    
    if (DOM.saveRenameBtn) {
        DOM.saveRenameBtn.addEventListener('click', saveVehicleName);
    }
    
    if (DOM.cancelRenameBtn) {
        DOM.cancelRenameBtn.addEventListener('click', () => {
            DOM.renameModal.classList.add('hidden');
        });
    }
    
    if (DOM.joinGarageBtn) {
        DOM.joinGarageBtn.addEventListener('click', joinSharedGarage);
    }
    
    if (DOM.createGarageBtn) {
        DOM.createGarageBtn.addEventListener('click', createSharedGarage);
    }
    
    if (DOM.takeOutBtn) {
        DOM.takeOutBtn.addEventListener('click', takeOutVehicle);
    }
    
    if (DOM.favoriteBtn) {
        DOM.favoriteBtn.addEventListener('click', toggleFavorite);
    }
    
    if (DOM.shareBtn) {
        DOM.shareBtn.addEventListener('click', shareVehicle);
    }
    
    if (DOM.approveRequestBtn) {
        DOM.approveRequestBtn.addEventListener('click', () => handleJoinRequest(true));
    }
    
    if (DOM.denyRequestBtn) {
        DOM.denyRequestBtn.addEventListener('click', () => handleJoinRequest(false));
    }
    
    if (DOM.hoverEnterBtn) {
        DOM.hoverEnterBtn.addEventListener('click', hoverPanelEnterVehicle);
    }
    
    if (DOM.hoverStoreBtn) {
        DOM.hoverStoreBtn.addEventListener('click', hoverPanelStoreVehicle);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isModalOpen()) {
                closeAllModals();
            } else {
                closeGarage();
            }
        }
    });
}

function handleManageShared() {
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.remove('hidden');
    }
    
    fetch(`https://${GetParentResourceName()}/manageSharedGarages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(resp => resp.json())
    .then(data => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('hidden');
        }
        
        if (data && data.garages) {
            sharedGarages = data.garages;
        } else {
            sharedGarages = [];
        }
        
        renderSharedGarages();
        
        if (DOM.sharedGarageModal) {
            DOM.sharedGarageModal.classList.remove('hidden');
        }
        
        setActiveSharedTab('my-garages');
    })
    .catch(error => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('hidden');
        }
        
        if (DOM.sharedGarageModal) {
            DOM.sharedGarageModal.classList.remove('hidden');
        }
        
        setActiveSharedTab('my-garages');
    });
}

function openSharedGarageSelector() {
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.remove('hidden');
    }
    
    fetch(`https://${GetParentResourceName()}/manageSharedGarages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(resp => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('hidden');
        }
        
        return resp.json();
    })
    .then(response => {
        if (DOM.sharedGarageModal) {
            DOM.sharedGarageModal.classList.remove('hidden');
        }
    })
    .catch(error => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('hidden');
        }
        
        if (DOM.sharedGarageModal) {
            DOM.sharedGarageModal.classList.remove('hidden');
        }
    });
}

function populateSharedGarageList(garages) {
    if (!DOM.sharedGarageList) return;
    
    DOM.sharedGarageList.innerHTML = '';
    
    garages.forEach(garage => {
        const item = document.createElement('div');
        item.className = `shared-garage-item ${garage.isOwner ? 'owned' : ''}`;
        item.dataset.id = garage.id;
        
        item.innerHTML = `
            <div>${garage.name}</div>
            ${garage.isOwner ? '<span class="owner-badge">OWNER</span>' : ''}
        `;
        
        item.addEventListener('click', () => {
            selectSharedGarage(garage.id, garage.name);
            DOM.sharedGarageSelectorModal.classList.add('hidden');
        });
        
        DOM.sharedGarageList.appendChild(item);
    });
}

function selectSharedGarage(garageId, garageName) {
    currentSharedGarageId = garageId;
    
    if (DOM.currentGarageName) {
        DOM.currentGarageName.textContent = garageName || "Shared Garage";
    }
    
    if (DOM.sharedGarageSelect) {
        DOM.sharedGarageSelect.classList.add('hidden');
    }
    
    if (DOM.vehiclesGrid) {
        DOM.vehiclesGrid.classList.remove('hidden');
    }
    
    setActiveCategory('shared');
    
    loadSharedGarageVehicles(garageId);
}

function loadSharedGarageVehicles(garageId) {
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.remove('hidden');
    }
    
    fetch(`https://${GetParentResourceName()}/refreshVehicles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            garageId: garageId,
            garageType: "shared"
        })
    })
    .then(resp => resp.json())
    .catch(error => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('hidden');
        }
    });
}

function isModalOpen() {
    return document.querySelector('.garage-modal:not(.hidden)') !== null;
}

function closeAllModals() {
    document.querySelectorAll('.garage-modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// Open garage menu
function openGarage(data) {
    // Store the original vehicles as a backup for 'all' category
    originalVehicles = data.vehicles || [];
    vehicles = [...originalVehicles];  // Clone to prevent reference issues
    currentVehicles = [...vehicles];
    currentGarage = data.garage || {};
    
    // Reset shared garage ID when opening a new garage
    currentSharedGarageId = null;
    
    if (DOM.currentGarageName) {
        DOM.currentGarageName.textContent = currentGarage.name || 'Garage';
    }
    
    // Call our new function to refresh vehicle states
    refreshVehicleStates();
    
    const gangCategory = document.getElementById('gang-category');
    const jobCategory = document.getElementById('job-category');
    const sharedCategory = document.getElementById('shared-category');
    const impoundCategory = document.getElementById('impound-category');
    const jobVehiclesCategory = document.getElementById('job-vehicles-category');
    const allCategory = document.querySelector('[data-category="all"]');
    const favoritesCategory = document.querySelector('[data-category="favorites"]');
    const manageSharedBtn = document.getElementById('manage-shared');
    
    // Check if we're at an impound lot
    if (currentGarage.isImpound) {
        // AT IMPOUND LOT - SHOW ONLY IMPOUND TAB
        console.log("At impound lot - showing only impound tab");
        
        // Show only impound tab
        if (impoundCategory) impoundCategory.style.display = 'flex';
        
        // Hide all other tabs
        if (allCategory) allCategory.style.display = 'none';
        if (favoritesCategory) favoritesCategory.style.display = 'none';
        if (gangCategory) gangCategory.style.display = 'none';
        if (jobCategory) jobCategory.style.display = 'none';
        if (sharedCategory) sharedCategory.style.display = 'none';
        if (jobVehiclesCategory) jobVehiclesCategory.style.display = 'none';
        if (manageSharedBtn) manageSharedBtn.style.display = 'none';
        
        // Automatically select impound category
        setActiveCategory('impound');
    } else {
        // AT REGULAR GARAGE - SHOW REGULAR TABS, HIDE IMPOUND
        console.log("At regular garage - showing regular tabs");
        
        // Hide impound tab
        if (impoundCategory) impoundCategory.style.display = 'none';
        
        // Show regular tabs
        if (allCategory) allCategory.style.display = 'flex';
        if (favoritesCategory) favoritesCategory.style.display = 'flex';
        if (manageSharedBtn) manageSharedBtn.style.display = 'flex';
        
        // Show conditional tabs based on player's access
        if (gangCategory) {
            gangCategory.style.display = currentGarage.hasGang ? 'flex' : 'none';
        }
        
        if (jobCategory) {
            jobCategory.style.display = currentGarage.hasJobAccess || currentGarage.isJobGarage ? 'flex' : 'none';
        }
        
        if (sharedCategory) {
            sharedCategory.style.display = currentGarage.hasSharedAccess || currentGarage.isSharedGarage ? 'flex' : 'none';
        }
        
        // MODIFIED CODE: Only show job vehicles tab in job garages
        if (jobVehiclesCategory) {
            // Only show when in a job garage - no exceptions
            jobVehiclesCategory.style.display = currentGarage.isJobGarage ? 'flex' : 'none';
        }
        
        // Set default active category
        if (currentGarage.isSharedGarage) {
            currentSharedGarageId = currentGarage.id;
            setActiveCategory('shared');
        } else {
            setActiveCategory('all');
        }
    }
    
    selectedVehicle = null;
    updateVehicleDetailView();
    
    DOM.garageContainer.classList.remove('hidden');
    
    if (DOM.vehiclesGrid) DOM.vehiclesGrid.classList.remove('hidden');
    if (DOM.sharedGarageSelect) DOM.sharedGarageSelect.classList.add('hidden');
}

function refreshAllVehicleStates() {
    // For each vehicle in the list, check its current state
    for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i];
        
        fetch(`https://${GetParentResourceName()}/checkVehicleState`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                plate: vehicle.plate
            })
        })
        .then(resp => resp.json())
        .then(response => {
            if (response.state !== undefined) {
                // Update the state in our vehicles arrays
                vehicles[i].state = response.state;
                
                // Also update in original vehicles
                const origIndex = originalVehicles.findIndex(v => v.plate === vehicle.plate);
                if (origIndex !== -1) {
                    originalVehicles[origIndex].state = response.state;
                }
                
                // If this is currently in the filtered list, update there too
                const currIndex = currentVehicles.findIndex(v => v.plate === vehicle.plate);
                if (currIndex !== -1) {
                    currentVehicles[currIndex].state = response.state;
                }
            }
            
            // After the last vehicle is processed, re-render the vehicle list
            if (i === vehicles.length - 1) {
                renderVehicles();
            }
        });
    }
}


function closeGarage() {
    DOM.garageContainer.classList.add('hidden');
    selectedVehicle = null;
    
    // Reset all state variables
    currentSharedGarageId = null;
    currentCategory = 'all';
    
    // Clear selected classes
    DOM.navItems.forEach(item => {
        if (item.dataset.category === 'all') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    fetch(`https://${GetParentResourceName()}/closeGarage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
}

function setActiveCategory(category) {
    // If switching from shared to another category
    if (currentCategory === 'shared' && category !== 'shared') {
        currentSharedGarageId = null;
        
        // CRITICAL: Reset vehicles list to original when switching away from shared
        vehicles = [...originalVehicles];
    }
    
    currentCategory = category;
    
    // Update active class on nav items
    DOM.navItems.forEach(item => {
        if (item.dataset.category === category) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // If changing to shared category and we don't have a selected shared garage
    if (category === 'shared' && !currentSharedGarageId) {
        // But don't show selector if we're already in a shared garage view
        if (!currentGarage || !currentGarage.isSharedGarage) {
            // Handle case when specific shared garage not yet selected
            handleManageShared();
            return;
        }
    }
    
    filterVehiclesByCategory();
}

function setActiveSharedTab(tabName) {
    DOM.sharedTabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });
}

function filterVehiclesByCategory() {
    DOM.loadingOverlay.classList.remove('hidden');
    
    setTimeout(() => {
        let filteredVehicles = [];
        
        if (currentCategory === 'all') {
            // For ALL category - show all vehicles regardless of state
            filteredVehicles = vehicles.filter(v => 
                !v.isJobVehicle && 
                (!currentGarage.isSharedGarage || 
                 (currentGarage.isSharedGarage && v.owner === currentGarage.citizenid))
            );
        } else if (currentCategory === 'favorites') {
            // For FAVORITES - show all favorite vehicles
            filteredVehicles = vehicles.filter(v => v.isFavorite);
        } else if (currentCategory === 'gang') {
            filteredVehicles = vehicles.filter(v => v.storedInGang);
        } else if (currentCategory === 'job') {
            filteredVehicles = vehicles.filter(v => v.isJobVehicle === true);
        } else if (currentCategory === 'jobvehicles') {
            // Job vehicles handled separately
            fetch(`https://${GetParentResourceName()}/getJobVehicles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ job: currentGarage.jobName })
            })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.jobVehicles) {
                    filteredVehicles = resp.jobVehicles;
                    currentVehicles = filteredVehicles;
                    renderVehicles();
                    DOM.loadingOverlay.classList.add('hidden');
                }
            })
            .catch(error => {
                console.error("Error fetching job vehicles:", error);
                DOM.loadingOverlay.classList.add('hidden');
            });
            return; // Exit early since we're using async fetch
        } else if (currentCategory === 'shared') {
            if (currentSharedGarageId) {
                // Show all vehicles in the shared garage
                filteredVehicles = vehicles.filter(v => 
                    v.sharedGarageId === currentSharedGarageId
                );
            } else {
                filteredVehicles = vehicles.filter(v => v.storedInShared);
            }
        } else if (currentCategory === 'impound') {
            filteredVehicles = vehicles.filter(v => 
                v.state === 2 || v.impoundFee || v.impoundReason || v.impoundedBy
            );
        }
        
        // Apply search filter if any
        const searchTerm = DOM.searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredVehicles = filteredVehicles.filter(v => 
                (v.name && v.name.toLowerCase().includes(searchTerm)) || 
                (v.model && v.model.toLowerCase().includes(searchTerm)) ||
                (v.plate && v.plate.toLowerCase().includes(searchTerm))
            );
        }
        
        currentVehicles = filteredVehicles;
        renderVehicles();
        
        DOM.loadingOverlay.classList.add('hidden');
    }, 300);
}

function loadJobVehicles() {
    if (!currentGarage || !currentGarage.jobName) return;
    
    DOM.loadingOverlay.classList.remove('hidden');
    
    fetch(`https://${GetParentResourceName()}/getJobVehicles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ job: currentGarage.jobName })
    })
    .then(resp => resp.json())
    .then(resp => {
        if (resp.jobVehicles && resp.jobVehicles.length > 0) {
            currentVehicles = resp.jobVehicles;
            DOM.emptyState.classList.add('hidden');
        } else {
            currentVehicles = [];
            DOM.emptyState.classList.remove('hidden');
        }
        
        renderVehicles();
        DOM.loadingOverlay.classList.add('hidden');
    })
    .catch(error => {
        console.error("Error fetching job vehicles:", error);
        DOM.loadingOverlay.classList.add('hidden');
        DOM.emptyState.classList.remove('hidden');
    });
}

function createJobVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card job-vehicle';
    card.dataset.model = vehicle.model;
    
    card.addEventListener('click', () => {
        selectVehicle(vehicle);
    });
    
    const modelFormatted = vehicle.model ? vehicle.model.toLowerCase() : '';
    
    card.innerHTML = `
        <div class="vehicle-image">
            <img src="https://docs.fivem.net/vehicles/${modelFormatted}.webp" 
                 alt="${vehicle.name}" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x150/1e2137/a0aec0?text=${encodeURIComponent(vehicle.name || vehicle.model)}'" />
        </div>
        <div class="vehicle-info">
            <div class="vehicle-header">
                <div class="vehicle-title">
                    <div class="vehicle-name">${vehicle.name || vehicle.model}</div>
                    <div class="vehicle-icon">${vehicle.icon || "🚗"}</div>
                </div>
                <div class="vehicle-status-tags">
                    <div class="status-tag job">JOB</div>
                </div>
            </div>
            
            <div class="status-bars">
                <div class="status-item">
                    <div class="status-label">
                        <span>FUEL</span>
                        <span class="status-value">100%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill fuel" style="width: 100%"></div>
                    </div>
                </div>
                <div class="status-item">
                    <div class="status-label">
                        <span>ENGINE</span>
                        <span class="status-value">100%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill engine" style="width: 100%"></div>
                    </div>
                </div>
                <div class="status-item">
                    <div class="status-label">
                        <span>BODY</span>
                        <span class="status-value">100%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill body" style="width: 100%"></div>
                    </div>
                </div>
            </div>
            
            <div class="vehicle-actions">
                <button class="take-out-btn primary-action">TAKE OUT</button>
            </div>
        </div>
    `;
    
    const takeOutBtn = card.querySelector('.take-out-btn');
    if (takeOutBtn) {
        takeOutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            fetch(`https://${GetParentResourceName()}/takeOutJobVehicle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: vehicle.model
                })
            });
            
            closeGarage();
        });
    }
    
    return card;
}

function searchVehicles(searchTerm) {
    if (!searchTerm) {
        filterVehiclesByCategory();
        return;
    }
    
    // Use originalVehicles for 'all' category
    let baseVehicles = currentCategory === 'all' ? originalVehicles : vehicles;
    
    const filteredVehicles = baseVehicles.filter(v => 
        ((v.name && v.name.toLowerCase().includes(searchTerm)) || 
        (v.model && v.model.toLowerCase().includes(searchTerm)) ||
        (v.plate && v.plate.toLowerCase().includes(searchTerm))) &&
        categoryMatchesVehicle(v, currentCategory)
    );
    
    currentVehicles = filteredVehicles;
    renderVehicles();
}

function categoryMatchesVehicle(vehicle, category) {
    switch(category) {
        case 'all':
            return !vehicle.isJobVehicle && 
                (!currentGarage.isSharedGarage || 
                (currentGarage.isSharedGarage && vehicle.owner === currentGarage.citizenid));
        case 'favorites':
            return vehicle.isFavorite;
        case 'gang':
            return vehicle.storedInGang;
        case 'job':
            return vehicle.isJobVehicle === true;
        case 'shared':
            if (currentSharedGarageId) {
                return vehicle.sharedGarageId === currentSharedGarageId;
            } else if (currentGarage && currentGarage.isSharedGarage) {
                return true;
            } else {
                return vehicle.storedInShared;
            }
        default:
            return true;
    }
}

function renderVehicles() {    
    DOM.vehiclesGrid.innerHTML = '';
    
    if (currentVehicles.length === 0) {
        DOM.emptyState.classList.remove('hidden');
        return;
    }
    
    DOM.emptyState.classList.add('hidden');
    
    let visibleVehicles = 0;
    
    currentVehicles.forEach(vehicle => {
        let vehicleCard;
        
        if (currentCategory === 'impound') {
            vehicleCard = createImpoundVehicleCard(vehicle);
        } else if (currentCategory === 'jobvehicles') {
            vehicleCard = createJobVehicleCard(vehicle);
        } else {
            vehicleCard = createVehicleCard(vehicle);
        }
        
        // Only add the card if it was created (not null)
        if (vehicleCard) {
            DOM.vehiclesGrid.appendChild(vehicleCard);
            visibleVehicles++;
        }
    });
    
    // Show empty state if no visible vehicles
    if (visibleVehicles === 0) {
        DOM.emptyState.classList.remove('hidden');
    }
    
    // Fix transfer button listeners if needed
    fixTransferButtonListeners();
}

function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.dataset.plate = vehicle.plate;
    card.dataset.model = vehicle.model;
    card.dataset.state = vehicle.state;
    
    // Add a vehicle-out class if vehicle is out
    if (vehicle.state === 0) {
        card.classList.add('vehicle-out');
    }
    
    card.addEventListener('click', () => {
        selectVehicle(vehicle);
    });
    
    const isOutStatus = vehicle.state === 0;
    const isImpounded = vehicle.state === 2;
    const isShared = vehicle.storedInShared;
    const isFavorite = vehicle.isFavorite;
    const isInSharedCategory = currentCategory === 'shared';
    const isInCurrentGarage = vehicle.inCurrentGarage;
    
    const modelFormatted = vehicle.model ? vehicle.model.toLowerCase() : '';
    
    const fuelValue = Math.round(vehicle.fuel || 0);
    const engineValue = Math.round(vehicle.engine || 0);
    const bodyValue = Math.round(vehicle.body || 0);
    
    let statusTags = `<div class="vehicle-status-tags">`;
    if (isOutStatus) {
        statusTags += `<div class="status-tag out">OUT</div>`;
    }
    if (isImpounded) {
        statusTags += `<div class="status-tag impounded">IMPOUNDED</div>`;
    }
    if (isShared) {
        statusTags += `<div class="status-tag shared">SHARED</div>`;
    }
    if (!isOutStatus && !isImpounded && !isInCurrentGarage) {
        statusTags += `<div class="status-tag transfer">AT ${vehicle.garage.toUpperCase()}</div>`;
    }
    statusTags += `</div>`;
    
    // Always show the favorite toggle if not a job vehicle, regardless of category
    let favoriteToggle = '';
    if (!vehicle.isJobVehicle) {
        favoriteToggle = `
            <div class="favorite-toggle ${isFavorite ? 'active' : ''}" data-plate="${vehicle.plate}">
                ★
            </div>
        `;
    }
    
    // Only show remove button in shared category with specific shared garage
    let removeButton = '';
    if (isInSharedCategory && currentSharedGarageId) {
        removeButton = `
            <div class="remove-vehicle-btn" data-plate="${vehicle.plate}" title="Remove from shared">
                ✕
            </div>
        `;
    }
    
    card.innerHTML = `
        ${favoriteToggle}
        ${removeButton}
        <div class="vehicle-image">
            <img src="https://docs.fivem.net/vehicles/${modelFormatted}.webp" 
                 alt="${vehicle.name}" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x150/1e2137/a0aec0?text=${encodeURIComponent(vehicle.name || vehicle.model)}'" />
        </div>
        <div class="vehicle-info">
            <div class="vehicle-header">
                <div class="vehicle-title">
                    <div class="vehicle-name">${vehicle.name || vehicle.model}</div>
                    <div class="vehicle-plate">${vehicle.plate}</div>
                </div>
                ${statusTags}
            </div>
            
            <div class="status-bars">
                <div class="status-item">
                    <div class="status-label">
                        <span>FUEL</span>
                        <span class="status-value">${fuelValue}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill fuel" style="width: ${fuelValue}%"></div>
                    </div>
                </div>
                <div class="status-item">
                    <div class="status-label">
                        <span>ENGINE</span>
                        <span class="status-value">${engineValue}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill engine" style="width: ${engineValue}%"></div>
                    </div>
                </div>
                <div class="status-item">
                    <div class="status-label">
                        <span>BODY</span>
                        <span class="status-value">${bodyValue}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill body" style="width: ${bodyValue}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="vehicle-actions">
                ${isOutStatus ? 
                    `<button class="take-out-btn out" disabled>VEHICLE IS OUT</button>` :
                    (isImpounded ? 
                        `<button class="take-out-btn impounded" disabled>IMPOUNDED</button>` :
                        (!isInCurrentGarage ? 
                            `<button class="transfer-btn">TRANSFER</button>` : 
                            `<button class="take-out-btn">TAKE OUT</button>`
                        )
                    )
                }
            </div>
        </div>
    `;
    
    const favoriteBtn = card.querySelector('.favorite-toggle');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const plate = favoriteBtn.dataset.plate;
            const isCurrentlyFavorite = favoriteBtn.classList.contains('active');
            
            favoriteBtn.classList.toggle('active');
            
            fetch(`https://${GetParentResourceName()}/toggleFavorite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    plate: plate,
                    isFavorite: !isCurrentlyFavorite
                })
            })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.status === 'success') {
                    // Update in vehicles array
                    const vehicleIndex = vehicles.findIndex(v => v.plate === plate);
                    if (vehicleIndex !== -1) {
                        vehicles[vehicleIndex].isFavorite = !isCurrentlyFavorite;
                    }
                    
                    // Also update in originalVehicles
                    const originalIndex = originalVehicles.findIndex(v => v.plate === plate);
                    if (originalIndex !== -1) {
                        originalVehicles[originalIndex].isFavorite = !isCurrentlyFavorite;
                    }
                    
                    if (currentCategory === 'favorites') {
                        filterVehiclesByCategory();
                    }
                }
            })
            .catch(error => {
                console.error("Error toggling favorite:", error);
            });
        });
    }
    
    const removeBtn = card.querySelector('.remove-vehicle-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const plate = removeBtn.dataset.plate;
            
            fetch(`https://${GetParentResourceName()}/confirmRemoveVehicle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ plate: plate })
            })
            .then(resp => resp.json())
            .then(resp => {
                if (resp.status === 'success' && resp.confirmed) {
                    removeFromSharedGarage(plate);
                }
            });
        });
    }
    const takeOutBtn = card.querySelector('.take-out-btn');
    if (takeOutBtn && !takeOutBtn.disabled) {
        takeOutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (vehicle.state === 0 || vehicle.state === 2) return;
            
            fetch(`https://${GetParentResourceName()}/takeOutVehicle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicle)
            });
            
            closeGarage();
        });
    }
    
    const transferBtn = card.querySelector('.transfer-btn');
    if (transferBtn) {
        transferBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Select the vehicle first to make sure details are loaded
            selectVehicle(vehicle);
            
            // Open the transfer modal
            openTransferModal();
        });
    }
    
    return card;
}

function refreshVehicleStates() {
    DOM.loadingOverlay.classList.remove('hidden');
    
    // Create an array of promises for all vehicle state checks
    const statePromises = vehicles.map(vehicle => 
        fetch(`https://${GetParentResourceName()}/checkVehicleState`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plate: vehicle.plate })
        })
        .then(resp => resp.json())
        .then(response => {
            if (response.state !== undefined) {
                // Return the updated vehicle with correct state
                return {
                    plate: vehicle.plate,
                    state: response.state
                };
            }
            return null;
        })
    );
    
    // Wait for all promises to resolve
    Promise.all(statePromises)
        .then(results => {
            // Update vehicle states in our arrays
            results.forEach(result => {
                if (result) {
                    // Find and update the vehicle in all relevant arrays
                    const vehicleIndex = vehicles.findIndex(v => v.plate === result.plate);
                    if (vehicleIndex !== -1) {
                        vehicles[vehicleIndex].state = result.state;
                    }
                    
                    const origIndex = originalVehicles.findIndex(v => v.plate === result.plate);
                    if (origIndex !== -1) {
                        originalVehicles[origIndex].state = result.state;
                    }
                    
                    const currIndex = currentVehicles.findIndex(v => v.plate === result.plate);
                    if (currIndex !== -1) {
                        currentVehicles[currIndex].state = result.state;
                    }
                }
            });
            
            // Re-render with updated states
            renderVehicles();
            DOM.loadingOverlay.classList.add('hidden');
        })
        .catch(error => {
            console.error("Error refreshing vehicle states:", error);
            DOM.loadingOverlay.classList.add('hidden');
        });
}

function selectVehicle(vehicle) {
    selectedVehicle = vehicle;
    updateVehicleDetailView();
    
    document.querySelectorAll('.vehicle-card').forEach(card => {
        if (card.dataset.plate === vehicle.plate) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

function updateVehicleDetailView() {
    if (!selectedVehicle) {
        if (DOM.vehicleDetails) DOM.vehicleDetails.classList.add('hidden');
        if (DOM.noSelection) DOM.noSelection.classList.remove('hidden');
        return;
    }
    
    if (DOM.vehicleDetails) DOM.vehicleDetails.classList.remove('hidden');
    if (DOM.noSelection) DOM.noSelection.classList.add('hidden');
    
    if (DOM.infoVehicleName) DOM.infoVehicleName.textContent = selectedVehicle.name || selectedVehicle.model;
    if (DOM.infoPlate) DOM.infoPlate.textContent = selectedVehicle.plate || '';
    if (DOM.infoModel) DOM.infoModel.textContent = selectedVehicle.model;
    if (DOM.infoOwner) DOM.infoOwner.textContent = selectedVehicle.ownerName || 'You';
    if (DOM.infoGarage) DOM.infoGarage.textContent = selectedVehicle.garage || currentGarage.name;
    
    const fuelValue = Math.round(selectedVehicle.fuel || 0);
    const engineValue = Math.round(selectedVehicle.engine || 0);
    const bodyValue = Math.round(selectedVehicle.body || 0);
    
    if (DOM.fuelBar) DOM.fuelBar.style.width = `${fuelValue}%`;
    if (DOM.engineBar) DOM.engineBar.style.width = `${engineValue}%`;
    if (DOM.bodyBar) DOM.bodyBar.style.width = `${bodyValue}%`;
    
    if (DOM.fuelPercentage) DOM.fuelPercentage.textContent = `${fuelValue}%`;
    if (DOM.enginePercentage) DOM.enginePercentage.textContent = `${engineValue}%`;
    if (DOM.bodyPercentage) DOM.bodyPercentage.textContent = `${bodyValue}%`;
    
    if (DOM.takeOutBtn) {
        if (selectedVehicle.isJobVehicle) {
            DOM.takeOutBtn.disabled = false;
            DOM.takeOutBtn.textContent = 'TAKE OUT';
            DOM.takeOutBtn.classList.remove('disabled');
            
            // Remove existing event listeners
            const newBtn = DOM.takeOutBtn.cloneNode(true);
            DOM.takeOutBtn.parentNode.replaceChild(newBtn, DOM.takeOutBtn);
            DOM.takeOutBtn = newBtn;
            
            // Add job vehicle specific event listener
            DOM.takeOutBtn.addEventListener('click', takeOutJobVehicle);
        } else {
            if (selectedVehicle.state === 0) {
                DOM.takeOutBtn.disabled = true;
                DOM.takeOutBtn.textContent = 'ALREADY OUT';
                DOM.takeOutBtn.classList.add('disabled');
            } else if (!selectedVehicle.inCurrentGarage) {
                DOM.takeOutBtn.disabled = true;
                DOM.takeOutBtn.textContent = `AT ${selectedVehicle.garage.toUpperCase()}`;
                DOM.takeOutBtn.classList.add('disabled');
            } else {
                DOM.takeOutBtn.disabled = false;
                DOM.takeOutBtn.textContent = 'TAKE OUT';
                DOM.takeOutBtn.classList.remove('disabled');
                
                // Remove existing event listeners
                const newBtn = DOM.takeOutBtn.cloneNode(true);
                DOM.takeOutBtn.parentNode.replaceChild(newBtn, DOM.takeOutBtn);
                DOM.takeOutBtn = newBtn;
                
                // Add regular vehicle event listener
                DOM.takeOutBtn.addEventListener('click', takeOutVehicle);
            }
        }
    }
    
    // Handle action buttons visibility
    if (DOM.favoriteBtn && DOM.renameBtn && DOM.shareBtn) {
        if (selectedVehicle.isJobVehicle) {
            DOM.favoriteBtn.style.display = 'none';
            DOM.renameBtn.style.display = 'none';
            DOM.shareBtn.style.display = 'none';
        } else {
            DOM.favoriteBtn.style.display = 'flex';
            DOM.renameBtn.style.display = 'flex';
            
            // COMPLETELY REMOVE ALL EVENT LISTENERS FROM THE SHARE BUTTON
            if (DOM.shareBtn) {
                const newShareBtn = DOM.shareBtn.cloneNode(true);
                if (DOM.shareBtn.parentNode) {
                    DOM.shareBtn.parentNode.replaceChild(newShareBtn, DOM.shareBtn);
                }
                DOM.shareBtn = newShareBtn;
            }
            
            // Change behavior based on whether we're in a shared garage or not
            if (currentCategory === 'shared' && currentSharedGarageId) {
                // In a shared garage view - change Share button to Remove
                if (DOM.shareBtn) {
                    // Change text, icon and function of the share button
                    const shareIcon = DOM.shareBtn.querySelector('.action-icon');
                    const shareText = DOM.shareBtn.querySelector('.action-text');
                    
                    if (shareIcon) {
                        shareIcon.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" 
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        `;
                    }
                    
                    if (shareText) {
                        shareText.textContent = 'Remove';
                    }
                    
                    // Use a totally separate function for the remove button
                    DOM.shareBtn.addEventListener('click', function(e) {
                        // Prevent event bubbling completely
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const plate = selectedVehicle.plate;
                        
                        // Set our flag to block any share operations
                        isRemovingFromSharedGarage = true;
                        
                        // Direct removal without using shared functions
                        fetch(`https://${GetParentResourceName()}/removeFromShared`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ plate: plate })
                        })
                        .then(resp => resp.json())
                        .then(resp => {
                            if (resp.status === 'success') {
                                // Update the UI immediately
                                if (selectedVehicle && selectedVehicle.plate === plate) {
                                    selectedVehicle.storedInShared = false;
                                    selectedVehicle.sharedGarageId = null;
                                }
                                
                                // Update in both arrays
                                const vehicleIndex = vehicles.findIndex(v => v.plate === plate);
                                if (vehicleIndex !== -1) {
                                    vehicles[vehicleIndex].storedInShared = false;
                                    vehicles[vehicleIndex].sharedGarageId = null;
                                }
                                
                                const originalIndex = originalVehicles.findIndex(v => v.plate === plate);
                                if (originalIndex !== -1) {
                                    originalVehicles[originalIndex].storedInShared = false;
                                    originalVehicles[originalIndex].sharedGarageId = null;
                                }
                                
                                // If we're in the shared category, refresh the view
                                if (currentCategory === 'shared') {
                                    filterVehiclesByCategory();
                                }
                                
                                // Update vehicle detail view if needed
                                updateVehicleDetailView();
                                
                                // Give time for everything to process before clearing the flag
                                setTimeout(function() {
                                    isRemovingFromSharedGarage = false;
                                }, 1000);
                            } else {
                                isRemovingFromSharedGarage = false;
                            }
                        })
                        .catch(error => {
                            console.error("Error removing from shared garage:", error);
                            isRemovingFromSharedGarage = false;
                        });
                        
                        return false;
                    });
                    
                    DOM.shareBtn.style.display = 'flex';
                }
            } else {
                // Not in a shared garage - show normal Share button
                if (DOM.shareBtn) {
                    // Restore original share button look and function
                    const shareIcon = DOM.shareBtn.querySelector('.action-icon');
                    const shareText = DOM.shareBtn.querySelector('.action-text');
                    
                    if (shareIcon) {
                        shareIcon.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16 6L12 2L8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M12 2V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        `;
                    }
                    
                    if (shareText) {
                        shareText.textContent = 'Share';
                    }
                    
                    // Set the correct function for sharing
                    DOM.shareBtn.addEventListener('click', function(e) {
                        // Don't share if we're in the middle of a removal
                        if (isRemovingFromSharedGarage) {
                            console.log("Blocking share due to active removal");
                            return false;
                        }
                        
                        shareVehicle();
                    });
                    
                    if (currentGarage.hasSharedAccess) {
                        DOM.shareBtn.style.display = 'flex';
                    } else {
                        DOM.shareBtn.style.display = 'none';
                    }
                }
            }
        }
    }
    
    // Remove any existing remove-shared button since we're now handling it with the Share button
    const secondaryActions = document.querySelector('.secondary-actions');
    if (secondaryActions) {
        const existingBtn = document.getElementById('remove-shared-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
    }
}

function takeOutJobVehicle() {
    if (!selectedVehicle || !selectedVehicle.isJobVehicle) return;
    
    fetch(`https://${GetParentResourceName()}/takeOutJobVehicle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: selectedVehicle.model
        })
    });
    
    closeGarage();
}

function removeFromSharedGarageDirectly(plate) {
    fetch(`https://${GetParentResourceName()}/removeFromShared`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plate: plate })
    })
    .then(resp => resp.json())
    .then(resp => {
        if (resp.status === 'success') {
            // Update the UI immediately
            if (selectedVehicle && selectedVehicle.plate === plate) {
                selectedVehicle.storedInShared = false;
                selectedVehicle.sharedGarageId = null;
            }
            
            // Update in both arrays
            const vehicleIndex = vehicles.findIndex(v => v.plate === plate);
            if (vehicleIndex !== -1) {
                vehicles[vehicleIndex].storedInShared = false;
                vehicles[vehicleIndex].sharedGarageId = null;
            }
            
            const originalIndex = originalVehicles.findIndex(v => v.plate === plate);
            if (originalIndex !== -1) {
                originalVehicles[originalIndex].storedInShared = false;
                originalVehicles[originalIndex].sharedGarageId = null;
            }
            
            // If we're in the shared category, refresh the view
            if (currentCategory === 'shared') {
                filterVehiclesByCategory();
            }
            
            // Update vehicle detail view if needed
            updateVehicleDetailView();
        }
    })
    .catch(error => {
        console.error("Error removing from shared garage:", error);
    });
}


function removeFromSharedGarage(plate) {
    fetch(`https://${GetParentResourceName()}/removeFromShared`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plate: plate })
    })
    .then(resp => resp.json())
    .then(resp => {
        if (resp.status === 'success') {
            // Update the UI immediately
            if (selectedVehicle && selectedVehicle.plate === plate) {
                selectedVehicle.storedInShared = false;
                selectedVehicle.sharedGarageId = null;
            }
            
            // Update in both arrays
            const vehicleIndex = vehicles.findIndex(v => v.plate === plate);
            if (vehicleIndex !== -1) {
                vehicles[vehicleIndex].storedInShared = false;
                vehicles[vehicleIndex].sharedGarageId = null;
            }
            
            const originalIndex = originalVehicles.findIndex(v => v.plate === plate);
            if (originalIndex !== -1) {
                originalVehicles[originalIndex].storedInShared = false;
                originalVehicles[originalIndex].sharedGarageId = null;
            }
            
            // If we're in the shared category, refresh the view
            if (currentCategory === 'shared') {
                filterVehiclesByCategory();
            }
            
            // Update vehicle detail view if needed
            updateVehicleDetailView();
            
            // Show success notification
            QBCore.Functions.Notify("Vehicle removed from shared garage", "success");
        } else {
            // Show error notification
            QBCore.Functions.Notify("Failed to remove vehicle from shared garage", "error");
        }
    })
    .catch(error => {
        console.error("Error removing from shared garage:", error);
        QBCore.Functions.Notify("Error removing vehicle from shared garage", "error");
    });
}

function takeOutVehicle() {
    if (!selectedVehicle || selectedVehicle.state === 0) return;
    
    // Mark this vehicle as taken out so it can't be taken out again
    vehiclesAlreadyOut[selectedVehicle.plate] = true;
    
    // Remove this vehicle from all arrays immediately
    vehicles = vehicles.filter(v => v.plate !== selectedVehicle.plate);
    originalVehicles = originalVehicles.filter(v => v.plate !== selectedVehicle.plate);
    currentVehicles = currentVehicles.filter(v => v.plate !== selectedVehicle.plate);
    
    // Refresh the UI to remove this vehicle from view
    renderVehicles();
    
    // Then proceed with the server-side takeout
    fetch(`https://${GetParentResourceName()}/takeOutVehicle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedVehicle)
    });
    
    closeGarage();
}

function toggleFavorite() {
    if (!selectedVehicle || selectedVehicle.isJobVehicle) return;
    
    const isCurrentlyFavorite = selectedVehicle.isFavorite;
    
    const favoriteIcon = DOM.favoriteBtn.querySelector('.favorite-icon');
    if (favoriteIcon) {
        favoriteIcon.classList.toggle('active');
    }
    
    fetch(`https://${GetParentResourceName()}/toggleFavorite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            plate: selectedVehicle.plate,
            isFavorite: !isCurrentlyFavorite
        })
    })
    .then(resp => resp.json())
    .then(resp => {
        if (resp.status === 'success') {
            selectedVehicle.isFavorite = !isCurrentlyFavorite;
            
            // Update in both arrays
            const vehicleIndex = vehicles.findIndex(v => v.plate === selectedVehicle.plate);
            if (vehicleIndex !== -1) {
                vehicles[vehicleIndex].isFavorite = !isCurrentlyFavorite;
            }
            
            const originalIndex = originalVehicles.findIndex(v => v.plate === selectedVehicle.plate);
            if (originalIndex !== -1) {
                originalVehicles[originalIndex].isFavorite = !isCurrentlyFavorite;
            }
            
            if (currentCategory === 'favorites') {
                filterVehiclesByCategory();
            } else {
                const card = document.querySelector(`.vehicle-card[data-plate="${selectedVehicle.plate}"]`);
                if (card) {
                    const favoriteIcon = card.querySelector('.favorite-toggle');
                    if (favoriteIcon) {
                        if (!isCurrentlyFavorite) {
                            favoriteIcon.classList.add('active');
                        } else {
                            favoriteIcon.classList.remove('active');
                        }
                    }
                }
            }
        }
    })
    .catch(error => {
        console.error("Error toggling favorite:", error);
    });
}

function saveVehicleName() {
    if (!selectedVehicle) return;
    
    const newName = DOM.vehicleNameInput.value.trim();
    
    if (newName) {
        selectedVehicle.name = newName;
        if (DOM.infoVehicleName) DOM.infoVehicleName.textContent = newName;
        
        const card = document.querySelector(`.vehicle-card[data-plate="${selectedVehicle.plate}"]`);
        if (card) {
            const nameElement = card.querySelector('.vehicle-name');
            if (nameElement) {
                nameElement.textContent = newName;
            }
        }
        
        fetch(`https://${GetParentResourceName()}/updateVehicleName`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                plate: selectedVehicle.plate,
                name: newName
            })
        })
        .then(resp => resp.json())
        .then(resp => {
            if (resp.status === 'success') {
                // Update in both arrays
                const vehicleIndex = vehicles.findIndex(v => v.plate === selectedVehicle.plate);
                if (vehicleIndex !== -1) {
                    vehicles[vehicleIndex].name = newName;
                }
                
                const originalIndex = originalVehicles.findIndex(v => v.plate === selectedVehicle.plate);
                if (originalIndex !== -1) {
                    originalVehicles[originalIndex].name = newName;
                }
            }
        })
        .catch(error => {
            console.error("Error updating vehicle name:", error);
        });
    }
    
    DOM.renameModal.classList.add('hidden');
}

function shareVehicle() {
    // If we're in the middle of a removal operation, don't do anything
    if (isRemovingFromSharedGarage) {
        console.log("Blocking share vehicle during removal operation");
        return;
    }

    if (!selectedVehicle || selectedVehicle.isJobVehicle) return;
    
    fetch(`https://${GetParentResourceName()}/storeInShared`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            plate: selectedVehicle.plate
        })
    })
    .catch(error => {
        console.error("Error sharing vehicle:", error);
    });
}


function openSharedGarageManager(data) {
    sharedGarages = data.garages || [];
    
    renderSharedGarages();
    
    if (DOM.sharedGarageModal) {
        DOM.sharedGarageModal.classList.remove('hidden');
    }
    
    setActiveSharedTab('my-garages');
}

function showSharedGarageModal() {
    if (DOM.sharedGarageModal) {
        DOM.sharedGarageModal.classList.remove('hidden');
    }
    
    setActiveSharedTab('my-garages');
    
    if (DOM.sharedGaragesList && DOM.noSharedGarages) {
        DOM.sharedGaragesList.innerHTML = '';
        DOM.sharedGaragesList.classList.add('hidden');
        DOM.noSharedGarages.classList.remove('hidden');
    }
}

function renderSharedGarages() {
    if (!DOM.sharedGaragesList || !DOM.noSharedGarages) {
        return;
    }
    
    DOM.sharedGaragesList.innerHTML = '';
    
    if (!sharedGarages || sharedGarages.length === 0) {
        DOM.sharedGaragesList.classList.add('hidden');
        DOM.noSharedGarages.classList.remove('hidden');
        return;
    }
    
    DOM.sharedGaragesList.classList.remove('hidden');
    DOM.noSharedGarages.classList.add('hidden');
    
    sharedGarages.forEach(garage => {
        const garageItem = document.createElement('div');
        garageItem.className = 'garage-item';
        
        garageItem.innerHTML = `
            <div class="garage-info">
                <div class="garage-name">
                    ${garage.name}
                    ${garage.isOwner ? '<span class="owner-badge">OWNER</span>' : ''}
                </div>
                ${garage.isOwner ? `<div class="garage-code">ACCESS CODE: ${garage.accessCode}</div>` : ''}
            </div>
            <div class="garage-actions">
                <button class="garage-btn primary open-garage-btn" data-id="${garage.id}">OPEN</button>
                ${garage.isOwner ? `
                    <button class="garage-btn secondary manage-members-btn" data-id="${garage.id}">MEMBERS</button>
                    <button class="garage-btn danger delete-garage-btn" data-id="${garage.id}">DELETE</button>
                ` : ''}
            </div>
        `;
        
        DOM.sharedGaragesList.appendChild(garageItem);
    });
    
    addSharedGarageListeners();
}

function addSharedGarageListeners() {
    document.querySelectorAll('.open-garage-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const garageId = parseInt(this.dataset.id);
            
            if (DOM.sharedGarageModal) {
                DOM.sharedGarageModal.classList.add('hidden');
            }
            
            currentSharedGarageId = garageId;
            
            let garageName = "Shared Garage";
            if (sharedGarages) {
                const garage = sharedGarages.find(g => g.id === garageId);
                if (garage) {
                    garageName = garage.name;
                }
            }
            
            if (DOM.currentGarageName) {
                DOM.currentGarageName.textContent = garageName;
            }
            
            setActiveCategory('shared');
            
            if (DOM.vehiclesGrid) {
                DOM.vehiclesGrid.classList.remove('hidden');
            }
            
            if (DOM.sharedGarageSelect) {
                DOM.sharedGarageSelect.classList.add('hidden');
            }
            
            if (DOM.loadingOverlay) {
                DOM.loadingOverlay.classList.remove('hidden');
            }
            
            fetch(`https://${GetParentResourceName()}/refreshVehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    garageId: garageId,
                    garageType: "shared"
                })
            })
            .catch(error => {
                setTimeout(() => {
                    if (DOM.loadingOverlay) {
                        DOM.loadingOverlay.classList.add('hidden');
                    }
                }, 1000);
            });
        });
    });
    
    document.querySelectorAll('.manage-members-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const garageId = parseInt(this.dataset.id);
            
            fetch(`https://${GetParentResourceName()}/manageSharedGarageMembers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ garageId: garageId })
            });
        });
    });
    
    document.querySelectorAll('.delete-garage-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const garageId = parseInt(this.dataset.id);
            
            fetch(`https://${GetParentResourceName()}/confirmDeleteGarage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ garageId: garageId })
            });
        });
    });
}

function addTransferButton() {
    // Check if the secondary actions container exists
    const secondaryActions = document.querySelector('.secondary-actions');
    if (!secondaryActions) return;
    
    // Check if transfer button already exists
    if (document.getElementById('transfer-btn')) return;
    
    // Create the transfer button
    const transferBtn = document.createElement('button');
    transferBtn.id = 'transfer-btn';
    transferBtn.className = 'action-btn secondary-action';
    transferBtn.innerHTML = `
        <span class="action-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V18M16 3H12C10.8954 3 10 3.89543 10 5V13C10 14.1046 10.8954 15 12 15H20C21.1046 15 22 14.1046 22 13V7C22 5.89543 21.1046 5 20 5H18.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 11L12 8M12 8L9 11M12 8V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>
        <span class="action-text">Transfer</span>
    `;
    
    // Add click event listener
    transferBtn.addEventListener('click', openTransferModal);
    
    // Add the button to the secondary actions
    secondaryActions.appendChild(transferBtn);
}

function createTransferModal() {
    // Check if modal already exists
    if (document.getElementById('transfer-modal')) return;
    
    const modalHTML = `
        <div id="transfer-modal" class="garage-modal hidden">
            <div class="modal-backdrop"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h2>Transfer Vehicle</h2>
                    <button class="close-modal">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="modal-description">Transfer your vehicle to another garage for a fee of $<span id="transfer-cost">500</span>:</p>
                    <div class="input-group">
                        <label for="transfer-garage-select">Select Destination Garage</label>
                        <select id="transfer-garage-select" class="garage-input">
                            <option value="">-- Select Garage --</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="cancel-transfer" class="garage-btn secondary">Cancel</button>
                    <button id="confirm-transfer" class="garage-btn primary">Transfer for $<span id="transfer-btn-cost">500</span></button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to the DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    document.querySelector('#transfer-modal .close-modal').addEventListener('click', closeTransferModal);
    document.getElementById('cancel-transfer').addEventListener('click', closeTransferModal);
    document.getElementById('confirm-transfer').addEventListener('click', confirmTransfer);
}

// Open transfer modal
function openTransferModal() {
    if (!selectedVehicle) return;
    
    // Create modal if it doesn't exist
    createTransferModal();
    
    // Set the transfer cost
    const transferCost = window.transferCost || 500;
    document.getElementById('transfer-cost').textContent = transferCost;
    document.getElementById('transfer-btn-cost').textContent = transferCost;
    
    // Populate garage select
    populateGarageSelect();
    
    // Show the modal
    document.getElementById('transfer-modal').classList.remove('hidden');
}

// Close transfer modal
function closeTransferModal() {
    const modal = document.getElementById('transfer-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function populateGarageSelect() {
    const select = document.getElementById('transfer-garage-select');
    if (!select) return;
    
    // Clear existing options except the first one
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Skip if we don't have garage data
    if (!window.allGarages || !Array.isArray(window.allGarages)) return;
    
    // Add options for each garage - include ALL garages
    window.allGarages.forEach(garage => {
        const option = document.createElement('option');
        option.value = garage.id;
        
        // Mark the current garage in the list
        const currentGarageId = currentGarage.id;
        if (garage.id === currentGarageId) {
            option.textContent = `${garage.name} (${garage.type}) - CURRENT`;
            // Optionally disable selecting the current garage
            // option.disabled = true;
        } else {
            option.textContent = `${garage.name} (${garage.type})`;
        }
        
        select.appendChild(option);
    });
}


// Confirm transfer action
function confirmTransfer() {
    console.log("Confirm transfer function called");
    const select = document.getElementById('transfer-garage-select');
    
    if (!select || !select.value) {
        // Show error notification
        if (typeof QBCore !== 'undefined' && QBCore.Functions && QBCore.Functions.Notify) {
            QBCore.Functions.Notify('Please select a destination garage', 'error');
        } else {
            alert('Please select a destination garage');
        }
        return;
    }
    
    if (!selectedVehicle) {
        if (typeof QBCore !== 'undefined' && QBCore.Functions && QBCore.Functions.Notify) {
            QBCore.Functions.Notify('No vehicle selected', 'error');
        } else {
            alert('No vehicle selected');
        }
        return;
    }
    
    const newGarageId = select.value;
    const cost = window.transferCost || 500;
    
    console.log(`Transferring ${selectedVehicle.plate} to ${newGarageId} for $${cost}`);
    
    // Use fetch API instead of jQuery
    fetch(`https://${GetParentResourceName()}/directTransferVehicle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            plate: selectedVehicle.plate,
            newGarageId: newGarageId,
            cost: cost
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Transfer response:", data);
        // Close UI only after receiving a response
        closeTransferModal();
        closeGarage();
    })
    .catch(error => {
        console.error("Error transferring vehicle:", error);
        // Still close UI even on error
        closeTransferModal();
        closeGarage();
    });
}

// Modify the existing updateVehicleDetailView function to add the transfer button
const originalUpdateVehicleDetailView = updateVehicleDetailView;
updateVehicleDetailView = function() {
    // Call the original function first
    originalUpdateVehicleDetailView.apply(this, arguments);
    
    // Then add our transfer button if needed
    if (selectedVehicle && !selectedVehicle.isJobVehicle && selectedVehicle.state === 1) {
        addTransferButton();
    }
};

// Modify the openGarage function to store garage data
const originalOpenGarage = openGarage;
openGarage = function(data) {
    // Store transfer cost and all garages in window for use later
    if (data.transferCost) {
        window.transferCost = data.transferCost;
    }
    
    if (data.allGarages) {
        window.allGarages = data.allGarages;
    }
    
    // Call the original function
    originalOpenGarage.apply(this, arguments);
};

// Check if the transfer button has the correct event listener
function fixTransferButtonListeners() {
    // For the main transfer button in vehicle cards
    document.querySelectorAll('.transfer-btn').forEach(btn => {
        // Remove all existing event listeners by cloning the element
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add a fresh event listener
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log("Transfer button clicked");
            
            // Get the vehicle data from the closest card
            const card = newBtn.closest('.vehicle-card');
            if (!card) return;
            
            const plate = card.dataset.plate;
            const model = card.dataset.model;
            
            // Find the vehicle in our data
            const vehicle = vehicles.find(v => v.plate === plate);
            if (!vehicle) return;
            
            // Select the vehicle first to make sure details are loaded
            selectVehicle(vehicle);
            
            // Open the transfer modal
            openTransferModal();
        });
    });
    
    // For the confirm transfer button in the modal
    const confirmBtn = document.getElementById('confirm-transfer');
    if (confirmBtn) {
        // Replace with a fresh button to clear any existing listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        newConfirmBtn.addEventListener('click', function() {
            console.log("Confirm transfer clicked");
            confirmTransfer();
        });
    }
}

function openSharedGarageSelection(data) {
    // If we're in the middle of removing, don't open the selector
    if (isRemovingFromSharedGarage) {
        console.log("Blocking shared garage selection during removal");
        return;
    }
    
    const garages = data.garages || [];
    const plate = data.plate;
    
    if (!plate || garages.length === 0 || !DOM.garageOptions || !DOM.garageSelectionModal) {
        return;
    }
    
    DOM.garageOptions.innerHTML = '';
    
    garages.forEach(garage => {
        const option = document.createElement('div');
        option.className = `garage-option ${garage.owner ? 'owned' : ''}`;
        option.innerHTML = `<div>${garage.name}</div>`;
        
        option.addEventListener('click', () => {
            storeVehicleInSharedGarage(plate, garage.id);
            DOM.garageSelectionModal.classList.add('hidden');
        });
        
        DOM.garageOptions.appendChild(option);
    });
    
    DOM.garageSelectionModal.classList.remove('hidden');
}

function storeVehicleInSharedGarage(plate, garageId) {
    fetch(`https://${GetParentResourceName()}/storeInSelectedSharedGarage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            plate: plate,
            garageId: garageId
        })
    })
    .then(response => response.json())
    .then(response => {
        if (response.status === 'success') {
            requestVehicleRefresh();
        }
    });
}

function openSharedGarageMembersManager(data) {
    const members = data.members || [];
    const garageId = data.garageId;
    
    if (!DOM.membersList || !DOM.noMembers || !DOM.membersModal) {
        return;
    }
    
    DOM.membersList.innerHTML = '';
    
    if (members.length === 0) {
        DOM.membersList.classList.add('hidden');
        DOM.noMembers.classList.remove('hidden');
    } else {
        DOM.membersList.classList.remove('hidden');
        DOM.noMembers.classList.add('hidden');
        
        members.forEach(member => {
            const memberItem = document.createElement('div');
            memberItem.className = 'member-item';
            
            memberItem.innerHTML = `
                <div class="member-name">${member.name}</div>
                <button class="garage-btn danger remove-member-btn" data-id="${member.id}" data-garage="${garageId}">REMOVE</button>
            `;
            
            DOM.membersList.appendChild(memberItem);
        });
        
        document.querySelectorAll('.remove-member-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const memberId = parseInt(this.dataset.id);
                const garageId = parseInt(this.dataset.garage);
                
                fetch(`https://${GetParentResourceName()}/removeSharedGarageMember`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        memberId: memberId,
                        garageId: garageId
                    })
                })
                .then(resp => resp.json())
                .then(resp => {
                    if (resp.status === 'success') {
                        this.closest('.member-item').remove();
                        
                        if (DOM.membersList.children.length === 0) {
                            DOM.membersList.classList.add('hidden');
                            DOM.noMembers.classList.remove('hidden');
                        }
                    }
                });
            });
        });
    }
    
    DOM.membersModal.classList.remove('hidden');
}

function createSharedGarage() {
    if (!DOM.newGarageName) {
        return;
    }
    
    const garageName = DOM.newGarageName.value.trim();
    
    if (!garageName) {
        DOM.newGarageName.classList.add('error');
        setTimeout(() => {
            DOM.newGarageName.classList.remove('error');
        }, 2000);
        return;
    }
    
    fetch(`https://${GetParentResourceName()}/createSharedGarage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: garageName })
    })
    .then(resp => resp.json())
    .then(resp => {
        if (resp.status === 'success') {
            DOM.newGarageName.value = '';
            
            if (resp.garageData) {
                sharedGarages.push({
                    id: resp.garageData.id,
                    name: resp.garageData.name,
                    accessCode: resp.garageData.code,
                    isOwner: true
                });
                renderSharedGarages();
                setActiveSharedTab('my-garages');
            }
        }
    });
}

function joinSharedGarage() {
    if (!DOM.joinCode) {
        return;
    }
    
    const code = DOM.joinCode.value.trim();
    
    if (!code || code.length !== 4) {
        DOM.joinCode.classList.add('error');
        setTimeout(() => {
            DOM.joinCode.classList.remove('error');
        }, 2000);
        return;
    }
    
    fetch(`https://${GetParentResourceName()}/joinSharedGarage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: code })
    });
    
    DOM.joinCode.value = '';
}

function openJoinRequest(data) {
    if (!data.request || !DOM.requesterName || !DOM.requestGarageName || !DOM.joinRequestModal) {
        return;
    }
    
    currentRequestData = data.request;
    
    DOM.requesterName.textContent = currentRequestData.requesterName;
    DOM.requestGarageName.textContent = currentRequestData.garageName;
    
    DOM.joinRequestModal.classList.remove('hidden');
}

function handleJoinRequest(approved) {
    if (!currentRequestData) return;
    
    fetch(`https://${GetParentResourceName()}/handleJoinRequest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            requestId: currentRequestData.requesterId,
            approved: approved
        })
    });
    
    if (DOM.joinRequestModal) {
        DOM.joinRequestModal.classList.add('hidden');
    }
    currentRequestData = null;
}

function refreshVehicles(updatedVehicles) {
    if (!updatedVehicles) {
        return;
    }
    
    // Update favorites for the vehicles that are coming in
    for (let i = 0; i < updatedVehicles.length; i++) {
        // Mark vehicles that are out (state = 0)
        if (updatedVehicles[i].state === 0) {
            vehiclesAlreadyOut[updatedVehicles[i].plate] = true;
        }
        
        const existingVehicleIndex = vehicles.findIndex(v => v.plate === updatedVehicles[i].plate);
        if (existingVehicleIndex !== -1) {
            // If we already had this vehicle and it was a favorite, keep that status
            if (vehicles[existingVehicleIndex].isFavorite) {
                updatedVehicles[i].isFavorite = true;
            }
        }
    }
    
    // Keep a backup of original vehicles
    if (currentCategory === 'all') {
        originalVehicles = [...updatedVehicles];
    } else {
        // For other categories, make sure to copy favorite status to the matching vehicles in originalVehicles
        for (let i = 0; i < updatedVehicles.length; i++) {
            const originalIndex = originalVehicles.findIndex(v => v.plate === updatedVehicles[i].plate);
            if (originalIndex !== -1) {
                originalVehicles[originalIndex].isFavorite = updatedVehicles[i].isFavorite;
            }
        }
    }
    
    vehicles = updatedVehicles;
    
    // Apply filter based on current category
    filterVehiclesByCategory();
    
    // Update selected vehicle if it exists
    if (selectedVehicle) {
        const updatedVehicle = vehicles.find(v => v.plate === selectedVehicle.plate);
        if (updatedVehicle) {
            selectedVehicle = updatedVehicle;
            updateVehicleDetailView();
        } else {
            selectedVehicle = null;
            updateVehicleDetailView();
        }
    }
}

function requestVehicleRefresh() {
    if (!currentGarage) return;
    
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.remove('hidden');
    }
    
    const garageId = currentGarage.id;
    const garageType = currentGarage.type;
    
    fetch(`https://${GetParentResourceName()}/refreshVehicles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            garageId: garageId,
            garageType: garageType
        })
    });
    
    setTimeout(() => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('hidden');
        }
    }, 2000);
}

function showVehicleHoverPanel(vehicleData) {
    if (!vehicleData || !DOM.vehicleHoverPanel) return;
    
    currentHoveredVehicle = vehicleData;
    
    if (DOM.hoverVehicleName) DOM.hoverVehicleName.textContent = vehicleData.name || vehicleData.model;
    if (DOM.hoverVehiclePlate) DOM.hoverVehiclePlate.textContent = vehicleData.plate;
    
    const fuelValue = Math.round(vehicleData.fuel || 0);
    const engineValue = Math.round(vehicleData.engine || 0);
    const bodyValue = Math.round(vehicleData.body || 0);
    
    if (DOM.hoverFuelBar) DOM.hoverFuelBar.style.width = `${fuelValue}%`;
    if (DOM.hoverEngineBar) DOM.hoverEngineBar.style.width = `${engineValue}%`;
    if (DOM.hoverBodyBar) DOM.hoverBodyBar.style.width = `${bodyValue}%`;
    
    if (DOM.hoverFuelValue) DOM.hoverFuelValue.textContent = `${fuelValue}%`;
    if (DOM.hoverEngineValue) DOM.hoverEngineValue.textContent = `${engineValue}%`;
    if (DOM.hoverBodyValue) DOM.hoverBodyValue.textContent = `${bodyValue}%`;
    
    if (vehicleData.inVehicle && DOM.hoverEnterBtn) {
        DOM.hoverEnterBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>EXIT</span>
        `;
        if (DOM.hoverStoreBtn) DOM.hoverStoreBtn.disabled = false;
    } else if (DOM.hoverEnterBtn) {
        DOM.hoverEnterBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>ENTER</span>
        `;
        if (DOM.hoverStoreBtn) DOM.hoverStoreBtn.disabled = vehicleData.state === 0;
    }
    
    DOM.vehicleHoverPanel.classList.remove('hidden');
    isHoverPanelVisible = true;
}

function hideVehicleHoverPanel() {
    if (DOM.vehicleHoverPanel) {
        DOM.vehicleHoverPanel.classList.add('hidden');
    }
    isHoverPanelVisible = false;
    currentHoveredVehicle = null;
}

function hoverPanelEnterVehicle() {
    if (!currentHoveredVehicle) return;
    
    if (currentHoveredVehicle.inVehicle) {
        fetch(`https://${GetParentResourceName()}/exitVehicle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
    } else {
        fetch(`https://${GetParentResourceName()}/enterVehicle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                netId: currentHoveredVehicle.netId
            })
        });
    }
    
    hideVehicleHoverPanel();
}

function hoverPanelStoreVehicle() {
    if (!currentHoveredVehicle || (DOM.hoverStoreBtn && DOM.hoverStoreBtn.disabled)) return;
    
    fetch(`https://${GetParentResourceName()}/storeHoveredVehicle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            plate: currentHoveredVehicle.plate,
            netId: currentHoveredVehicle.netId
        })
    });
    
    hideVehicleHoverPanel();
}

function GetParentResourceName() {
    return 'dw-garages';
}

// מקום: בקובץ script.js, חפש את האזור שמטפל בלחיצה על לשונית ה-impound
document.querySelector('[data-category="impound"]').addEventListener('click', function() {
    console.log("Impound tab clicked - fetching impounded vehicles");
    
    // הצג את מסך הטעינה
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.remove('hidden');
    }
    
    // עדכן את הקטגוריה הפעילה
    setActiveCategory('impound');
    
    // קרא מידע מעודכן מהשרת באמצעות הקריאה המיוחדת למעוקלים
    fetch(`https://${GetParentResourceName()}/refreshImpoundVehicles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        // הסתר את מסך הטעינה
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('hidden');
        }
    })
    .catch(error => {
        console.error("Error refreshing impound vehicles:", error);
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('hidden');
        }
    });
});


// Open impound UI
function openImpoundUI(data) {
    impoundedVehicles = data.vehicles || [];
    currentImpoundLot = data.impound || {};
    
    // Update impound count badge
    updateImpoundCount();
    
    // Show the vehicles in the grid
    vehicles = [...impoundedVehicles];
    currentVehicles = [...impoundedVehicles];
    
    if (DOM.currentGarageName) {
        DOM.currentGarageName.textContent = currentImpoundLot.name || 'Impound Lot';
    }
    
    DOM.garageContainer.classList.remove('hidden');
    
    // Reset any selected vehicle
    selectedVehicle = null;
    selectedImpoundVehicle = null;
    updateVehicleDetailView();
    
    // Switch to impound category
    setActiveCategory('impound');
}

// Handle impound vehicle release
// Update the showImpoundDetails function in script.js
function showImpoundDetails(vehicle) {
    selectedImpoundVehicle = vehicle;
    
    const impoundModal = document.getElementById('impound-modal');
    if (!impoundModal) return;
    
    // Fill in vehicle details
    document.getElementById('impound-vehicle-name').textContent = vehicle.name;
    document.getElementById('impound-plate').textContent = vehicle.plate;
    
    // Set status bars
    const fuelValue = Math.round(vehicle.fuel || 0);
    const engineValue = Math.round(vehicle.engine || 0);
    const bodyValue = Math.round(vehicle.body || 0);
    
    document.getElementById('impound-fuel-bar').style.width = `${fuelValue}%`;
    document.getElementById('impound-engine-bar').style.width = `${engineValue}%`;
    document.getElementById('impound-body-bar').style.width = `${bodyValue}%`;
    
    document.getElementById('impound-fuel-percentage').textContent = `${fuelValue}%`;
    document.getElementById('impound-engine-percentage').textContent = `${engineValue}%`;
    document.getElementById('impound-body-percentage').textContent = `${bodyValue}%`;
    
    // Set impound details
    document.getElementById('impounded-by').textContent = vehicle.impoundedBy || 'Unknown';
    document.getElementById('impound-type').textContent = vehicle.impoundType || 'Police';
    document.getElementById('impound-days').textContent = `${vehicle.daysImpounded || 1} day(s)`;
    document.getElementById('impound-fee').textContent = `$${vehicle.impoundFee || 500}`;
    document.getElementById('impound-reason').textContent = vehicle.impoundReason || 'No reason specified';
    
    // Update release button
    const releaseBtn = document.getElementById('confirm-release');
    if (releaseBtn) {
        releaseBtn.textContent = `Pay & Release Vehicle ($${vehicle.impoundFee || 500})`;
    }
    
    // Show the modal
    impoundModal.classList.remove('hidden');
}

// Update impound count badge
function updateImpoundCount() {
    const countBadge = document.getElementById('impound-count');
    if (countBadge) {
        if (impoundedVehicles.length > 0) {
            countBadge.textContent = impoundedVehicles.length;
            countBadge.classList.remove('hidden');
        } else {
            countBadge.classList.add('hidden');
        }
    }
}

function createImpoundVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card impounded';
    card.dataset.plate = vehicle.plate;
    card.dataset.model = vehicle.model;
    
    card.addEventListener('click', () => {
        showImpoundDetails(vehicle);
    });
    
    const modelFormatted = vehicle.model ? vehicle.model.toLowerCase() : '';
    
    const fuelValue = Math.round(vehicle.fuel || 0);
    const engineValue = Math.round(vehicle.engine || 0);
    const bodyValue = Math.round(vehicle.body || 0);
    
    card.innerHTML = `
        <div class="vehicle-image">
            <img src="https://docs.fivem.net/vehicles/${modelFormatted}.webp" 
                 alt="${vehicle.name}" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x150/1e2137/a0aec0?text=${encodeURIComponent(vehicle.name || vehicle.model)}'" />
        </div>
        <div class="vehicle-info">
            <div class="vehicle-header">
                <div class="vehicle-title">
                    <div class="vehicle-name">${vehicle.name || vehicle.model}</div>
                    <div class="vehicle-plate">${vehicle.plate}</div>
                </div>
                <div class="vehicle-status-tags">
                    <div class="status-tag out">IMPOUNDED</div>
                </div>
            </div>
            
            <div class="status-bars">
                <div class="status-item">
                    <div class="status-label">
                        <span>FUEL</span>
                        <span class="status-value">${fuelValue}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill fuel" style="width: ${fuelValue}%"></div>
                    </div>
                </div>
                <div class="status-item">
                    <div class="status-label">
                        <span>ENGINE</span>
                        <span class="status-value">${engineValue}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill engine" style="width: ${engineValue}%"></div>
                    </div>
                </div>
                <div class="status-item">
                    <div class="status-label">
                        <span>BODY</span>
                        <span class="status-value">${bodyValue}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill body" style="width: ${bodyValue}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="vehicle-actions">
                <button class="release-btn">PAY $${vehicle.impoundFee} & RELEASE</button>
            </div>
        </div>
    `;
    
    // Add event listener to the release button
    const releaseBtn = card.querySelector('.release-btn');
    if (releaseBtn) {
        releaseBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the card click
            showImpoundDetails(vehicle);
        });
    }
    
    return card;
}

function setupImpoundEventListeners() {
    // Close impound modal
    const closeImpoundBtn = document.querySelector('#impound-modal .close-modal');
    if (closeImpoundBtn) {
        closeImpoundBtn.addEventListener('click', () => {
            document.getElementById('impound-modal').classList.add('hidden');
        });
    }
    
    // Cancel release button
    const cancelReleaseBtn = document.getElementById('cancel-release');
    if (cancelReleaseBtn) {
        cancelReleaseBtn.addEventListener('click', () => {
            document.getElementById('impound-modal').classList.add('hidden');
        });
    }
    
    // Confirm release button
    const confirmReleaseBtn = document.getElementById('confirm-release');
    if (confirmReleaseBtn) {
        confirmReleaseBtn.addEventListener('click', releaseImpoundedVehicle);
    }
}

function setImpoundOnly(forceImpoundOnly) {
    const gangCategory = document.getElementById('gang-category');
    const jobCategory = document.getElementById('job-category');
    const sharedCategory = document.getElementById('shared-category');
    const impoundCategory = document.getElementById('impound-category');
    const allCategory = document.querySelector('[data-category="all"]');
    const favoritesCategory = document.querySelector('[data-category="favorites"]');
    const manageSharedBtn = document.getElementById('manage-shared');

    if (forceImpoundOnly) {
        // FORCE IMPOUND ONLY MODE
        console.log("Forcing impound-only mode");
        
        // Show only impound tab
        if (impoundCategory) impoundCategory.style.display = 'flex';
        
        // Hide all other tabs completely
        if (allCategory) allCategory.style.display = 'none';
        if (favoritesCategory) favoritesCategory.style.display = 'none';
        if (gangCategory) gangCategory.style.display = 'none';
        if (jobCategory) jobCategory.style.display = 'none';
        if (sharedCategory) sharedCategory.style.display = 'none';
        if (manageSharedBtn) manageSharedBtn.style.display = 'none';
        
        // Automatically select impound category
        setActiveCategory('impound');
    } else {
        // NORMAL MODE
        console.log("Returning to normal mode");
        
        // Show regular tabs
        if (allCategory) allCategory.style.display = 'flex';
        if (favoritesCategory) favoritesCategory.style.display = 'flex';
        if (impoundCategory) impoundCategory.style.display = 'none';
        if (manageSharedBtn) manageSharedBtn.style.display = 'flex';
        
        // Set default active category
        setActiveCategory('all');
    }
}

// Release impounded vehicle function
function releaseImpoundedVehicle() {
    if (!selectedImpoundVehicle) return;
    
    // Close the modal
    document.getElementById('impound-modal').classList.add('hidden');
    
    // Show loading overlay
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.remove('hidden');
    }
    
    // Call the NUI callback
    fetch(`https://${GetParentResourceName()}/releaseImpoundedVehicle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            plate: selectedImpoundVehicle.plate,
            fee: selectedImpoundVehicle.impoundFee
        })
    })
    .then(resp => resp.json())
    .then(resp => {
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('hidden');
        }
        
        if (resp.status === 'success') {
            // Remove vehicle from impounded list
            const index = impoundedVehicles.findIndex(v => v.plate === selectedImpoundVehicle.plate);
            if (index !== -1) {
                impoundedVehicles.splice(index, 1);
            }
            
            // Close UI automatically after successful release
            closeGarage();
        }
    })
    .catch(error => {
        console.error("Error releasing vehicle:", error);
        if (DOM.loadingOverlay) {
            DOM.loadingOverlay.classList.add('hidden');
        }
    });
}


document.addEventListener('DOMContentLoaded', init);