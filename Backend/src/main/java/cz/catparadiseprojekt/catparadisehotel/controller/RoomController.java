package cz.catparadiseprojekt.catparadisehotel.controller;

import cz.catparadiseprojekt.catparadisehotel.model.Room;
import cz.catparadiseprojekt.catparadisehotel.model.RoomType;
import cz.catparadiseprojekt.catparadisehotel.service.ReservationService;
import cz.catparadiseprojekt.catparadisehotel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;
    private final ReservationService reservationService;

    @Autowired
    public RoomController(RoomService roomService,  ReservationService reservationService) {
        this.roomService = roomService;
        this.reservationService = reservationService;
    }

    @PostMapping
    public Room createRoom(@RequestBody Room room) {
        return roomService.saveRoom(room);
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public Optional<Room> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id);
    }

    @GetMapping("/type/{roomType}")
    public List<Room> getRoomsByType(@PathVariable RoomType roomType) {
        return roomService.getRoomsByType(roomType);
    }

    @PutMapping("/{id}")
    public Room updateRoom(@PathVariable Long id, @RequestBody Room room) {
        return roomService.updateRoom(id, room);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
    }
}