<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('WP_CACHE', true);
define( 'WPCACHEHOME', '/home/affordab/public_html/rahapropertiesllc.com/wp-content/plugins/wp-super-cache/' );
define( 'DB_NAME', 'affordab_wp_vroqr' );

/** Database username */
define( 'DB_USER', 'affordab_wp_huazl' );

/** Database password */
define( 'DB_PASSWORD', '77N3ta*tl_fTIS7Y' );

/** Database hostname */
define( 'DB_HOST', 'localhost:3306' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', 'gyvtq5b]jOw8q432)S(Dx3kQ7sMY&)N1[z~UQu/@[j!672~(pzb&382W#9:/vF*/');
define('SECURE_AUTH_KEY', '8%fSLum|)!ab9_6fpF0UUK0FUR8m91P&834d5YO71pK%BbN[8~2%crPDk77B1LO~');
define('LOGGED_IN_KEY', '5l)l2;4]ZQ3|+W:~qI(H[v3[1Q]jR/~vmsb#2]%:7:5GqF849:84Mo*6rtB|(*lk');
define('NONCE_KEY', 'E9zM2V3J38CZjt#@C8xDRt;5lLg!bGuWv(x06Lo)4z|UkWYJ7m1E4w4k+SJ2038A');
define('AUTH_SALT', '3T[8@2f1_p&a4Mk080g6AU!L4(]KR43L|+5o!i68H!|2T28WS653_!@3N5zUmE/1');
define('SECURE_AUTH_SALT', 'x2G;znb;&i%f_[spCws2;LW_;mvVXc6&C93Q23j6vKFC(X8T(WVd0Ts:Il(yElm1');
define('LOGGED_IN_SALT', 'pPrV9#[[p2h71F:vl4PH88AIE%t*c~gS&-]cUzB[J5b0:O]F2++BQhCRV6JzHm4C');
define('NONCE_SALT', 'sAu7/Jwuen:y!c1Ii9OhYw4QG68j~kP7lb!iq8~73I13480w6l#)&3SJ5Y-G~u!m');


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'ncUam8N_';


/* Add any custom values between this line and the "stop editing" line. */

define('WP_ALLOW_MULTISITE', true);
/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
