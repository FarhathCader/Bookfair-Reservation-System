package com.bookfair.stall.repository;

import com.bookfair.stall.entity.Stall;
import com.bookfair.stall.entity.StallSize;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface StallRepository extends JpaRepository<Stall, Long> {

    List<Stall> findByReservedFalse();

    List<Stall> findBySizeAndReservedFalse(StallSize size);

    Optional<Stall> findByCode(String code);

    @EntityGraph(attributePaths = {"reservations", "reservations.user"})
    @Query("select s from Stall s")
    List<Stall> findAllWithReservations();
}

