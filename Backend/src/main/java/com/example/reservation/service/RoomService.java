package com.example.reservation.service;

import com.example.reservation.exception.ResourceNotFoundException;
import com.example.reservation.model.Room;
import com.example.reservation.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room create(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAll() {
        return roomRepository.findAll();
    }

    public Room getById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
    }

    public Room update(Long id, Room updated) {
        Room existing = getById(id);
        existing.setName(updated.getName());
        existing.setCapacity(updated.getCapacity());
        existing.setLocation(updated.getLocation());
        return roomRepository.save(existing);
    }

    public void delete(Long id) {
        roomRepository.deleteById(id);
    }
}