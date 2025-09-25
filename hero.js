// Craigslist Redesign - Simple JS

let listings = [];
let currentPage = 1;
let isLoading = false;
let recentlyViewed = [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadListings();
  setupEventListeners();
  setupInfiniteScroll();
});

// Event listeners
function setupEventListeners() {
  // Search
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.querySelector('.search-btn');
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
  
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }
  
  // Refresh button
  const refreshBtn = document.querySelector('.refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      currentPage = 1;
      listings = [];
      loadListings();
    });
  }
  
  // Post button
  const postBtn = document.querySelector('.post-btn');
  if (postBtn) {
    postBtn.addEventListener('click', function() {
      alert('Posting feature coming soon!');
    });
  }
  
  // Profile dropdown
  const profileBtn = document.getElementById('profile-btn');
  const profileMenu = document.getElementById('profile-menu');
  
  if (profileBtn && profileMenu) {
    profileBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      profileMenu.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
        profileMenu.classList.remove('show');
      }
    });
  }
}

// Infinite scroll
function setupInfiniteScroll() {
  window.addEventListener('scroll', function() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading) {
      loadMoreListings();
    }
  });
}

// Load initial listings
function loadListings() {
  isLoading = true;
  showLoading();
  
  setTimeout(function() {
    const newListings = generateListings(12);
    listings = newListings;
    renderListings(newListings);
    isLoading = false;
    hideLoading();
  }, 500);
}

// Load more listings
function loadMoreListings() {
  if (isLoading) return;
  
  isLoading = true;
  showLoading();
  
  setTimeout(function() {
    const newListings = generateListings(6);
    listings = [...listings, ...newListings];
    renderListings(newListings, true);
    isLoading = false;
    hideLoading();
  }, 800);
}

// Generate mock listings
function generateListings(count) {
  const categories = ['Electronics', 'Furniture', 'Cars', 'Jobs', 'Housing', 'Services'];
  const locations = ['Manhattan, NY', 'Brooklyn, NY', 'San Francisco, CA', 'Chicago, IL', 'Los Angeles, CA'];
  const images = [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center'
  ];
  
  const titles = [
    'Vintage Mountain Bike - Great Condition',
    '2BR Apartment in Prime Location',
    'MacBook Pro 13" - Like New',
    'Vintage Leather Sofa',
    'iPhone 12 Pro - Unlocked',
    'Dining Table Set',
    '2019 Honda Civic',
    'Graphic Design Services',
    'Studio Apartment',
    'Nike Air Max',
    'Kitchen Appliances',
    'Art Supplies'
  ];
  
  const prices = ['$250', '$1,200', '$2,200/mo', '$800', '$1,500', '$400', '$18,500', '$50/hr', '$1,800/mo', '$120', '$300', '$150'];
  
  const listings = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * titles.length);
    const listing = {
      id: 'listing-' + Date.now() + '-' + i,
      title: titles[randomIndex],
      price: prices[randomIndex],
      location: locations[Math.floor(Math.random() * locations.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      image: images[Math.floor(Math.random() * images.length)],
      date: getRandomDate()
    };
    
    listings.push(listing);
  }
  
  return listings;
}

function getRandomDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7);
  const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  return date.toLocaleDateString();
}

// Render listings
function renderListings(newListings, append) {
  const listingsGrid = document.getElementById('listings-grid');
  if (!listingsGrid) return;
  
  if (!append) {
    listingsGrid.innerHTML = '';
  }
  
  newListings.forEach(function(listing) {
    const card = createListingCard(listing);
    listingsGrid.appendChild(card);
  });
}

// Create listing card
function createListingCard(listing) {
  const card = document.createElement('div');
  card.className = 'listing-card';
  card.dataset.listingId = listing.id;
  
  card.innerHTML = `
    <img src="${listing.image}" alt="${listing.title}" class="card-image">
    <div class="card-content">
      <h3 class="card-title">${listing.title}</h3>
      <div class="card-price">${listing.price}</div>
      <div class="card-location">
        <i class="fas fa-map-marker-alt"></i>
        ${listing.location}
      </div>
      <div class="card-meta">
        <span class="card-date">${listing.date}</span>
        <div class="card-actions">
          <button class="card-action-btn" data-action="save">
            <i class="far fa-heart"></i>
          </button>
          <button class="card-action-btn" data-action="share">
            <i class="fas fa-share"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Card click handler
  card.addEventListener('click', function(e) {
    if (!e.target.closest('.card-action-btn')) {
      handleListingClick(listing);
    }
  });
  
  // Action button handlers
  const actionBtns = card.querySelectorAll('.card-action-btn');
  actionBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      handleCardAction(btn, listing);
    });
  });
  
  return card;
}

// Handle listing click
function handleListingClick(listing) {
  addToRecentlyViewed(listing);
  console.log('Viewing:', listing.title);
  showNotification('Viewing: ' + listing.title);
}

// Handle card actions
function handleCardAction(btn, listing) {
  const action = btn.dataset.action;
  
  if (action === 'save') {
    toggleSave(btn);
  } else if (action === 'share') {
    shareListing(listing);
  }
}

// Toggle save
function toggleSave(btn) {
  const icon = btn.querySelector('i');
  const isSaved = icon.classList.contains('fas');
  
  if (isSaved) {
    icon.classList.remove('fas');
    icon.classList.add('far');
    showNotification('Removed from saved');
  } else {
    icon.classList.remove('far');
    icon.classList.add('fas');
    showNotification('Added to saved');
  }
}

// Share listing
function shareListing(listing) {
  if (navigator.share) {
    navigator.share({
      title: listing.title,
      text: 'Check out this listing: ' + listing.title + ' - ' + listing.price,
      url: window.location.href
    });
  } else {
    const url = window.location.origin + '/listing/' + listing.id;
    navigator.clipboard.writeText(url).then(function() {
      showNotification('Link copied to clipboard');
    });
  }
}

// Add to recently viewed
function addToRecentlyViewed(listing) {
  recentlyViewed = recentlyViewed.filter(function(item) {
    return item.id !== listing.id;
  });
  
  recentlyViewed.unshift(listing);
  recentlyViewed = recentlyViewed.slice(0, 5);
  
  updateRecentlyViewedDisplay();
}

// Update recently viewed display
function updateRecentlyViewedDisplay() {
  const recentItems = document.getElementById('recent-items');
  if (!recentItems) return;
  
  if (recentlyViewed.length === 0) {
    recentItems.innerHTML = '<div class="no-recent-items">No recently viewed items</div>';
    return;
  }
  
  recentItems.innerHTML = recentlyViewed.map(function(item) {
    return `
      <div class="recent-item" data-listing-id="${item.id}">
        <img src="${item.image}" alt="${item.title}">
        <div class="item-info">
          <div class="item-title">${item.title}</div>
          <div class="item-price">${item.price}</div>
        </div>
      </div>
    `;
  }).join('');
  
  // Add click handlers
  const recentItemElements = recentItems.querySelectorAll('.recent-item');
  recentItemElements.forEach(function(element) {
    element.addEventListener('click', function() {
      const listingId = element.dataset.listingId;
      const listing = recentlyViewed.find(function(item) {
        return item.id === listingId;
      });
      if (listing) {
        handleListingClick(listing);
      }
    });
  });
}

// Perform search
function performSearch() {
  const searchInput = document.getElementById('search-input');
  const locationSelect = document.getElementById('location-select');
  
  if (!searchInput || !locationSelect) return;
  
  const query = searchInput.value.trim();
  const location = locationSelect.value;
  
  console.log('Searching for:', query, 'in', location);
  showNotification('Searching for "' + query + '" in ' + locationSelect.options[locationSelect.selectedIndex].text);
  
  // Refresh listings
  currentPage = 1;
  listings = [];
  loadListings();
}

// Show loading
function showLoading() {
  const indicator = document.getElementById('loading-indicator');
  if (indicator) {
    indicator.classList.add('show');
  }
}

// Hide loading
function hideLoading() {
  const indicator = document.getElementById('loading-indicator');
  if (indicator) {
    indicator.classList.remove('show');
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #800080;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-size: 13px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(function() {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  setTimeout(function() {
    notification.style.transform = 'translateX(100%)';
    setTimeout(function() {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}