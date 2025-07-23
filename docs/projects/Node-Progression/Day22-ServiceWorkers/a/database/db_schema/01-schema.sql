/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE IF NOT EXISTS `county` (
  `cty_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cty_name` varchar(100) NOT NULL,
  PRIMARY KEY (`cty_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `park` (
  `par_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `par_name` varchar(100) NOT NULL DEFAULT '0',
  `par_lat` decimal(10,8) DEFAULT NULL,
  `par_lon` decimal(10,8) DEFAULT NULL,
  PRIMARY KEY (`par_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `park_county` (
  `pct_par_id` int(10) unsigned NOT NULL,
  `pct_cty_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`pct_par_id`,`pct_cty_id`),
  KEY `FK_PCT_CTY` (`pct_cty_id`),
  CONSTRAINT `FK_PCT_CTY` FOREIGN KEY (`pct_cty_id`) REFERENCES `county` (`cty_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_PCT_PAR` FOREIGN KEY (`pct_par_id`) REFERENCES `park` (`par_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user` (
  `usr_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `usr_first_name` varchar(100) NOT NULL,
  `usr_last_name` varchar(100) NOT NULL,
  `usr_username` varchar(150) NOT NULL,
  `usr_password` varchar(255) NOT NULL,
  `usr_salt` varchar(100) NOT NULL,
  `usr_avatar` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`usr_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_visit` (
  `uvs_usr_id` int(10) unsigned NOT NULL,
  `uvs_par_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`uvs_usr_id`,`uvs_par_id`),
  KEY `FK_UVS_PAR` (`uvs_par_id`),
  CONSTRAINT `FK_UVS_PAR` FOREIGN KEY (`uvs_par_id`) REFERENCES `park` (`par_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_UVS_USR` FOREIGN KEY (`uvs_usr_id`) REFERENCES `user` (`usr_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
