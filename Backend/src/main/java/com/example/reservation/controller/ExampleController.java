package com.example.backend.controller;

import com.example.backend.dto.ExampleDTO;
import com.example.backend.model.ExampleModel;
import com.example.backend.service.ExampleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examples")
public class ExampleController {

    @Autowired
    private ExampleService exampleService;

    @GetMapping
    public ResponseEntity<List<ExampleModel>> getExample() {
        List<ExampleModel> examples = exampleService.findAllExamples();
        return ResponseEntity.ok(examples);
    }

    @PostMapping
    public ResponseEntity<ExampleModel> createExample(@RequestBody ExampleDTO exampleDTO) {
        ExampleModel createdExample = exampleService.saveExample(exampleDTO);
        return ResponseEntity.status(201).body(createdExample);
    }
}