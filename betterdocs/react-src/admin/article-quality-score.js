import { __ } from "@wordpress/i18n";

jQuery(document).ready(function($) {

    function getScoreColorClass(score) {
        if (score >= 80) return 'green';
        if (score >= 50) return 'yellow';
        if (score >= 30) return 'orange';
        return 'red';
    }

    function getScoreStatusText(score) {
        if (score >= 80) return __('Excellent', 'betterdocs');
        if (score >= 60) return __('Good', 'betterdocs');
        if (score >= 40) return __('Needs Improvement', 'betterdocs');
        return __('Poor', 'betterdocs');
    }

    function showResults(container, data) {
        const $container = $(container);
        const $results = $container.find('.quality-results');
        const $empty = $container.find('.quality-empty');

        // Hide empty state, show results
        $empty.hide();
        $results.show();

        // Handle nested data structure (response.data.data)
        const analysisData = data.data || data;

        // Build results HTML
        const score = analysisData.overall_score || 0;
        const scores = analysisData.scores || {};
        const feedback = analysisData.feedback || {};
        const strengths = feedback.strengths || [];
        const improvements = feedback.improvements || [];
        const suggestions = feedback.suggestions || [];

        let resultsHTML = '';

        // Results header with regenerate button
        resultsHTML += '<div class="quality-results-header">';
        resultsHTML += '<h4>' + __('Docs quality analysis results', 'betterdocs') + '</h4>';
        resultsHTML += '<button type="button" class="betterdocs-regenerate-quality" id="betterdocs-regenerate-quality">';
        resultsHTML += '<svg width="16" height="22" viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg">';
        resultsHTML += '<path d="M1.1 15.05C0.733333 14.4167 0.458333 13.7667 0.275 13.1C0.0916667 12.4333 0 11.75 0 11.05C0 8.81667 0.775 6.91667 2.325 5.35C3.875 3.78333 5.76667 3 8 3H8.175L6.575 1.4L7.975 0L11.975 4L7.975 8L6.575 6.6L8.175 5H8C6.33333 5 4.91667 5.5875 3.75 6.7625C2.58333 7.9375 2 9.36667 2 11.05C2 11.4833 2.05 11.9083 2.15 12.325C2.25 12.7417 2.4 13.15 2.6 13.55L1.1 15.05ZM8.025 22L4.025 18L8.025 14L9.425 15.4L7.825 17H8C9.66667 17 11.0833 16.4125 12.25 15.2375C13.4167 14.0625 14 12.6333 14 10.95C14 10.5167 13.95 10.0917 13.85 9.675C13.75 9.25833 13.6 8.85 13.4 8.45L14.9 6.95C15.2667 7.58333 15.5417 8.23333 15.725 8.9C15.9083 9.56667 16 10.25 16 10.95C16 13.1833 15.225 15.0833 13.675 16.65C12.125 18.2167 10.2333 19 8 19H7.825L9.425 20.6L8.025 22Z" fill="#475467"/>';
        resultsHTML += '</svg>';
        resultsHTML += '</button>';
        resultsHTML += '</div>';

        // Calculate circular progress
        const scoreColor = getScoreColorClass(score);
        const circumference = 2 * Math.PI * 54; // radius = 54
        const offset = circumference - (score / 100) * circumference;

        // Start two-column layout
        resultsHTML += '<div class="quality-results-body">';
        // Left Column: Circular Progress Score
        resultsHTML += '<div class="score-column">';
        resultsHTML += '<h3 class="score-column-title">' + __('Overall Score', 'betterdocs') + '</h3>';
        resultsHTML += '<div class="progress-ring-wrapper">';
        resultsHTML += '<svg class="progress-ring" viewBox="0 0 120 120">';
        resultsHTML += '<circle class="progress-ring-bg" cx="60" cy="60" r="54" fill="none" stroke-width="12"></circle>';
        resultsHTML += '<circle class="progress-ring-circle ' + scoreColor + '" cx="60" cy="60" r="54" fill="none" stroke-width="12" stroke-linecap="round" style="stroke-dasharray: ' + circumference + '; stroke-dashoffset: ' + offset + '; transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 0.5s ease-in-out;"></circle>';
        resultsHTML += '</svg>';
        resultsHTML += '<div class="score-text-wrapper">';
        resultsHTML += '<span class="score-value ' + scoreColor + '">' + score + '</span>';
        resultsHTML += '<span class="score-label">' + __('out of 100', 'betterdocs') + '</span>';
        resultsHTML += '</div>';
        resultsHTML += '</div>';
        resultsHTML += '<div class="score-feedback ' + scoreColor + '">' + getScoreStatusText(score) + '</div>';
        resultsHTML += '<p class="score-description">' + __('This score is a weighted average of clarity, relevance, structure, and other quality factors.', 'betterdocs') + '</p>';
        resultsHTML += '</div>';

        // Right Column: Details (Score Breakdown)
        resultsHTML += '<div class="details-column">';
        if (Object.keys(scores).length > 0) {
            resultsHTML += '<div class="section">';
            resultsHTML += '<h3 class="section-title">' + __('Score Breakdown', 'betterdocs') + '</h3>';
            resultsHTML += '<div class="score-breakdown-list">';
            Object.keys(scores).forEach(function(criterion) {
                const criterionScore = scores[criterion];
                resultsHTML += '<div class="score-item">';
                resultsHTML += '<div class="score-name-group">';
                resultsHTML += '<span class="score-name">' + criterion.charAt(0).toUpperCase() + criterion.slice(1) + '</span>';
                resultsHTML += '<span class="score-percentage">' + criterionScore + '%</span>';
                resultsHTML += '</div>';
                resultsHTML += '<div class="score-bar-group">';
                resultsHTML += '<div class="score-bar-wrapper">';
                resultsHTML += '<div class="score-bar-fill ' + getScoreColorClass(criterionScore) + '" style="width: ' + criterionScore + '%"></div>';
                resultsHTML += '</div>';
                resultsHTML += '</div>';
                resultsHTML += '</div>';
            });
            resultsHTML += '</div>';
            resultsHTML += '</div>';
        }
        resultsHTML += '</div>'; // Close details-column
        resultsHTML += '</div>'; // Close quality-results-body

        // Gather all suggestions for "Actionable Insights" section
        const allSuggestions = [];
        if (strengths.length > 0) allSuggestions.push(...strengths);
        if (improvements.length > 0) allSuggestions.push(...improvements);
        if (suggestions.length > 0) allSuggestions.push(...suggestions);
        if (allSuggestions.length > 0) {
            resultsHTML += '<div class="improvement-section section">';
            resultsHTML += '<h3 class="section-title">' + __('Actionable Insights', 'betterdocs') + '</h3>';
            resultsHTML += '<div class="improvements-list">';
            allSuggestions.forEach(function(suggestion) {
                resultsHTML += '<div class="improvement-item">';
                resultsHTML += '<div class="improvement-icon">';
                resultsHTML += '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">';
				resultsHTML += '<rect width="16" height="16" rx="8" fill="#D0D5DD"></rect>';
				resultsHTML += '<path d="M5 8.88L6.67619 10.8L10.8667 6" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>';
				resultsHTML += '</svg>';
                resultsHTML += '</div>';
                resultsHTML += '<span class="improvement-text">' + suggestion + '</span>';
                resultsHTML += '</div>';
            });
            resultsHTML += '</div>';
            resultsHTML += '</div>';
        }

        $results.html(resultsHTML);
    }

    function showLoading(container) {
        const $container = $(container);
        $container.find('.quality-empty').hide();
        $container.find('.quality-results').hide();
        $container.find('.quality-error').hide();
        $container.find('.quality-loading').show();
    }

    function hideLoading(container) {
        const $container = $(container);
        $container.find('.quality-loading').hide();
    }

    function showError(container, errorData) {
        const $container = $(container);
        hideLoading(container);
        
        // Extract error message from various response formats
        let message = '';
        let isConfigError = false;
        
        if (typeof errorData === 'string') {
            message = errorData;
        } else if (errorData && typeof errorData === 'object') {
            // Handle WP_Error format or standard error response
            if (errorData.message) {
                message = errorData.message;
            } else if (errorData.data && errorData.data.message) {
                message = errorData.data.message;
            } else {
                message = __('An unexpected error occurred. Please try again.', 'betterdocs');
            }
        } else {
            message = __('Analysis failed. Please try again.', 'betterdocs');
        }
        
        // Check if this is an API key configuration error
        if (message.toLowerCase().includes('api key') || message.toLowerCase().includes('not configured')) {
            isConfigError = true;
            message = __('AI API key is not configured. Please configure your API key in the settings to use this feature.', 'betterdocs');
            
            // Hide the analyze button and show error in empty state
            $container.find('.betterdocs-analyze-btn').hide();
            $container.find('.quality-empty').show();
            
            // Show configuration error UI elements
            $container.find('.quality-error').find('.error-icon').show();
            $container.find('.quality-error').find('strong').show();
            $container.find('.quality-error').find('.error-action-button').show();
            
            // Add configuration error class, remove content error class
            $container.find('.quality-error').removeClass('error-content-validation').addClass('error-config');
        } else {
            // For content errors (empty, too short, etc.)
            // Hide configuration-specific UI elements
            $container.find('.quality-error').find('.error-icon').hide();
            $container.find('.quality-error').find('strong').hide();
            $container.find('.quality-error').find('.error-action-button').hide();
            
            // Keep the analyze button visible for content errors
            $container.find('.betterdocs-analyze-btn').show();
            $container.find('.quality-empty').show();
            
            // Add content error class, remove configuration error class
            $container.find('.quality-error').removeClass('error-config').addClass('error-content-validation');
        }
        
        $container.find('.quality-error').find('.error-message').text(message);
        $container.find('.quality-error').show();
    }

    // Analyze button click handler
    $(document).on('click', '#betterdocs-analyze-quality', function(e) {
        e.preventDefault();

        const $button = $(this);
        const $container = $button.closest('.betterdocs-quality-analysis-content');
        const postId = $container.data('post-id');

        if (!postId) {
            alert(__('Please save the post first.', 'betterdocs'));
            return;
        }

        // Get current editor content (handles both Classic and Gutenberg editors)
        let currentContent = '';
        let currentTitle = '';
        
        // Try to get Gutenberg editor content
        if (typeof wp !== 'undefined' && wp.data && wp.data.select('core/editor')) {
            const editor = wp.data.select('core/editor');
            currentContent = editor.getEditedPostContent();
            currentTitle = editor.getEditedPostAttribute('title');
        } 
        // Fallback to Classic Editor
        else if (typeof tinymce !== 'undefined' && tinymce.get('content')) {
            currentContent = tinymce.get('content').getContent();
            currentTitle = $('#title').val() || '';
        }
        // Fallback to textarea (if visual editor is disabled)
        else if ($('#content').length) {
            currentContent = $('#content').val();
            currentTitle = $('#title').val() || '';
        }

        // Show loading state
        $button.prop('disabled', true);
        showLoading($container);

        // Prepare AJAX data
        const ajaxData = {
            action: 'betterdocs_analyze_quality',
            post_id: postId,
            nonce: betterdocsQualityScore.nonce
        };
        
        // Add current content if available
        if (currentContent) {
            ajaxData.current_content = currentContent;
            ajaxData.current_title = currentTitle;
        }

        // Run analysis
        $.ajax({
            url: betterdocsQualityScore.ajax_url,
            type: 'POST',
            data: ajaxData,
            success: function(response) {
                if (response.success) {
                    hideLoading($container);
                    showResults($container, response.data);
                } else {
                    showError($container, response.data || response);
                }
            },
            error: function() {
                showError($container, __('Network error. Please try again.', 'betterdocs'));
            },
            complete: function() {
                $button.prop('disabled', false);
            }
        });
    });

    // Regenerate button click handler
    $(document).on('click', '#betterdocs-regenerate-quality', function(e) {
        e.preventDefault();

        const $button = $(this);
        const $container = $button.closest('.betterdocs-quality-analysis-content');
        const postId = $container.data('post-id');

        if (!postId) {
            alert(__('Please save the post first.', 'betterdocs'));
            return;
        }

        // Get current editor content (handles both Classic and Gutenberg editors)
        let currentContent = '';
        let currentTitle = '';
        
        // Try to get Gutenberg editor content
        if (typeof wp !== 'undefined' && wp.data && wp.data.select('core/editor')) {
            const editor = wp.data.select('core/editor');
            currentContent = editor.getEditedPostContent();
            currentTitle = editor.getEditedPostAttribute('title');
        } 
        // Fallback to Classic Editor
        else if (typeof tinymce !== 'undefined' && tinymce.get('content')) {
            currentContent = tinymce.get('content').getContent();
            currentTitle = $('#title').val() || '';
        }
        // Fallback to textarea (if visual editor is disabled)
        else if ($('#content').length) {
            currentContent = $('#content').val();
            currentTitle = $('#title').val() || '';
        }

        // Show loading state
        $button.prop('disabled', true);
        showLoading($container);

        // Prepare AJAX data
        const ajaxData = {
            action: 'betterdocs_analyze_quality',
            post_id: postId,
            nonce: betterdocsQualityScore.nonce
        };
        
        // Add current content if available
        if (currentContent) {
            ajaxData.current_content = currentContent;
            ajaxData.current_title = currentTitle;
        }

        // Run analysis
        $.ajax({
            url: betterdocsQualityScore.ajax_url,
            type: 'POST',
            data: ajaxData,
            success: function(response) {
                if (response.success) {
                    hideLoading($container);
                    showResults($container, response.data);
                } else {
                    showError($container, response.data || response);
                }
            },
            error: function() {
                showError($container, __('Network error. Please try again.', 'betterdocs'));
            },
            complete: function() {
                $button.prop('disabled', false);
            }
        });
    });

});
