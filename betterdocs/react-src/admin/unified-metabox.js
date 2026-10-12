/**
 * BetterDocs Unified Metabox
 * 
 * Handles tab switching and interactions for the unified metabox
 */

(function($) {
    'use strict';

    /**
     * Initialize unified metabox
     */
    function initUnifiedMetabox() {
        const $metabox = $('.betterdocs-unified-metabox');
        
        if (!$metabox.length) {
            return;
        }

        // Tab switching
        $metabox.on('click', '.betterdocs-metabox-tab', function(e) {
            e.preventDefault();
            
            const $tab = $(this);
            const tabId = $tab.data('tab');
            
            // Update active tab
            $metabox.find('.betterdocs-metabox-tab').removeClass('active');
            $tab.addClass('active');
            
            // Update active panel
            $metabox.find('.betterdocs-metabox-panel').removeClass('active');
            $metabox.find(`.betterdocs-metabox-panel[data-panel="${tabId}"]`).addClass('active');
            
            // Trigger event for other scripts to hook into
            $(document).trigger('betterdocs:metabox:tab-changed', [tabId]);
        });
    }

    // Initialize on document ready
    $(document).ready(function() {
        initUnifiedMetabox();
    });

})(jQuery);

