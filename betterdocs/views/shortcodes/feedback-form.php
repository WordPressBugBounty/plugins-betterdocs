<div class="form-wrapper">
	<div class="response"></div>
	<form id="betterdocs-feedback-form" class="betterdocs-feedback-form" action="" method="post">
		<p>
			<label for="message_name" class="form-name">
				<?php 
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
echo esc_html( $feedback_form_name_label_text ); ?> <span>*</span> <br>
				<input type="text" id="message_name" name="message_name" aria-label="<?php echo esc_html( 'Name', 'betterdocs' ); ?>" value="<?php echo esc_attr( $name ); ?>" />
			</label>
		</p>
		<p>
			<label for="message_email" class="form-email">
				<?php echo esc_html( $feedback_form_email_label_text ); ?> <span>*</span> <br>
				<input type="text" id="message_email" name="message_email" aria-label="<?php echo esc_html( 'Email', 'betterdocs' ); ?>" value="<?php echo esc_attr( $email ); ?>" />
			</label>
		</p>
		<p>
			<label for="message_text" class="form-message">
				<?php echo esc_html( $feedback_form_message_label_text ); ?> <span>*</span> <br>
				<textarea type="text" id="message_text" aria-label="<?php echo esc_html( 'Message', 'betterdocs' ); ?>" name="message_text"></textarea>
			</label>
		</p>
		<?php // Spam traps: people never see or fill this field, and the token times the form (#231). ?>
		<p class="betterdocs-feedback-form-website" aria-hidden="true" style="position:absolute !important;left:-10000px !important;width:1px;height:1px;overflow:hidden;">
			<label for="message_website"><?php esc_html_e( 'Leave this field empty', 'betterdocs' ); ?>
				<input type="text" id="message_website" name="message_website" value="" tabindex="-1" autocomplete="off" />
			</label>
		</p>
		<div class="feedback-from-button">
			<input type="hidden" name="submitted" value="1">
			<input type="hidden" name="form_token" value="<?php echo esc_attr( isset( $form_token ) ? $form_token : '' ); ?>">
			<input
				type="submit" name="submit" class="button" aria-label="<?php echo esc_html( 'Submit', 'betterdocs' ); ?>" id="feedback_form_submit_btn"
				value="<?php echo esc_attr( $button_text ); ?>"
			/>
		</div>
	</form>
</div>