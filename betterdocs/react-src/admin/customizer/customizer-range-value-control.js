/**
 * Script run inside a Customizer control sidebar
 */
(function($) {
    // An empty setting means "unset" — the control emits no CSS and the
    // stylesheet's own value stands. That state is not representable in an
    // <input type="range">: the HTML value-sanitization algorithm turns a
    // non-numeric value into min + (max-min)/2, so an unset control would park
    // its thumb on a meaningless midpoint. Controls that can be unset therefore
    // ship a `data-unset-val` holding the value the stylesheet actually paints.
    // Sliders with a numeric default have no such attribute and are untouched by
    // any of the branches below.
    var isUnset = function($range) {
        var id = $range.attr('data-customize-setting-link');
        if (!id || !wp.customize.has(id)) {
            return false;
        }
        var val = wp.customize(id).get();
        return val === '' || val === null || typeof val === 'undefined';
    };

    // Park the thumb on the unset fallback without touching the setting.
    // Assigning .value directly fires no change event, so nothing is published
    // and the control keeps emitting zero CSS.
    var applyUnsetVal = function($range) {
        var unset = $range.attr('data-unset-val');
        if (typeof unset !== 'undefined' && isUnset($range)) {
            $range.val(unset);
            return true;
        }
        return false;
    };

    wp.customize.bind('ready', function() {
        rangeSlider();

        var rangeValReset  = jQuery('.betterdocs-customizer-reset.betterdocs-range-value');
        rangeValReset.each(function() {
            $(rangeValReset).on( 'click', function (e) {
                e.preventDefault();
                var nextRangeselector = $(this).next('.betterdcos-range-slider');
                var nextRangeDefaultVal = $(this).next('.betterdcos-range-slider').data('default-val');
                var $range = nextRangeselector.find('.betterdcos-range-slider__range');
                var suffix = $range.attr('suffix') ? $range.attr('suffix') : '';

                if (nextRangeDefaultVal === '' || nextRangeDefaultVal === null || typeof nextRangeDefaultVal === 'undefined') {
                    // Round-tripping '' through the range input would coerce it to
                    // the midpoint and then publish that number, so Reset would
                    // apply styling instead of clearing it. Write the setting
                    // directly and re-park the thumb on the stylesheet value.
                    var id = $range.attr('data-customize-setting-link');
                    if (id && wp.customize.has(id)) {
                        wp.customize(id).set('');
                    }
                    var unset = $range.attr('data-unset-val');
                    if (typeof unset !== 'undefined') {
                        $range.val(unset);
                    }
                    nextRangeselector.find('.betterdcos-range-slider__value').html($range.val() + suffix);
                    return;
                }

                $range.val(nextRangeDefaultVal).trigger('change');
                nextRangeselector.find('.betterdcos-range-slider__value').html(nextRangeDefaultVal + suffix);

            });
        });
    });

    var rangeSlider = function() {
        var slider = $('.betterdcos-range-slider'),
            range = $('.betterdcos-range-slider__range'),
            value = $('.betterdcos-range-slider__value');

        slider.each(function() {

            value.each(function() {
                var $range = $(this).prev();
                // WP core's linkElements() has already pushed the saved setting
                // into the input by the time 'ready' fires, so read the live value
                // rather than the rendered attribute — otherwise an unset control
                // renders a bare suffix with no number in front of it.
                applyUnsetVal($range);
                var value = $range.val();
				var suffix = ($range.attr('suffix')) ? $range.attr('suffix') : '';
                $(this).html(value + suffix);
            });

            range.on('input', function() {
				var suffix = ($(this).attr('suffix')) ? $(this).attr('suffix') : '';
                $(this).next(value).html(this.value + suffix );
            });
        });
    };

})(jQuery);
