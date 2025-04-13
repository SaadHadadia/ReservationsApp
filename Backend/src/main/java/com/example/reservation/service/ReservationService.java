package com.example.reservation.service;

import com.example.reservation.exception.ResourceNotFoundException;
import com.example.reservation.model.Reservation;
import com.example.reservation.model.Room;
import com.example.reservation.model.User;
import com.example.reservation.repository.ReservationRepository;
import com.example.reservation.repository.RoomRepository;
import com.example.reservation.repository.UserRepository;
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

    public ReservationService(ReservationRepository reservationRepository, UserRepository userRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
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
        existing.setCreatedAt(updated.getCreatedAt());
        existing.setTimeSlot(updated.getTimeSlot()); // Mise à jour du TimeSlot
        return reservationRepository.save(existing);
    }

    public void delete(Long id) {
        reservationRepository.deleteById(id);
    }

    public Reservation reserveRoom(Reservation reservation, Long roomId) {
        // Récupérer l'utilisateur connecté
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            User user = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Vérifier si l'utilisateur a le rôle USER
            if (!user.getRole().equals(Role.USER)) {
                throw new IllegalStateException("Only users with role USER can make reservations");
            }

            // Associer l'utilisateur et la salle à la réservation
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));
            reservation.setUser(user);
            reservation.setRoom(room);

            return reservationRepository.save(reservation);
        } else {
            throw new IllegalStateException("User not authenticated");
        }
    }
}