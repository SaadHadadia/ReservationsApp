package com.example.backend.service;

import com.example.backend.model.ExampleModel;
import com.example.backend.repository.ExampleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExampleService {

    private final ExampleRepository exampleRepository;

    @Autowired
    public ExampleService(ExampleRepository exampleRepository) {
        this.exampleRepository = exampleRepository;
    }

    public List<ExampleModel> findAllExamples() {
        return exampleRepository.findAll();
    }

    public ExampleModel saveExample(ExampleModel exampleModel) {
        return exampleRepository.save(exampleModel);
    }
}