package com.bookfair.stall.service;

import com.bookfair.reservation.entity.Reservation;
import com.bookfair.stall.dto.StallRequest;
import com.bookfair.stall.dto.StallResponse;
import com.bookfair.stall.entity.Stall;
import com.bookfair.stall.entity.StallSize;
import com.bookfair.stall.repository.StallRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StallService {

    private final StallRepository stallRepository;

    @Transactional(readOnly = true)
    public List<StallResponse> getStalls(boolean availableOnly, StallSize sizeFilter) {
        List<Stall> stalls = stallRepository.findAllWithReservations();

        if (availableOnly) {
            stalls = stalls.stream()
                    .filter(stall -> !stall.isReserved())
                    .collect(Collectors.toList());
        }

        if (sizeFilter != null) {
            StallSize filter = sizeFilter;
            stalls = stalls.stream()
                    .filter(stall -> stall.getSize() == filter)
                    .collect(Collectors.toList());
        }

        return stalls.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public StallResponse createStall(StallRequest request) {
        stallRepository.findByCode(request.getCode()).ifPresent(stall -> {
            throw new IllegalArgumentException("Stall code already exists");
        });

        Stall stall = Stall.builder()
                .code(request.getCode().toUpperCase())
                .size(request.getSize())
                .description(request.getDescription())
                .reserved(false)
                .build();

        Stall saved = stallRepository.save(stall);
        log.info("Created new stall {}", saved.getCode());
        return toResponse(saved);
    }

    @Transactional
    public StallResponse releaseStall(Long id) {
        Stall stall = stallRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stall not found"));
        stall.setReserved(false);
        Stall saved = stallRepository.save(stall);
        return toResponse(saved);
    }

    private StallResponse toResponse(Stall stall) {
        Optional<String> reservedBy = stall.getReservations().stream()
                .sorted(Comparator.comparing(Reservation::getReservedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(reservation -> reservation.getUser() != null ? reservation.getUser().getEmail() : null)
                .filter(email -> email != null && !email.isBlank())
                .findFirst();

        String status = stall.isReserved() ? "BOOKED" : "AVAILABLE";

        return StallResponse.builder()
                .id(stall.getId())
                .code(stall.getCode())
                .size(stall.getSize())
                .description(stall.getDescription())
                .reserved(stall.isReserved())
                .status(status)
                .reservedBy(reservedBy.orElse(null))
                .build();
    }
}

