package com.example.reservation.service;

import com.example.reservation.exception.ResourceNotFoundException;
import com.example.reservation.model.Reservation;
import com.example.reservation.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;

    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
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
}