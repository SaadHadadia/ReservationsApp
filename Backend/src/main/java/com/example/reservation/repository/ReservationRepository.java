package com.example.reservation.repository;

import com.example.reservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByRoomId(Long roomId);

    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.room.id = :roomId AND " +
           "((:startTime BETWEEN r.timeSlot.startTime AND r.timeSlot.endTime) OR " +
           "(:endTime BETWEEN r.timeSlot.startTime AND r.timeSlot.endTime) OR " +
           "(r.timeSlot.startTime BETWEEN :startTime AND :endTime))")
    boolean isRoomReserved(@Param("roomId") Long roomId,
                           @Param("startTime") LocalDateTime startTime,
                           @Param("endTime") LocalDateTime endTime);
}