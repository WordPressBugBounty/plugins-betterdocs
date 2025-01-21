<div class="betterdocs-faq-main-content" <?php echo $faq_toggle ? ' style="display:block;"' : ""  ?>>
	<?php echo wp_kses_post( get_the_content() ); ?>
</div>
