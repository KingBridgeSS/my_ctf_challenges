package com.example.wordsserver.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

public class indexGetController {
    @RequestMapping(method = RequestMethod.GET, value = "/")
    public String indexGetController() {
        return "index.html";
    }
}
