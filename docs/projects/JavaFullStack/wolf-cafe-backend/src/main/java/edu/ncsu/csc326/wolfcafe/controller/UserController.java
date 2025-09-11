package edu.ncsu.csc326.wolfcafe.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.ncsu.csc326.wolfcafe.dto.UserDto;
import edu.ncsu.csc326.wolfcafe.service.UserService;

@CrossOrigin ( "*" )
@RestController
@RequestMapping ( "/api/users" )
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;
    /**
     * Retrieves the current logged-in user.
     * 
     * This endpoint returns the details of the currently authenticated user.
     * 
     * 
     * @return ResponseEntity containing the UserDto of the current user.
     */
    @GetMapping ( "/me" )
    public ResponseEntity<UserDto> getCurrentUser () {
        final UserDto userDto = modelMapper.map( userService.fetchCurrentUser(), UserDto.class );
        return ResponseEntity.ok( userDto );
    }
}
