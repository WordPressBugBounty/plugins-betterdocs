<?php

    // Get the author's ID
    $author_id = get_post_field( 'post_author', get_the_ID() );

    // Get the author's avatar with a specified size
    $avatar_size   = 40;
    $author_avatar = get_avatar( $author_id, $avatar_size );
    $authors_url   = site_url() . '/' . betterdocs()->settings->get( 'docs_slug' ) . '/authors/' . $author_id . '/page/1';

?>

<a class="betterdocs-author-date" href="<?php echo $authors_url; ?>">
    <div class="betterdocs-author">
        <?php
            echo '<div class="author-avatar">' . $author_avatar . '</div>';
            echo '<span>' . get_the_author_meta( 'display_name', $author_id ) . '</span>';
        ?>
    </div>
    <?php betterdocs()->views->get( 'template-parts/update-date' );?>
</a>
