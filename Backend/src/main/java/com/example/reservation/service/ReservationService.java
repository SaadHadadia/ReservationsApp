package com.example.reservation.service;

import com.example.reservation.exception.ResourceNotFoundException;
import com.example.reservation.model.Reservation;
import com.example.reservation.model.Room;
import com.example.reservation.model.TimeSlot;
import com.example.reservation.model.User;
import com.example.reservation.repository.ReservationRepository;
import com.example.reservation.repository.RoomRepository;
import com.example.reservation.repository.UserRepository;
import com.example.reservation.repository.TimeSlotRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.example.reservation.model.enums.Role;

import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final TimeSlotRepository timeSlotRepository;

    public ReservationService(ReservationRepository reservationRepository, UserRepository userRepository,
                              RoomRepository roomRepository, TimeSlotRepository timeSlotRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.timeSlotRepository = timeSlotRepository;
    }

    public Reservation create(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }

    public Reservation getById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
    }

    public Reservation update(Long id, Reservation updated) {
        Reservation existing = getById(id);
        existing.setRoom(updated.getRoom());
        existing.setUser(updated.getUser());
        existing.setTimeSlot(updated.getTimeSlot()); // Mise à jour du TimeSlot
        return reservationRepository.save(existing);
    }

    public void delete(Long id) {
        reservationRepository.deleteById(id);
    }

    public Reservation reserveRoom(TimeSlot timeSlot, Long roomId) {
        // Validate the time slot
        if (timeSlot.getStartTime().isAfter(timeSlot.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // Check if the room is already reserved at the given time
        boolean isReserved = reservationRepository.isRoomReserved(
                roomId, timeSlot.getStartTime(), timeSlot.getEndTime());
        if (isReserved) {
            throw new IllegalStateException("The room is already reserved for the specified time slot");
        }

        // Create a new reservation
        Reservation reservation = new Reservation();
        reservation.setTimeSlot(timeSlot);

        // Retrieve the authenticated user
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Check if the user has the USER role
            if (!user.getRole().equals(Role.USER)) {
                throw new IllegalStateException("Only users with role USER can make reservations");
            }

            // Retrieve the room by ID
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

            // Associate the user and room with the reservation
            reservation.setUser(user);
            reservation.setRoom(room);

            // Save the TimeSlot
            timeSlot.setRoom(room); // Associate the TimeSlot with the room
            timeSlot = timeSlotRepository.save(timeSlot);
            reservation.setTimeSlot(timeSlot);

            // Save the reservation
            return reservationRepository.save(reservation);
        } else {
            throw new IllegalStateException("User not authenticated");
        }
    }
}