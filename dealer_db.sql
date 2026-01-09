-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 09 Jan 2026 pada 14.29
-- Versi server: 8.0.30
-- Versi PHP: 8.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dealer_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `dealers`
--

CREATE TABLE `dealers` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `service_bookings`
--

CREATE TABLE `service_bookings` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone_no` varchar(255) NOT NULL,
  `vehicle_type` varchar(255) NOT NULL,
  `license_plate` varchar(255) NOT NULL,
  `vehicle_problem` text,
  `service_schedule_id` int DEFAULT NULL,
  `service_time` varchar(255) DEFAULT NULL,
  `service_status_id` int DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `service_bookings`
--

INSERT INTO `service_bookings` (`id`, `name`, `phone_no`, `vehicle_type`, `license_plate`, `vehicle_problem`, `service_schedule_id`, `service_time`, `service_status_id`) VALUES
(1, 'Iqbal Abdul Majid', '08123456789', 'Toyota Avanza', 'B 1234 ABC', 'Ganti oli dan cek rem', 1, '10:00', 2),
(2, 'Iqbal Abdul Majid', '08123456789', 'Toyota Avanza', 'B 1234 ABC', 'Ganti oli dan cek rem', 1, '10:00', 5);

-- --------------------------------------------------------

--
-- Struktur dari tabel `service_schedules`
--

CREATE TABLE `service_schedules` (
  `id` int NOT NULL,
  `schedule_date` date NOT NULL,
  `quota` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `service_schedules`
--

INSERT INTO `service_schedules` (`id`, `schedule_date`, `quota`) VALUES
(1, '2026-01-15', 4);

-- --------------------------------------------------------

--
-- Struktur dari tabel `service_statuses`
--

CREATE TABLE `service_statuses` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `service_statuses`
--

INSERT INTO `service_statuses` (`id`, `name`) VALUES
(1, 'menunggu konfirmasi'),
(2, 'konfirmasi batal'),
(3, 'konfirmasi datang'),
(4, 'tidak datang'),
(5, 'datang');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `dealers`
--
ALTER TABLE `dealers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `service_bookings`
--
ALTER TABLE `service_bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_schedule_id` (`service_schedule_id`),
  ADD KEY `service_status_id` (`service_status_id`);

--
-- Indeks untuk tabel `service_schedules`
--
ALTER TABLE `service_schedules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `schedule_date` (`schedule_date`);

--
-- Indeks untuk tabel `service_statuses`
--
ALTER TABLE `service_statuses`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `dealers`
--
ALTER TABLE `dealers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `service_bookings`
--
ALTER TABLE `service_bookings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `service_schedules`
--
ALTER TABLE `service_schedules`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `service_statuses`
--
ALTER TABLE `service_statuses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `service_bookings`
--
ALTER TABLE `service_bookings`
  ADD CONSTRAINT `service_bookings_ibfk_1` FOREIGN KEY (`service_schedule_id`) REFERENCES `service_schedules` (`id`),
  ADD CONSTRAINT `service_bookings_ibfk_2` FOREIGN KEY (`service_status_id`) REFERENCES `service_statuses` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
