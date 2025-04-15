package com.example.reservation.dto;

import lombok.Data;

@Data
public class CreateReservationRequest {
    private Long roomId;
    private String date;
    private String startTime;
    private String endTime;
    private String purpose;
    private Integer attendees;
    private Long userId;
} 