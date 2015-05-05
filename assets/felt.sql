-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2015 at 06:16 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `felt`
--

-- --------------------------------------------------------

--
-- Table structure for table `lokidbs`
--

CREATE TABLE IF NOT EXISTS `lokidbs` (
  `name` varchar(40) COLLATE utf8_unicode_ci NOT NULL COMMENT 'the name of loki db',
  `data` text COLLATE utf8_unicode_ci NOT NULL COMMENT 'loki data',
  `time_modified` timestamp NOT NULL COMMENT 'last time modified',
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='loki memory databases persisted here';

--
-- Dumping data for table `lokidbs`
--

INSERT INTO `lokidbs` (`name`, `data`, `time_modified`) VALUES
('general.json', '{"filename":"general.json","collections":[{"name":"test","data":[{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428759910653,"version":0,"updated":1428759910656},"$loki":1},{"name":"jeff1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":0,"created":1428759910653,"version":0},"$loki":1},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760001287,"version":0,"updated":1428760001290},"$loki":6},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760002767,"version":0,"updated":1428760002770},"$loki":11},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760004061,"version":0,"updated":1428760004063},"$loki":16},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760006134,"version":0,"updated":1428760006137},"$loki":21},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760007138,"version":0,"updated":1428760007141},"$loki":26},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760007779,"version":0,"updated":1428760007782},"$loki":31},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760008472,"version":0,"updated":1428760008474},"$loki":36},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760009100,"version":0,"updated":1428760009103},"$loki":41},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760009739,"version":0,"updated":1428760009742},"$loki":46},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760010330,"version":0,"updated":1428760010333},"$loki":51},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760011728,"version":0,"updated":1428760011731},"$loki":56},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760012435,"version":0,"updated":1428760012438},"$loki":61},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760013124,"version":0,"updated":1428760013126},"$loki":66},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760013719,"version":0,"updated":1428760013721},"$loki":71},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760014296,"version":0,"updated":1428760014298},"$loki":76},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760014867,"version":0,"updated":1428760014870},"$loki":81},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760015513,"version":0,"updated":1428760015515},"$loki":86},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760016150,"version":0,"updated":1428760016153},"$loki":91},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760016769,"version":0,"updated":1428760016772},"$loki":96},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760017356,"version":0,"updated":1428760017359},"$loki":101},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760017939,"version":0,"updated":1428760017942},"$loki":106},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760018515,"version":0,"updated":1428760018517},"$loki":111},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760019090,"version":0,"updated":1428760019093},"$loki":116},{"name":"MANGO JERRY1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":1,"created":1428760019646,"version":0,"updated":1428760019648},"$loki":121}],"idIndex":[1,1,6,11,16,21,26,31,36,41,46,51,56,61,66,71,76,81,86,91,96,101,106,111,116,121],"binaryIndices":{},"constraints":{"unique":{},"exact":{}},"objType":"test","dirty":true,"cachedIndex":null,"cachedBinaryIndex":null,"cachedData":null,"transactional":false,"cloneObjects":false,"asyncListeners":false,"disableChangesApi":false,"maxId":125,"DynamicViews":[],"events":{"insert":[null],"update":[null],"pre-insert":[],"pre-update":[],"close":[],"flushbuffer":[],"error":[],"delete":[null],"warning":[null]},"changes":[{"name":"test","operation":"I","obj":{"name":"jeff1","email":"jeff1@lokijs.org","age":31,"meta":{"revision":0,"created":1428756612687,"version":0},"$loki":1}},{"name":"test","operation":"I","obj":{"name":"jeff2","email":"jeff2@lokijs.org","age":32,"meta":{"revision":0,"created":1428756612688,"version":0},"$loki":2}},{"name":"test","operation":"I","obj":{"name":"jeff3","email":"jeff3@lokijs.org","age":33,"meta":{"revision":0,"created":1428756612688,"version":0},"$loki":3}},{"name":"test","operation":"I","obj":{"name":"jeff4","email":"jeff4@lokijs.org","age":34,"meta":{"revision":0,"created":1428756612688,"version":0},"$loki":4}}]}],"databaseVersion":1.1,"engineVersion":1.1,"autosave":false,"autosaveInterval":10000,"autosaveHandle":null,"options":{"autoload":true,"autosave":false,"autosaveInterval":10000,"persistenceMethod":"adapter","adapter":{"options":{}}},"persistenceMethod":"adapter","persistenceAdapter":null,"events":{"init":[null],"flushChanges":[],"close":[],"changes":[],"warning":[]},"ENV":"BROWSER"}', '0000-00-00 00:00:00'),
('test', '{''name'':''Jeff is here''}', '2015-04-11 09:55:56');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
