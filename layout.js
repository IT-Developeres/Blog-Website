/**
 * IT Interview Hub - Layout Manager
 * 
 * SIMPLE USAGE - Just 3 steps:
 * 
 * 1. Add header div: <div id="header"></div>
 * 2. Add footer div: <div id="footer"></div>
 * 3. Include this script: <script src="layout.js"></script>
 * 
 * That's it! Header and footer will automatically load on page load.
 */

// Main function to load header and footer
async function loadHeaderFooter() {
    try {
        const headerElement = document.getElementById('header');
        const footerElement = document.getElementById('footer');
        
        if (!headerElement && !footerElement) {
            console.warn('Header and footer divs not found');
            return;
        }
        
        // Load header and footer simultaneously
        const promises = [];
        
        if (headerElement) {
            promises.push(loadComponent('header', 'header.html'));
        }
        
        if (footerElement) {
            promises.push(loadComponent('footer', 'footer.html'));
        }
        
        await Promise.all(promises);
        
        // Initialize navigation after components are loaded
        setTimeout(() => {
            initializeNavigation();
        }, 200);
        
        console.log('Header and Footer loaded successfully');
    } catch (error) {
        console.error('Error loading header/footer:', error);
        // Fallback content
        setFallbackContent();
    }
}

// Function to load HTML component dynamically
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            // Re-initialize any scripts in the loaded HTML
            initializeScripts(element);
            return true;
        } else {
            console.warn(`Element with id "${elementId}" not found`);
            return false;
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        throw error;
    }
}

// Initialize scripts and styles in loaded components
function initializeScripts(container) {
    // Handle scripts
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
    
    // Handle styles - move them to document head for proper application
    const styles = container.querySelectorAll('style');
    styles.forEach((style, index) => {
        // Create unique ID based on container and index
        const containerId = container.id || 'component';
        const styleId = `${containerId}-styles-${index}`;
        let existingStyle = document.getElementById(styleId);
        
        if (!existingStyle) {
            const newStyle = document.createElement('style');
            newStyle.id = styleId;
            newStyle.textContent = style.textContent;
            document.head.appendChild(newStyle);
        } else {
            // Update existing style
            existingStyle.textContent = style.textContent;
        }
        
        // Keep the style in the container for reference, but it's also in head
        // This ensures styles work even if head injection fails
    });
}

// Initialize navigation functionality
function initializeNavigation() {
    // This will be handled by the scripts in header.html and footer.html
    console.log('Navigation initialized');
}

// Fallback content if loading fails
function setFallbackContent() {
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');
    
    if (headerElement && !headerElement.innerHTML.trim()) {
        headerElement.innerHTML = `
            <header style="background: #fff; padding: 1rem 5%; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000;">
                <div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
                    <a href="index.html" style="font-size: 1.75rem; font-weight: 700; color: #2563eb; text-decoration: none; display: flex; align-items: center; gap: 0.75rem;">
                        <i class="fas fa-laptop-code"></i> <span>IT Interview Hub</span>
                    </a>
                    <nav style="display: flex; gap: 1rem;">
                        <a href="index.html" style="color: #0f172a; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 8px; transition: all 0.3s;">Home</a>
                        <a href="about.html" style="color: #0f172a; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 8px; transition: all 0.3s;">About</a>
                        <a href="contact.html" style="color: #0f172a; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 8px; transition: all 0.3s;">Contact</a>
                    </nav>
                </div>
            </header>
        `;
    }
    
    if (footerElement && !footerElement.innerHTML.trim()) {
        footerElement.innerHTML = `
            <footer style="background: #0f172a; color: #cbd5f5; padding: 3rem 5%; margin-top: 4rem;">
                <div style="max-width: 1400px; margin: 0 auto; text-align: center;">
                    <p style="margin-bottom: 1rem;">&copy; 2025 IT Interview Hub. All rights reserved.</p>
                    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                        <a href="index.html" style="color: #94a3b8; text-decoration: none;">Home</a>
                        <span style="color: #475569;">|</span>
                        <a href="about.html" style="color: #94a3b8; text-decoration: none;">About</a>
                        <span style="color: #475569;">|</span>
                        <a href="contact.html" style="color: #94a3b8; text-decoration: none;">Contact</a>
                    </div>
                </div>
            </footer>
        `;
    }
}

// Auto-initialize when DOM is ready - Multiple methods for reliability
function initializeLayout() {
    // Check if elements exist
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');
    
    if (headerElement || footerElement) {
        loadHeaderFooter();
    } else {
        // Retry after a short delay if elements not found yet
        setTimeout(function() {
            const h = document.getElementById('header');
            const f = document.getElementById('footer');
            if (h || f) {
                loadHeaderFooter();
            }
        }, 100);
    }
}

// Try multiple initialization methods for maximum compatibility
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLayout);
} else {
    // DOM is already ready
    initializeLayout();
}

// Also try on window load as backup
window.addEventListener('load', function() {
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');
    if ((headerElement && !headerElement.innerHTML.trim()) || 
        (footerElement && !footerElement.innerHTML.trim())) {
        loadHeaderFooter();
    }
});

// Export functions for global access
window.loadHeaderFooter = loadHeaderFooter;
window.loadComponent = loadComponent;
window.loadLayout = loadHeaderFooter;

// Force load if called directly
if (typeof window !== 'undefined') {
    // Additional safety check
    setTimeout(function() {
        const headerElement = document.getElementById('header');
        const footerElement = document.getElementById('footer');
        if ((headerElement && !headerElement.innerHTML.trim()) || 
            (footerElement && !footerElement.innerHTML.trim())) {
            loadHeaderFooter();
        }
    }, 500);
}
