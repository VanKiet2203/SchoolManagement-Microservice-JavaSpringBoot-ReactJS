package com.sagroup.userservice.controller;

import com.sagroup.userservice.dtos.NewAppUserDto;
import com.sagroup.userservice.dtos.NewUserRequest;
import com.sagroup.userservice.dtos.ResetPasswordRequest;
import com.sagroup.userservice.entity.NewAppUser;
import com.sagroup.userservice.service.NewAppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/users")
public class NewAppUserController {

    private NewAppUserService userService;

    @GetMapping("/view")
    public List<NewAppUser> viewAll(){
        return userService.viewAll();
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody NewAppUserDto userDto){
        NewAppUser user = userService.save(userDto);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/auth/request-reset")
    public ResponseEntity<?> requestReset(@RequestParam String email) {
        userService.generateResetToken(email);
        return ResponseEntity.ok("Reset token sent to email.");
    }

    @PostMapping("/auth/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Password reset successfully.");
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody NewAppUserDto userDto){
        NewAppUser user = userService.update(userDto);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public void remove(@PathVariable String id){
        userService.removeById(id);
    }

    @Autowired
    public void setUserService(NewAppUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody NewUserRequest request) {
        NewAppUserDto dto = new NewAppUserDto();
        dto.setEmail(request.getEmail());
        dto.setUsername(request.getEmail());
        dto.setRole(request.getRole());
        dto.setPassword("123456");
        NewAppUser user = userService.save(dto);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

}
