// ============================================
// JOIN PAGE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // ========== TAB FUNCTIONALITY ==========
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Initialize first tab as active
    function initializeTabs() {
        const firstTab = document.querySelector('.tab-btn.active');
        if (firstTab) {
            const tabId = firstTab.dataset.tab;
            document.getElementById(`${tabId}-tab`).classList.add('active');
        }
    }
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                pane.style.opacity = '0';
                pane.style.transform = 'translateY(10px)';
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding pane with animation
            const targetPane = document.getElementById(`${tabId}-tab`);
            targetPane.classList.add('active');
            
            setTimeout(() => {
                targetPane.style.opacity = '1';
                targetPane.style.transform = 'translateY(0)';
            }, 10);
        });
    });
    
    // ========== MODAL FUNCTIONALITY ==========
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('.open-project-modal, .open-individual-form, .open-org-form');
    const modalCloses = document.querySelectorAll('.modal-close, .modal-cancel');
    
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('open-project-modal')) {
                openModal('projectIdeaModal');
            } else if (this.classList.contains('open-individual-form')) {
                const formType = this.dataset.form;
                openIndividualForm(formType);
            } else if (this.classList.contains('open-org-form')) {
                const formType = this.dataset.form;
                openOrgForm(formType);
            }
        });
    });
    
    // Close modal
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
    
    // Close modal on overlay click
    modals.forEach(modal => {
        const overlay = modal.querySelector('.modal-overlay');
        overlay.addEventListener('click', () => {
            closeModal(modal.id);
        });
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    closeModal(modal.id);
                }
            });
        }
    });
    
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            resetFormSteps();
            hideFormErrors();
        }
    }
    
    // ========== INDIVIDUAL FORM ==========
    function openIndividualForm(formType) {
        const formTitleMap = {
            'member': 'Become a Member',
            'subscriber': 'Join as Subscriber',
            'volunteer': 'Volunteer with Us',
            'chapter-leader': 'Lead a Chapter'
        };
        
        document.getElementById('formType').value = formType;
        document.getElementById('individualFormTitle').textContent = formTitleMap[formType] || 'Join Jaivic Bharat';
        openModal('individualFormModal');
        
        // Show step 1, hide step 2
        document.getElementById('step1').classList.add('active');
        document.getElementById('step2').classList.remove('active');
        
        // Clear specialized fields
        document.getElementById('specializedFields').innerHTML = '';
    }
    
    // ========== ORGANIZATION FORM ==========
    function openOrgForm(formType) {
        // For now, use the individual form modal with different title
        document.getElementById('formType').value = `org-${formType}`;
        document.getElementById('individualFormTitle').textContent = 'Organization Registration';
        openModal('individualFormModal');
        
        // Show step 1, hide step 2
        document.getElementById('step1').classList.add('active');
        document.getElementById('step2').classList.remove('active');
        
        // Clear specialized fields
        document.getElementById('specializedFields').innerHTML = '';
    }
    
    // ========== FORM STEP MANAGEMENT ==========
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const step1 = document.getElementById('step1');
            const step2 = document.getElementById('step2');
            const formType = document.getElementById('formType').value;
            
            // Validate step 1
            if (validateStep1()) {
                step1.classList.remove('active');
                step2.classList.add('active');
                populateSpecializedFields(formType);
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            document.getElementById('step1').classList.add('active');
            document.getElementById('step2').classList.remove('active');
        });
    }
    
    function validateStep1() {
        const requiredFields = document.querySelectorAll('#step1 [required]');
        let isValid = true;
        
        hideFormErrors();
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            } else if (field.id === 'mobile' && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        });
        
        // Check at least one checkbox in each group is checked
        const areaCheckboxes = document.querySelectorAll('input[name="areas[]"]:checked');
        const contributionCheckboxes = document.querySelectorAll('input[name="contribution[]"]:checked');
        
        if (areaCheckboxes.length === 0) {
            showCheckboxGroupError('areas[]', 'Please select at least one area');
            isValid = false;
        }
        
        if (contributionCheckboxes.length === 0) {
            showCheckboxGroupError('contribution[]', 'Please select at least one contribution method');
            isValid = false;
        }
        
        return isValid;
    }
    
    function populateSpecializedFields(formType) {
        const container = document.getElementById('specializedFields');
        
        let html = '';
        
        if (formType === 'member') {
            html = `
                <div class="form-group">
                    <label for="membershipType">Membership Type <span class="required-star">*</span></label>
                    <select id="membershipType" name="membershipType" required>
                        <option value="" disabled selected>Select membership type</option>
                        <option value="basic">Basic Member (Free)</option>
                        <option value="supporting">Supporting Member (₹500/year)</option>
                        <option value="sustaining">Sustaining Member (₹2000/year)</option>
                        <option value="founder">Founding Member (₹5000/year)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="profession">Profession / Background</label>
                    <input type="text" id="profession" name="profession" placeholder="e.g., Teacher, Farmer, Engineer, Student">
                </div>
                
                <div class="form-group">
                    <label for="expertise">Areas of Expertise</label>
                    <textarea id="expertise" name="expertise" rows="3" 
                              placeholder="List your skills, expertise, or knowledge areas"></textarea>
                </div>
            `;
        } else if (formType === 'volunteer') {
            html = `
                <div class="form-group">
                    <label for="volunteerSkills">Specific Skills for Volunteering <span class="required-star">*</span></label>
                    <textarea id="volunteerSkills" name="volunteerSkills" rows="3" required
                              placeholder="Describe your specific skills, experience, and how you'd like to volunteer"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="timeCommitment">Time Commitment <span class="required-star">*</span></label>
                    <select id="timeCommitment" name="timeCommitment" required>
                        <option value="" disabled selected>Select time commitment</option>
                        <option value="occasional">Occasional (a few hours/month)</option>
                        <option value="regular">Regular (5-10 hours/week)</option>
                        <option value="intensive">Intensive (15+ hours/week)</option>
                        <option value="project">Project-based</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="availability">Availability</label>
                    <div class="checkbox-grid">
                        <label class="checkbox-option">
                            <input type="checkbox" name="availability[]" value="weekdays">
                            <span>Weekdays</span>
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="availability[]" value="weekends">
                            <span>Weekends</span>
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="availability[]" value="evenings">
                            <span>Evenings</span>
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" name="availability[]" value="flexible">
                            <span>Flexible</span>
                        </label>
                    </div>
                </div>
            `;
        } else if (formType.startsWith('org-')) {
            html = `
                <div class="form-group">
                    <label for="organizationName">Organization Name <span class="required-star">*</span></label>
                    <input type="text" id="organizationName" name="organizationName" required>
                </div>
                
                <div class="form-group">
                    <label for="organizationType">Organization Type <span class="required-star">*</span></label>
                    <select id="organizationType" name="organizationType" required>
                        <option value="" disabled selected>Select organization type</option>
                        <option value="ngo">NGO / Non-profit</option>
                        <option value="corporate">Corporate</option>
                        <option value="startup">Startup</option>
                        <option value="government">Government Agency</option>
                        <option value="academic">Academic Institution</option>
                        <option value="community">Community Group</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="orgWebsite">Website</label>
                    <input type="url" id="orgWebsite" name="orgWebsite" placeholder="https://example.com">
                </div>
                
                <div class="form-group">
                    <label for="orgDescription">Organization Description <span class="required-star">*</span></label>
                    <textarea id="orgDescription" name="orgDescription" rows="3" required
                              placeholder="Brief description of your organization and its work"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="orgExperience">Relevant Experience / Past Projects</label>
                    <textarea id="orgExperience" name="orgExperience" rows="3"
                              placeholder="Describe relevant experience, projects, or achievements"></textarea>
                </div>
            `;
        } else {
            // Default for subscriber and chapter-leader
            html = `
                <div class="form-group">
                    <label for="additionalInfo">Additional Information</label>
                    <textarea id="additionalInfo" name="additionalInfo" rows="4"
                              placeholder="Any additional information you'd like to share..."></textarea>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
    
    // ========== FORM VALIDATION HELPERS ==========
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    }
    
    function showFieldError(field, message) {
        field.style.borderColor = '#e74c3c';
        
        let errorDiv = field.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#e74c3c';
            errorDiv.style.fontSize = '0.9rem';
            errorDiv.style.marginTop = '5px';
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
        
        errorDiv.textContent = message;
    }
    
    function showCheckboxGroupError(name, message) {
        const group = document.querySelector(`input[name="${name}"]`).closest('.form-group');
        
        let errorDiv = group.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#e74c3c';
            errorDiv.style.fontSize = '0.9rem';
            errorDiv.style.marginTop = '5px';
            group.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
    }
    
    function hideFormErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('input, textarea, select').forEach(field => {
            field.style.borderColor = '#e0e0e0';
        });
    }
    
    // ========== FORM SUBMISSION ==========
    const individualForm = document.getElementById('individualBasicForm');
    const projectForm = document.getElementById('projectIdeaForm');
    const policyAgree = document.getElementById('policyAgree');
    const modalAgree = document.querySelector('.modal-agree');
    
    if (individualForm) {
        individualForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep2()) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    alert('Thank you for your submission! We will contact you soon.');
                    closeModal('individualFormModal');
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }
    
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            hideFormErrors();
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    showFieldError(field, 'This field is required');
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    alert('Thank you for submitting your project idea! We will review it and contact you if there is a match.');
                    closeModal('projectIdeaModal');
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }
    
    // Character counter for project description
    const projectDescription = document.getElementById('projectDescription');
    const charCount = document.getElementById('charCount');
    
    if (projectDescription && charCount) {
        projectDescription.addEventListener('input', function() {
            const words = this.value.trim().split(/\s+/).filter(word => word.length > 0);
            charCount.textContent = words.length;
            
            if (words.length > 300) {
                charCount.style.color = '#e74c3c';
            } else if (words.length > 250) {
                charCount.style.color = '#f39c12';
            } else {
                charCount.style.color = '#27ae60';
            }
        });
    }
    
    // File upload preview
    const fileInput = document.getElementById('projectAttachment');
    const fileInfo = document.getElementById('fileInfo');
    
    if (fileInput && fileInfo) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const file = this.files[0];
                const fileName = file.name;
                const fileSize = (file.size / (1024 * 1024)).toFixed(2); // Convert to MB
                
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    alert('File size exceeds 5MB limit. Please choose a smaller file.');
                    this.value = '';
                    fileInfo.innerHTML = '';
                } else if (file.type !== 'application/pdf') {
                    alert('Only PDF files are allowed.');
                    this.value = '';
                    fileInfo.innerHTML = '';
                } else {
                    fileInfo.innerHTML = `
                        <i class="fas fa-file-pdf"></i>
                        <span>${fileName} (${fileSize} MB)</span>
                        <button type="button" class="remove-file" style="margin-left: 10px; color: #e74c3c; background: none; border: none; cursor: pointer;">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    
                    // Add remove file functionality
                    fileInfo.querySelector('.remove-file').addEventListener('click', function() {
                        fileInput.value = '';
                        fileInfo.innerHTML = '';
                    });
                }
            }
        });
    }
    
    // Policy agreement
    if (policyAgree && modalAgree) {
        policyAgree.addEventListener('change', function() {
            modalAgree.disabled = !this.checked;
        });
        
        modalAgree.addEventListener('click', function() {
            if (!policyAgree.checked) {
                alert('Please agree to the Donation Policy & Transparency first.');
                return;
            }
            
            // Here you would typically proceed to payment or next step
            alert('Proceeding to payment/donation page...');
            closeModal('donationPolicyModal');
        });
    }
    
    function validateStep2() {
        const requiredFields = document.querySelectorAll('#step2 [required]');
        let isValid = true;
        
        hideFormErrors();
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function resetFormSteps() {
        document.getElementById('step1').classList.add('active');
        document.getElementById('step2').classList.remove('active');
    }
    
    // ========== INITIALIZATION ==========
    initializeTabs();
    
    // Add some interactivity to cards
    const joinCards = document.querySelectorAll('.join-card');
    joinCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    console.log('Join page initialized successfully!');
});